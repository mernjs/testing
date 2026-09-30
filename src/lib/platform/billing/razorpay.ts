import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { PLANS_COLLECTION } from "@/lib/platform/billing/plans";
import { planPrice, priceWithGst } from "@/lib/platform/billing/billing-details";
import type { BillingInterval, Plan } from "@/lib/platform/billing/types";

/**
 * Razorpay REST client for PLATFORM subscription billing — the platform
 * owner's own Razorpay account (`RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`)
 * collecting from customer companies. Plain `fetch`, no SDK, so tests can
 * mock the network. Every call throws `RazorpayError` on a non-2xx answer.
 *
 * Separate from the FMS/HRMS Razorpay code, which acts for a company's own
 * customers and payees.
 */

const API = "https://api.razorpay.com/v1";

export class RazorpayError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string | null = null,
  ) {
    super(message);
    this.name = "RazorpayError";
  }
}

export function razorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID?.trim() && process.env.RAZORPAY_KEY_SECRET?.trim());
}

/** Public key id for Razorpay Checkout in the browser (safe to expose). */
export function razorpayKeyId(): string {
  return process.env.RAZORPAY_KEY_ID?.trim() ?? "";
}

function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !secret) throw new RazorpayError("Razorpay is not configured.", 0, "NOT_CONFIGURED");
  return { keyId, secret };
}

async function call<T>(method: "GET" | "POST" | "PATCH", path: string, body?: unknown): Promise<T> {
  const { keyId, secret } = credentials();
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${secret}`).toString("base64")}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as { error?: { description?: string; code?: string } };
  if (!res.ok) throw new RazorpayError(data.error?.description || `Razorpay request failed (${res.status})`, res.status, data.error?.code ?? null);
  return data as T;
}

// ── Entities (only the fields we use) ────────────────────────────────────────

export type RazorpaySubscriptionStatus = "created" | "authenticated" | "active" | "pending" | "halted" | "cancelled" | "completed" | "expired" | "paused";

export interface RazorpaySubscription {
  id: string;
  plan_id: string;
  customer_id?: string | null;
  status: RazorpaySubscriptionStatus;
  /** Unix seconds. */
  current_start: number | null;
  current_end: number | null;
  charge_at?: number | null;
  start_at?: number | null;
  paid_count?: number;
  short_url?: string;
  notes?: Record<string, string> | [];
}

export interface RazorpayPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  invoice_id?: string | null;
  subscription_id?: string | null;
  error_description?: string | null;
}

// ── Signatures ───────────────────────────────────────────────────────────────

function safeEqualHex(expected: string, given: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(given, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Checkout handler signature: HMAC-SHA256(`payment_id|subscription_id`, key secret). */
export function verifyCheckoutSignature(paymentId: string, subscriptionId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret || !paymentId || !subscriptionId || !signature) return false;
  return safeEqualHex(createHmac("sha256", secret).update(`${paymentId}|${subscriptionId}`).digest("hex"), signature);
}

/** Webhook signature: HMAC-SHA256(raw body, webhook secret) in `x-razorpay-signature`. */
export function verifyWebhookSignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!secret || !signature) return false;
  return safeEqualHex(createHmac("sha256", secret).update(rawBody).digest("hex"), signature);
}

// ── Customers ────────────────────────────────────────────────────────────────

export async function createCustomer(input: { name: string; email: string; gstin?: string | null; notes?: Record<string, string> }): Promise<{ id: string }> {
  return call<{ id: string }>("POST", "/customers", {
    name: input.name.slice(0, 50),
    email: input.email,
    ...(input.gstin ? { gstin: input.gstin } : {}),
    // Returns the existing customer for this email instead of failing.
    fail_existing: "0",
    notes: input.notes ?? {},
  });
}

// ── Plans ────────────────────────────────────────────────────────────────────

const knownPlanAmounts = new Map<string, number>();

/**
 * The Razorpay plan for one of our plans + interval, created lazily and
 * remembered in `billing_plans.provider.razorpay.<interval>`. Razorpay plans
 * are immutable, so when the catalogue price changes a new Razorpay plan is
 * created (existing subscribers keep theirs until they change plan).
 * The Razorpay amount is the GST-inclusive total.
 */
export async function ensureRazorpayPlan(plan: Plan, interval: BillingInterval): Promise<string> {
  const amount = priceWithGst(planPrice(plan, interval)).total;
  const existing = plan.provider?.razorpay?.[interval];
  if (existing) {
    let known = knownPlanAmounts.get(existing);
    if (known === undefined) {
      try {
        const remote = await call<{ id: string; item?: { amount?: number } }>("GET", `/plans/${encodeURIComponent(existing)}`);
        known = remote.item?.amount ?? -1;
        knownPlanAmounts.set(existing, known);
      } catch (err) {
        if (!(err instanceof RazorpayError) || err.status !== 404) throw err;
        known = -1;
      }
    }
    if (known === amount) return existing;
  }
  const created = await call<{ id: string }>("POST", "/plans", {
    period: interval === "yearly" ? "yearly" : "monthly",
    interval: 1,
    item: { name: `${plan.name} (${interval})`, amount, currency: plan.currency, description: `${plan.description} Includes 18% GST.`.slice(0, 250) },
    notes: { planId: plan._id, interval },
  });
  knownPlanAmounts.set(created.id, amount);
  // Narrow update: only this interval's provider id (the catalogue itself is owned by plans.ts).
  await (await getPlatformDb()).collection<Plan>(PLANS_COLLECTION).updateOne({ _id: plan._id }, { $set: { [`provider.razorpay.${interval}`]: created.id, updatedAt: new Date() } });
  return created.id;
}

/** Our plan + interval for a Razorpay plan id (from the ids stored on the catalogue). */
export async function findPlanByRazorpayId(razorpayPlanId: string): Promise<{ plan: Plan; interval: BillingInterval } | null> {
  if (!razorpayPlanId) return null;
  const plan = await (await getPlatformDb())
    .collection<Plan>(PLANS_COLLECTION)
    .findOne({ $or: [{ "provider.razorpay.monthly": razorpayPlanId }, { "provider.razorpay.yearly": razorpayPlanId }] });
  if (!plan) return null;
  return { plan, interval: plan.provider?.razorpay?.yearly === razorpayPlanId ? "yearly" : "monthly" };
}

// ── Subscriptions ────────────────────────────────────────────────────────────

/** Billing cycles Razorpay should run before the subscription completes (~10 years). */
export function totalCountFor(interval: BillingInterval): number {
  return interval === "yearly" ? 10 : 120;
}

export async function createSubscription(input: {
  planId: string;
  customerId: string | null;
  interval: BillingInterval;
  /** Unix seconds; omitted = first charge at checkout. */
  startAt?: number | null;
  notes: Record<string, string>;
}): Promise<RazorpaySubscription> {
  return call<RazorpaySubscription>("POST", "/subscriptions", {
    plan_id: input.planId,
    ...(input.customerId ? { customer_id: input.customerId } : {}),
    total_count: totalCountFor(input.interval),
    quantity: 1,
    customer_notify: 1,
    ...(input.startAt ? { start_at: input.startAt } : {}),
    notes: input.notes,
  });
}

export async function fetchSubscription(id: string): Promise<RazorpaySubscription> {
  return call<RazorpaySubscription>("GET", `/subscriptions/${encodeURIComponent(id)}`);
}

export async function cancelRazorpaySubscription(id: string, atCycleEnd: boolean): Promise<RazorpaySubscription> {
  return call<RazorpaySubscription>("POST", `/subscriptions/${encodeURIComponent(id)}/cancel`, { cancel_at_cycle_end: atCycleEnd ? 1 : 0 });
}

/** Switches the subscription's plan, now or at the end of the current cycle. */
export async function updateSubscriptionPlan(id: string, planId: string, when: "now" | "cycle_end", interval: BillingInterval): Promise<RazorpaySubscription> {
  return call<RazorpaySubscription>("PATCH", `/subscriptions/${encodeURIComponent(id)}`, {
    plan_id: planId,
    schedule_change_at: when,
    customer_notify: 1,
    remaining_count: totalCountFor(interval),
  });
}

/** Undoes a scheduled plan change. */
export async function cancelScheduledChanges(id: string): Promise<RazorpaySubscription> {
  return call<RazorpaySubscription>("POST", `/subscriptions/${encodeURIComponent(id)}/cancel_scheduled_changes`);
}

/** The subscription a Razorpay invoice belongs to (recurring payments reference an invoice). */
export async function fetchInvoiceSubscriptionId(invoiceId: string): Promise<string | null> {
  const inv = await call<{ subscription_id?: string | null }>("GET", `/invoices/${encodeURIComponent(invoiceId)}`);
  return inv.subscription_id ?? null;
}
