import "server-only";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { COMPANIES_COLLECTION, type Company } from "@/lib/platform/tenancy/companies";
import { companyBaseUrl } from "@/lib/platform/tenancy/provisioning";
import { sendEmail } from "@/lib/platform/email";
import { renderEmail } from "@/lib/platform/email/template";
import { getPlan } from "@/lib/platform/billing/plans";
import { getCompanySubscription, updateCompanySubscription } from "@/lib/platform/billing/subscription";
import { issueSaasInvoice, type IssueSaasInvoiceInput, type SaasInvoiceRef } from "@/lib/platform/billing/invoices";
import { planPrice, priceWithGst, validateBillingDetails, type BillingDetails, type BillingDetailsErrors } from "@/lib/platform/billing/billing-details";
import {
  RazorpayError,
  cancelRazorpaySubscription,
  cancelScheduledChanges,
  createCustomer,
  createSubscription,
  ensureRazorpayPlan,
  fetchInvoiceSubscriptionId,
  fetchSubscription,
  findPlanByRazorpayId,
  razorpayConfigured,
  razorpayKeyId,
  updateSubscriptionPlan,
  verifyCheckoutSignature,
  type RazorpayPayment,
  type RazorpaySubscription,
} from "@/lib/platform/billing/razorpay";
import { GRACE_DAYS, formatMoney, type BillingInterval, type CompanySubscription, type SubscriptionStatus } from "@/lib/platform/billing/types";

/**
 * Paid subscriptions through Razorpay (the platform owner's own account).
 *
 *  checkout   startCheckout → Razorpay Checkout in the browser → confirmCheckout
 *             (signature-verified; the subscription is re-fetched from Razorpay,
 *             never taken from the browser). A company still in its trial is
 *             charged when the trial ends (`start_at`).
 *  renewals   the webhook (`handleWebhook`) — charged → active + new period +
 *             SaaS invoice; pending / payment.failed → past_due; halted → grace;
 *             cancelled / completed → canceled.
 *  dunning    `runDunningSweep` (daily cron): past_due → grace after
 *             MAX_FAILED_PAYMENTS failures or PAST_DUE_MAX_DAYS; grace →
 *             suspended after GRACE_DAYS; expired trials → suspended; missed
 *             renewals reconciled against Razorpay.
 *  changes    changePlan (scheduled for the end of the period once paid),
 *             cancelSubscription (at period end / now), resume (a new
 *             subscription starting when the current period ends — Razorpay
 *             can't un-cancel).
 *
 * Every mutation re-reads the company's current subscription first. Amounts
 * come from the plans catalogue (checkout) or from Razorpay (webhook
 * charges), never from the browser. The platform owner is never billed.
 */

export const MAX_FAILED_PAYMENTS = 3;
export const PAST_DUE_MAX_DAYS = 7;
/** A trial whose first charge is scheduled gets this long after trial end before it's suspended. */
const TRIAL_CHARGE_WAIT_MS = 2 * 86_400_000;
const DAY_MS = 86_400_000;

export type BillingActionResult = { ok: true; message?: string } | { ok: false; error: string };

export interface CheckoutPayload {
  key: string;
  subscriptionId: string;
  name: string;
  description: string;
  /** GST-inclusive, smallest currency unit — display only; Razorpay charges the plan's own amount. */
  amount: number;
  currency: string;
  prefill: { name: string; email: string };
  /** First charge date (ISO) when the charge waits for the trial / current period to end. */
  startsAt: string | null;
}

export type StartCheckoutResult = { ok: true; checkout: CheckoutPayload } | { ok: false; error: string };

export interface CheckoutResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

type CompanyDoc = Company & { subscription?: CompanySubscription };

async function companies() {
  return (await getPlatformDb()).collection<CompanyDoc>(COMPANIES_COLLECTION);
}

// ── Test seam: the invoices workstream implements issueSaasInvoice ─────────────

let invoiceIssuer: (input: IssueSaasInvoiceInput) => Promise<SaasInvoiceRef | null> = issueSaasInvoice;
/** Tests only: observe invoice issuing. */
export function __setInvoiceIssuerForTests(fn: typeof invoiceIssuer | null): void {
  invoiceIssuer = fn ?? issueSaasInvoice;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const LIVE_STATUSES = new Set<SubscriptionStatus>(["trialing", "active", "past_due", "grace"]);

/** A Razorpay subscription is attached, still running and not scheduled to end — change it rather than start another. */
export function hasLiveSubscription(sub: CompanySubscription | null): boolean {
  return Boolean(sub?.provider?.subscriptionId) && LIVE_STATUSES.has(sub!.status) && !sub!.cancelAtPeriodEnd;
}

function fromUnix(s: number | null | undefined): Date | null {
  return typeof s === "number" && s > 0 ? new Date(s * 1000) : null;
}

function noteOf(entity: RazorpaySubscription, key: string): string | null {
  const notes = entity.notes;
  if (!notes || Array.isArray(notes)) return null;
  const v = notes[key];
  return typeof v === "string" && v ? v : null;
}

function isInterval(v: unknown): v is BillingInterval {
  return v === "monthly" || v === "yearly";
}

function friendly(err: unknown, fallback: string): string {
  if (err instanceof RazorpayError) {
    console.error("[billing] Razorpay error", err.status, err.code, err.message);
    return err.code === "NOT_CONFIGURED" ? "Online billing isn't configured yet." : `${fallback} Razorpay said: ${err.message}`;
  }
  console.error("[billing]", err);
  return fallback;
}

function fmtDate(d: Date | null | undefined): string {
  return d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }) : "—";
}

/** Which of our plans a Razorpay subscription is for: our own notes first, else its Razorpay plan id. */
async function resolvePlan(entity: RazorpaySubscription): Promise<{ planId: string; interval: BillingInterval } | null> {
  const byPlanId = await findPlanByRazorpayId(entity.plan_id);
  if (byPlanId) return { planId: byPlanId.plan._id, interval: byPlanId.interval };
  const planId = noteOf(entity, "planId");
  const interval = noteOf(entity, "interval");
  return planId && isInterval(interval) ? { planId, interval } : null;
}

/** Status/period patch for a Razorpay subscription state. */
function patchFromEntity(current: CompanySubscription, entity: RazorpaySubscription): Partial<CompanySubscription> {
  const start = fromUnix(entity.current_start);
  const end = fromUnix(entity.current_end);
  const period = end && (!current.currentPeriodEnd || end.getTime() >= current.currentPeriodEnd.getTime()) ? { currentPeriodStart: start, currentPeriodEnd: end } : {};
  switch (entity.status) {
    case "active":
      return { status: "active", graceEndsAt: null, dunning: null, ...period };
    case "pending":
      return current.status === "active" || current.status === "trialing" ? { status: "past_due", dunning: { failedPayments: current.dunning?.failedPayments ?? 0, pastDueSince: current.dunning?.pastDueSince ?? new Date() } } : {};
    case "halted":
      return current.status === "grace" || current.status === "suspended" ? {} : { status: "grace", graceEndsAt: new Date(Date.now() + GRACE_DAYS * DAY_MS) };
    case "cancelled":
    case "completed":
    case "expired":
      return { status: "canceled", cancelAtPeriodEnd: false, pendingChange: null, graceEndsAt: null };
    default:
      // created / authenticated (first charge still scheduled) / paused: status unchanged.
      return {};
  }
}

async function billingRecipient(companyId: string, sub: CompanySubscription | null): Promise<string | null> {
  if (sub?.billingDetails?.email) return sub.billingDetails.email;
  const owner = await (await getPlatformDb())
    .collection<{ companyId: string; email: string; roles: string[]; createdAt: Date }>("admin_users")
    .findOne({ companyId, roles: "super_admin" }, { sort: { createdAt: 1, _id: 1 }, projection: { email: 1 } });
  return owner?.email ?? null;
}

type NoticeKind = "payment_failed" | "grace" | "suspended" | "trial_ending" | "trial_ended" | "canceled";

/** Billing emails to the company's billing contact (or first Super Admin). Never throws. */
async function notify(companyId: string, kind: NoticeKind): Promise<void> {
  try {
    const company = await (await companies()).findOne({ _id: companyId }, { projection: { name: 1, slug: 1, subscription: 1 } });
    if (!company) return;
    const sub = company.subscription ?? null;
    const to = await billingRecipient(companyId, sub);
    if (!to) return;
    const plan = sub ? await getPlan(sub.planId) : null;
    const planName = plan?.name ?? "your plan";
    const url = `${companyBaseUrl(company.slug)}/settings/billing`;
    const copy: Record<NoticeKind, { subject: string; heading: string; paragraphs: string[]; label: string }> = {
      payment_failed: {
        subject: `Payment failed for ${company.name}`,
        heading: "We couldn't collect your subscription payment",
        paragraphs: [`The renewal payment for ${company.name} (${planName}) didn't go through. Razorpay will retry automatically over the next few days.`, "Please make sure your card or UPI mandate has funds, or update your payment method, to avoid interruption."],
        label: "Review billing",
      },
      grace: {
        subject: `Action needed: ${company.name} subscription in grace period`,
        heading: "Your subscription payment is overdue",
        paragraphs: [`We couldn't collect payment for ${company.name}. Your workspace keeps working until ${fmtDate(sub?.graceEndsAt)}, after which it becomes read-only.`, "Renew your subscription from the billing page to keep full access."],
        label: "Renew subscription",
      },
      suspended: {
        subject: `${company.name} is now read-only`,
        heading: "Your workspace is read-only",
        paragraphs: [`We didn't receive payment for ${company.name}, so the workspace is now read-only. Your data is safe.`, "Subscribe again from the billing page to restore full access."],
        label: "Restore access",
      },
      trial_ending: {
        subject: `Your ${company.name} trial ends soon`,
        heading: "Your free trial ends in 3 days",
        paragraphs: [`The trial of ${planName} for ${company.name} ends on ${fmtDate(sub?.trialEndsAt)}.`, "Choose a plan to keep your workspace running without interruption."],
        label: "Choose a plan",
      },
      trial_ended: {
        subject: `Your ${company.name} trial has ended`,
        heading: "Your free trial has ended",
        paragraphs: [`The trial for ${company.name} is over and the workspace is now read-only. Your data is safe.`, "Choose a plan to restore full access."],
        label: "Choose a plan",
      },
      canceled: {
        subject: `${company.name} subscription canceled`,
        heading: "Your subscription has ended",
        paragraphs: [`The ${planName} subscription for ${company.name} has ended and the workspace is now read-only. Your data is safe.`, "You can subscribe again at any time."],
        label: "Subscribe again",
      },
    };
    const c = copy[kind];
    const { html, text } = renderEmail({ brand: company.name, heading: c.heading, paragraphs: c.paragraphs, action: { label: c.label, url } });
    await sendEmail({ to, subject: c.subject, html, text });
  } catch (err) {
    console.error(`[billing] ${kind} email failed for ${companyId}`, err);
  }
}

async function issueInvoice(companyId: string, entity: RazorpaySubscription, payment: { id: string; amount: number; currency: string }): Promise<void> {
  const sub = await getCompanySubscription(companyId);
  if (!sub || sub.status === "internal") return;
  const resolved = await resolvePlan(entity);
  const interval = resolved?.interval ?? sub.interval;
  const periodStart = fromUnix(entity.current_start) ?? new Date();
  const periodEnd = fromUnix(entity.current_end) ?? new Date(periodStart.getTime() + (interval === "yearly" ? 365 : 30) * DAY_MS);
  await invoiceIssuer({ companyId, planId: resolved?.planId ?? sub.planId, interval, periodStart, periodEnd, amount: payment.amount, currency: payment.currency, paymentRef: payment.id });
}

/**
 * Makes a (signature-verified) Razorpay subscription the company's current
 * one: provider ids, plan, status and period. A different subscription the
 * company had before is canceled at Razorpay (best effort).
 */
async function adoptSubscription(companyId: string, entity: RazorpaySubscription): Promise<CompanySubscription | null> {
  const current = await getCompanySubscription(companyId);
  if (!current || current.status === "internal") return null;
  const resolved = await resolvePlan(entity);
  const previous = current.provider?.subscriptionId ?? null;
  await updateCompanySubscription(companyId, {
    provider: { id: "razorpay", subscriptionId: entity.id, customerId: entity.customer_id ?? current.provider?.customerId ?? null },
    cancelAtPeriodEnd: false,
    pendingChange: null,
    ...(resolved ?? {}),
    ...patchFromEntity(current, entity),
  });
  if (previous && previous !== entity.id) {
    await cancelRazorpaySubscription(previous, false).catch((err) => console.warn(`[billing] couldn't cancel replaced subscription ${previous}`, err instanceof Error ? err.message : err));
  }
  return getCompanySubscription(companyId);
}

/** When the first charge of a new subscription should happen: at trial end / after an already-paid period, else now. */
function checkoutStartAt(sub: CompanySubscription, now: number): Date | null {
  const until = sub.status === "trialing" ? sub.trialEndsAt : sub.status === "active" && sub.cancelAtPeriodEnd ? sub.currentPeriodEnd : null;
  if (!until) return null;
  // Charge an hour early so access never lapses while the charge is processed.
  const at = until.getTime() - 3_600_000;
  return at > now + 15 * 60_000 ? new Date(at) : null;
}

// ── Billing details ──────────────────────────────────────────────────────────

export async function saveBillingDetails(companyId: string, input: Partial<Record<keyof BillingDetails, unknown>>): Promise<{ ok: true; details: BillingDetails } | { ok: false; errors: BillingDetailsErrors }> {
  const sub = await getCompanySubscription(companyId);
  if (!sub || sub.status === "internal") return { ok: false, errors: { legalName: "The platform owner's workspace isn't billed." } };
  const res = validateBillingDetails(input);
  if (!res.ok) return res;
  await updateCompanySubscription(companyId, { billingDetails: res.value });
  return { ok: true, details: res.value };
}

// ── Checkout ─────────────────────────────────────────────────────────────────

export async function startCheckout(companyId: string, input: { planId: string; interval: BillingInterval }): Promise<StartCheckoutResult> {
  if (!razorpayConfigured()) return { ok: false, error: "Online billing isn't configured yet. Please contact support." };
  const company = await (await companies()).findOne({ _id: companyId }, { projection: { name: 1, slug: 1, isPlatformOwner: 1 } });
  if (!company) return { ok: false, error: "Unknown workspace." };
  const sub = await getCompanySubscription(companyId);
  if (company.isPlatformOwner || !sub || sub.status === "internal") return { ok: false, error: "The platform owner's workspace isn't billed." };
  if (!isInterval(input.interval)) return { ok: false, error: "Choose monthly or yearly billing." };
  if (hasLiveSubscription(sub)) return { ok: false, error: "You already have a subscription — change your plan instead." };
  const plan = await getPlan(String(input.planId ?? ""));
  if (!plan || !plan.active) return { ok: false, error: "That plan isn't available." };
  const net = planPrice(plan, input.interval);
  if (!Number.isInteger(net) || net <= 0) return { ok: false, error: "That plan has no price for this billing period yet." };
  const details = sub.billingDetails;
  if (!details) return { ok: false, error: "Add your billing details before subscribing — they go on your GST invoices." };

  try {
    let customerId = sub.provider?.customerId ?? null;
    if (!customerId) {
      customerId = (await createCustomer({ name: details.legalName, email: details.email, gstin: details.gstin, notes: { companyId } })).id;
      await updateCompanySubscription(companyId, { provider: { id: "razorpay", subscriptionId: sub.provider?.subscriptionId ?? null, customerId } });
    }
    const razorpayPlanId = await ensureRazorpayPlan(plan, input.interval);
    const startsAt = checkoutStartAt(sub, Date.now());
    const created = await createSubscription({
      planId: razorpayPlanId,
      customerId,
      interval: input.interval,
      startAt: startsAt ? Math.floor(startsAt.getTime() / 1000) : null,
      // Set by us and read back from Razorpay on confirm/webhook — never from the browser.
      notes: { companyId, planId: plan._id, interval: input.interval, purpose: "platform_subscription" },
    });
    return {
      ok: true,
      checkout: {
        key: razorpayKeyId(),
        subscriptionId: created.id,
        name: company.name,
        description: `${plan.name} plan · ${input.interval === "yearly" ? "yearly" : "monthly"} (incl. 18% GST)`,
        amount: priceWithGst(net).total,
        currency: plan.currency,
        prefill: { name: details.legalName, email: details.email },
        startsAt: startsAt?.toISOString() ?? null,
      },
    };
  } catch (err) {
    return { ok: false, error: friendly(err, "We couldn't start the checkout. Please try again.") };
  }
}

/** Called with Razorpay Checkout's handler response. Activation only after the signature and Razorpay's own record agree. */
export async function confirmCheckout(companyId: string, response: CheckoutResponse): Promise<BillingActionResult> {
  const paymentId = String(response?.razorpay_payment_id ?? "");
  const subscriptionId = String(response?.razorpay_subscription_id ?? "");
  const signature = String(response?.razorpay_signature ?? "");
  if (!verifyCheckoutSignature(paymentId, subscriptionId, signature)) return { ok: false, error: "We couldn't verify this payment. If you were charged, it will be confirmed automatically within a few minutes." };
  const sub = await getCompanySubscription(companyId);
  if (!sub || sub.status === "internal") return { ok: false, error: "The platform owner's workspace isn't billed." };

  let entity: RazorpaySubscription;
  try {
    entity = await fetchSubscription(subscriptionId);
  } catch (err) {
    return { ok: false, error: friendly(err, "Payment received, but we couldn't confirm it with Razorpay yet. It will update automatically.") };
  }
  if (noteOf(entity, "companyId") !== companyId) return { ok: false, error: "This payment belongs to a different workspace." };
  if (!["active", "authenticated"].includes(entity.status)) return { ok: false, error: "Razorpay hasn't confirmed the payment yet. This page will update automatically once it does." };

  const updated = await adoptSubscription(companyId, entity);
  if (entity.status === "active" && updated) {
    const plan = await getPlan(updated.planId);
    if (plan) {
      // The webhook issues the same invoice (idempotent on paymentRef); this covers a missed webhook.
      await issueInvoice(companyId, entity, { id: paymentId, amount: priceWithGst(planPrice(plan, updated.interval)).total, currency: plan.currency }).catch((err) =>
        console.error("[billing] invoice on confirm failed (the webhook will retry)", err),
      );
    }
    return { ok: true, message: "Payment received — your subscription is active." };
  }
  const startsAt = fromUnix(entity.start_at ?? entity.charge_at);
  return { ok: true, message: startsAt ? `You're all set. Your first charge is on ${fmtDate(startsAt)}.` : "You're all set." };
}

/** Re-subscribes after a scheduled cancellation: a new subscription whose first charge is when the current period (or trial) ends. */
export async function resumeSubscription(companyId: string): Promise<StartCheckoutResult> {
  const sub = await getCompanySubscription(companyId);
  if (!sub || sub.status === "internal") return { ok: false, error: "The platform owner's workspace isn't billed." };
  if (!sub.cancelAtPeriodEnd) return { ok: false, error: "Your subscription isn't scheduled to end." };
  return startCheckout(companyId, { planId: sub.planId, interval: sub.interval });
}

// ── Plan changes & cancellation ──────────────────────────────────────────────

export async function changePlan(companyId: string, input: { planId: string; interval: BillingInterval }): Promise<BillingActionResult> {
  if (!razorpayConfigured()) return { ok: false, error: "Online billing isn't configured yet." };
  const sub = await getCompanySubscription(companyId);
  if (!sub || sub.status === "internal") return { ok: false, error: "The platform owner's workspace isn't billed." };
  if (!hasLiveSubscription(sub)) return { ok: false, error: "You don't have an active subscription to change — choose a plan to subscribe." };
  if (!isInterval(input.interval)) return { ok: false, error: "Choose monthly or yearly billing." };
  const plan = await getPlan(String(input.planId ?? ""));
  if (!plan || !plan.active) return { ok: false, error: "That plan isn't available." };
  if (planPrice(plan, input.interval) <= 0) return { ok: false, error: "That plan has no price for this billing period yet." };
  const subscriptionId = sub.provider!.subscriptionId!;

  try {
    if (plan._id === sub.planId && input.interval === sub.interval) {
      if (!sub.pendingChange) return { ok: false, error: `You're already on ${plan.name} (${input.interval}).` };
      await cancelScheduledChanges(subscriptionId);
      await updateCompanySubscription(companyId, { pendingChange: null });
      return { ok: true, message: `Scheduled change canceled — you'll stay on ${plan.name}.` };
    }
    const razorpayPlanId = await ensureRazorpayPlan(plan, input.interval);
    const remote = await fetchSubscription(subscriptionId);
    if (remote.status === "authenticated" || remote.status === "created") {
      // Nothing charged yet (still in the trial): switch outright.
      await updateSubscriptionPlan(subscriptionId, razorpayPlanId, "now", input.interval);
      await updateCompanySubscription(companyId, { planId: plan._id, interval: input.interval, pendingChange: null });
      return { ok: true, message: `You're now on ${plan.name}. Your first charge of ${formatMoney(priceWithGst(planPrice(plan, input.interval)).total, plan.currency)} is when your trial ends.` };
    }
    await updateSubscriptionPlan(subscriptionId, razorpayPlanId, "cycle_end", input.interval);
    const effectiveAt = fromUnix(remote.current_end) ?? sub.currentPeriodEnd;
    await updateCompanySubscription(companyId, { pendingChange: { planId: plan._id, interval: input.interval, effectiveAt } });
    return { ok: true, message: `You'll move to ${plan.name} (${input.interval}) on ${fmtDate(effectiveAt)}, when your current period ends.` };
  } catch (err) {
    return { ok: false, error: friendly(err, "We couldn't change your plan. Please try again.") };
  }
}

export async function cancelSubscription(companyId: string, input: { when: "period_end" | "now" }): Promise<BillingActionResult> {
  const sub = await getCompanySubscription(companyId);
  if (!sub || sub.status === "internal") return { ok: false, error: "The platform owner's workspace isn't billed." };
  const subscriptionId = sub.provider?.subscriptionId;
  if (!subscriptionId || !LIVE_STATUSES.has(sub.status)) return { ok: false, error: "There's no active subscription to cancel." };
  const now = input?.when === "now";

  try {
    if (sub.status === "trialing") {
      // Nothing has been charged yet: drop the scheduled subscription; the trial runs out on its own.
      await cancelRazorpaySubscription(subscriptionId, false);
      await updateCompanySubscription(companyId, { provider: { ...sub.provider!, subscriptionId: null }, cancelAtPeriodEnd: true, pendingChange: null });
      return { ok: true, message: `Canceled. You won't be charged; your trial ends on ${fmtDate(sub.trialEndsAt)}.` };
    }
    if (sub.cancelAtPeriodEnd && !now) return { ok: false, error: "Your subscription is already set to end with this period." };
    if (!now && sub.status === "active") {
      await cancelRazorpaySubscription(subscriptionId, true);
      await updateCompanySubscription(companyId, { cancelAtPeriodEnd: true, pendingChange: null });
      return { ok: true, message: `Your subscription will end on ${fmtDate(sub.currentPeriodEnd)}. You keep full access until then.` };
    }
    await cancelRazorpaySubscription(subscriptionId, false);
    await updateCompanySubscription(companyId, { status: "canceled", cancelAtPeriodEnd: false, pendingChange: null, graceEndsAt: null });
    return { ok: true, message: "Your subscription has been canceled. The workspace is now read-only." };
  } catch (err) {
    return { ok: false, error: friendly(err, "We couldn't cancel the subscription. Please try again.") };
  }
}

// ── Webhook ──────────────────────────────────────────────────────────────────

export interface RazorpayWebhookPayload {
  event: string;
  created_at?: number;
  payload?: {
    subscription?: { entity: RazorpaySubscription };
    payment?: { entity: RazorpayPayment };
  };
}

export type WebhookOutcome = { status: "processed" | "duplicate" | "ignored"; detail?: string };

export const WEBHOOK_EVENTS_COLLECTION = "billing_webhook_events";

interface WebhookEventDoc {
  _id: string;
  event: string;
  subscriptionId: string | null;
  companyId: string | null;
  status: "processing" | "processed" | "ignored" | "failed";
  detail: string | null;
  attempts: number;
  payload: RazorpayWebhookPayload;
  receivedAt: Date;
  claimedAt: Date;
  processedAt: Date | null;
}

/** A crashed attempt is retried once it's been "processing" this long. */
const STALE_CLAIM_MS = 5 * 60_000;

/**
 * Handles one signature-verified Razorpay webhook event. Idempotent on the
 * event id: every event is stored in `billing_webhook_events`, and an event
 * already processed (or being processed) is acknowledged without effect. A
 * failure is recorded and rethrown so Razorpay retries it.
 */
export async function handleWebhook(eventId: string, payload: RazorpayWebhookPayload): Promise<WebhookOutcome> {
  const events = (await getPlatformDb()).collection<WebhookEventDoc>(WEBHOOK_EVENTS_COLLECTION);
  const now = new Date();
  const subscriptionIdHint = payload.payload?.subscription?.entity?.id ?? payload.payload?.payment?.entity?.subscription_id ?? null;
  try {
    await events.insertOne({ _id: eventId, event: String(payload.event ?? ""), subscriptionId: subscriptionIdHint, companyId: null, status: "processing", detail: null, attempts: 1, payload, receivedAt: now, claimedAt: now, processedAt: null });
  } catch (err) {
    if ((err as { code?: number }).code !== 11000) throw err;
    const reclaimed = await events.findOneAndUpdate(
      { _id: eventId, $or: [{ status: "failed" }, { status: "processing", claimedAt: { $lt: new Date(now.getTime() - STALE_CLAIM_MS) } }] },
      { $set: { status: "processing", claimedAt: now }, $inc: { attempts: 1 } },
    );
    if (!reclaimed) return { status: "duplicate" };
  }

  try {
    const { outcome, companyId, subscriptionId } = await processEvent(payload);
    await events.updateOne({ _id: eventId }, { $set: { status: outcome.status === "ignored" ? "ignored" : "processed", detail: outcome.detail ?? null, companyId, subscriptionId, processedAt: new Date() } });
    return outcome;
  } catch (err) {
    await events.updateOne({ _id: eventId }, { $set: { status: "failed", detail: err instanceof Error ? err.message : String(err) } });
    throw err;
  }
}

const ADOPTING_EVENTS = new Set(["subscription.authenticated", "subscription.activated", "subscription.charged"]);

async function processEvent(payload: RazorpayWebhookPayload): Promise<{ outcome: WebhookOutcome; companyId: string | null; subscriptionId: string | null }> {
  const event = String(payload.event ?? "");
  const entity = payload.payload?.subscription?.entity ?? null;
  const payment = payload.payload?.payment?.entity ?? null;

  let subscriptionId = entity?.id ?? payment?.subscription_id ?? null;
  if (!subscriptionId && event === "payment.failed" && payment?.invoice_id) {
    subscriptionId = await fetchInvoiceSubscriptionId(payment.invoice_id).catch(() => null);
  }
  const ignored = (detail: string, companyId: string | null = null) => ({ outcome: { status: "ignored" as const, detail }, companyId, subscriptionId });
  if (!subscriptionId) return ignored("not a subscription event");

  const col = await companies();
  let company = await col.findOne({ "subscription.provider.subscriptionId": subscriptionId }, { projection: { isPlatformOwner: 1, subscription: 1 } });
  let adopt = false;
  if (!company && entity && ADOPTING_EVENTS.has(event)) {
    // A checkout the browser never confirmed (tab closed after paying): our own notes, set server-side
    // at checkout and delivered in a signature-verified webhook, name the company.
    const companyId = noteOf(entity, "companyId");
    const candidate = companyId ? await col.findOne({ _id: companyId }, { projection: { isPlatformOwner: 1, subscription: 1 } }) : null;
    if (candidate && !candidate.isPlatformOwner && noteOf(entity, "purpose") === "platform_subscription" && !hasLiveSubscription(await getCompanySubscription(candidate._id))) {
      company = candidate;
      adopt = true;
    }
  }
  if (!company) return ignored("unknown subscription");
  if (company.isPlatformOwner) return ignored("platform owner is never billed", company._id);
  const companyId = company._id;
  const done = (detail: string) => ({ outcome: { status: "processed" as const, detail }, companyId, subscriptionId });

  if (adopt && entity) await adoptSubscription(companyId, entity);
  const current = await getCompanySubscription(companyId);
  if (!current || current.status === "internal") return ignored("no subscription", companyId);

  switch (event) {
    case "subscription.authenticated":
      return done(adopt ? "adopted" : "no change");

    case "subscription.activated":
    case "subscription.charged":
    case "subscription.updated":
    case "subscription.resumed": {
      if (!entity) return ignored("missing subscription entity", companyId);
      const resolved = await resolvePlan(entity);
      const planPatch: Partial<CompanySubscription> = {};
      if (resolved && (resolved.planId !== current.planId || resolved.interval !== current.interval)) {
        planPatch.planId = resolved.planId;
        planPatch.interval = resolved.interval;
      }
      if (resolved && current.pendingChange && current.pendingChange.planId === resolved.planId && current.pendingChange.interval === resolved.interval) planPatch.pendingChange = null;
      // A charge proves the subscription is active even if its entity snapshot lags.
      const statusPatch = event === "subscription.charged" ? patchFromEntity(current, { ...entity, status: "active" }) : patchFromEntity(current, entity);
      await updateCompanySubscription(companyId, { ...planPatch, ...statusPatch });
      if (event === "subscription.charged" && payment?.id) {
        await issueInvoice(companyId, entity, { id: payment.id, amount: payment.amount, currency: payment.currency });
      }
      return done(event === "subscription.charged" ? "charged" : "synced");
    }

    case "subscription.pending":
    case "payment.failed": {
      if (!["active", "trialing", "past_due"].includes(current.status)) return done(`no change from ${current.status}`);
      const failedPayments = (current.dunning?.failedPayments ?? 0) + (event === "payment.failed" ? 1 : 0);
      const wasPastDue = current.status === "past_due";
      await updateCompanySubscription(companyId, { status: "past_due", dunning: { failedPayments, pastDueSince: current.dunning?.pastDueSince ?? new Date() } });
      if (!wasPastDue) await notify(companyId, "payment_failed");
      return done("past_due");
    }

    case "subscription.halted": {
      if (current.status === "grace" || current.status === "suspended" || current.status === "canceled") return done(`no change from ${current.status}`);
      await updateCompanySubscription(companyId, { status: "grace", graceEndsAt: new Date(Date.now() + GRACE_DAYS * DAY_MS) });
      await notify(companyId, "grace");
      return done("grace");
    }

    case "subscription.cancelled":
    case "subscription.completed": {
      if (current.status === "canceled") return done("already canceled");
      await updateCompanySubscription(companyId, { status: "canceled", cancelAtPeriodEnd: false, pendingChange: null, graceEndsAt: null });
      await notify(companyId, "canceled");
      return done("canceled");
    }

    default:
      return ignored(`unhandled event ${event}`, companyId);
  }
}

// ── Dunning ──────────────────────────────────────────────────────────────────

export interface DunningSummary {
  checked: number;
  toGrace: number;
  suspended: number;
  canceled: number;
  reconciled: number;
  trialReminders: number;
  errors: number;
}

/**
 * Daily: moves overdue subscriptions along the lifecycle and emails the
 * company at each step. Safe to run repeatedly — each transition is keyed on
 * the stored state, and trial reminders on a one-day window.
 */
export async function runDunningSweep(now: Date = new Date()): Promise<DunningSummary> {
  const summary: DunningSummary = { checked: 0, toGrace: 0, suspended: 0, canceled: 0, reconciled: 0, trialReminders: 0, errors: 0 };
  const rows = await (await companies())
    .find({ isPlatformOwner: { $ne: true }, "subscription.status": { $in: ["trialing", "active", "past_due", "grace"] } }, { projection: { _id: 1 } })
    .toArray();
  const t = now.getTime();

  for (const { _id: companyId } of rows) {
    summary.checked++;
    try {
      const sub = await getCompanySubscription(companyId);
      if (!sub || sub.status === "internal") continue;

      if (sub.status === "past_due") {
        const since = sub.dunning?.pastDueSince ?? sub.updatedAt;
        if ((sub.dunning?.failedPayments ?? 0) >= MAX_FAILED_PAYMENTS || t - since.getTime() >= PAST_DUE_MAX_DAYS * DAY_MS) {
          await updateCompanySubscription(companyId, { status: "grace", graceEndsAt: new Date(t + GRACE_DAYS * DAY_MS) });
          await notify(companyId, "grace");
          summary.toGrace++;
        }
      } else if (sub.status === "grace") {
        if (sub.graceEndsAt && sub.graceEndsAt.getTime() <= t) {
          await updateCompanySubscription(companyId, { status: "suspended" });
          await notify(companyId, "suspended");
          summary.suspended++;
        }
      } else if (sub.status === "trialing" && sub.trialEndsAt) {
        const end = sub.trialEndsAt.getTime();
        if (end <= t) {
          if (sub.provider?.subscriptionId && t - end < TRIAL_CHARGE_WAIT_MS) {
            // First charge scheduled for trial end — ask Razorpay rather than wait for a possibly missed webhook.
            if (await reconcile(companyId, sub)) summary.reconciled++;
          } else {
            await updateCompanySubscription(companyId, { status: "suspended" });
            await notify(companyId, "trial_ended");
            summary.suspended++;
          }
        } else if (!sub.provider?.subscriptionId && end - t > 2 * DAY_MS && end - t <= 3 * DAY_MS) {
          await notify(companyId, "trial_ending");
          summary.trialReminders++;
        }
      } else if (sub.status === "active" && sub.currentPeriodEnd && sub.currentPeriodEnd.getTime() <= t) {
        if (sub.cancelAtPeriodEnd) {
          await updateCompanySubscription(companyId, { status: "canceled", cancelAtPeriodEnd: false, pendingChange: null });
          await notify(companyId, "canceled");
          summary.canceled++;
        } else if (t - sub.currentPeriodEnd.getTime() > DAY_MS && sub.provider?.subscriptionId) {
          // The renewal webhook never arrived: take Razorpay's word for it.
          if (await reconcile(companyId, sub)) summary.reconciled++;
        }
      }
    } catch (err) {
      summary.errors++;
      console.error(`[billing] dunning failed for ${companyId}`, err);
    }
  }
  return summary;
}

/** Applies Razorpay's current state of the company's subscription. True if anything changed. */
async function reconcile(companyId: string, sub: CompanySubscription): Promise<boolean> {
  if (!razorpayConfigured() || !sub.provider?.subscriptionId) return false;
  const entity = await fetchSubscription(sub.provider.subscriptionId);
  const patch = patchFromEntity(sub, entity);
  if (Object.keys(patch).length === 0 || (patch.status === sub.status && !patch.currentPeriodEnd)) return false;
  await updateCompanySubscription(companyId, patch);
  if (patch.status === "past_due" && sub.status !== "past_due") await notify(companyId, "payment_failed");
  if (patch.status === "grace") await notify(companyId, "grace");
  if (patch.status === "canceled") await notify(companyId, "canceled");
  return true;
}
