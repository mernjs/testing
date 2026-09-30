import "server-only";
import type { Collection } from "mongodb";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { COMPANIES_COLLECTION, type Company } from "@/lib/platform/tenancy/companies";
import { companyBaseUrl } from "@/lib/platform/tenancy/provisioning";
import { getDefaultPlan, getPlan } from "@/lib/platform/billing/plans";
import { DEFAULT_TRIAL_DAYS, type CompanySubscription } from "@/lib/platform/billing/types";
import { renderEmail, sendEmail } from "@/lib/platform/email";

/**
 * Free-trial lifecycle, run once a day by `/api/platform/billing/trials/cron`
 * across every company (raw platform DB — this is a registry-level job).
 *
 *  1. A company with no stored subscription (created before billing existed)
 *     gets the trial `getCompanySubscription` already assumes for it — the
 *     default plan's trial counted from its creation date — persisted, so the
 *     steps below and the console see the same thing.
 *  2. Reminder emails to the owner at 7, 3 and 1 days left. Each threshold is
 *     claimed atomically on `subscription.trialRemindersSent` before sending,
 *     so a re-run (or two overlapping runs) never emails twice. If a run was
 *     missed, only the most urgent due reminder is sent and the earlier
 *     thresholds are recorded as covered. A failed send releases its claim
 *     and is retried on the next run.
 *  3. An expired trial is persisted as `status: "suspended"` (read-only —
 *     entitlements already treat it so on read) and the owner is emailed a
 *     link to choose a plan on their company's own host.
 *
 * Never touches the platform owner (`internal`) and skips companies the
 * platform owner has suspended in the console (their workspace is offline).
 */

export const TRIAL_REMINDER_DAYS = [7, 3, 1] as const;
const DAY_MS = 86_400_000;
const USERS = "admin_users";

type CompanyDoc = Company & { subscription?: CompanySubscription };

export interface TrialSweepResult {
  scanned: number;
  legacyTrialsStarted: number;
  reminders: Record<(typeof TRIAL_REMINDER_DAYS)[number], number>;
  expired: number;
  emailFailures: number;
  /** Companies with no Super Admin to email (transitions still applied). */
  noOwner: number;
  /** Companies whose processing threw (logged; retried next run). */
  errors: number;
}

/** Whole days left, rounded up — the same figure `getEntitlements().trialDaysLeft` shows. */
export function trialDaysLeft(trialEndsAt: Date, now: Date): number {
  return Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / DAY_MS));
}

async function ownerEmail(companyId: string): Promise<string | null> {
  const owner = await (await getPlatformDb())
    .collection<{ companyId: string; email: string; roles?: string[]; createdAt?: Date }>(USERS)
    .find({ companyId, roles: "super_admin" }, { projection: { email: 1 } })
    .sort({ createdAt: 1, _id: 1 })
    .limit(1)
    .next();
  return owner?.email ?? null;
}

const billingUrl = (slug: string) => `${companyBaseUrl(slug)}/settings/billing`;
const plural = (n: number) => `${n} day${n === 1 ? "" : "s"}`;

function reminderEmail(company: CompanyDoc, planName: string, daysLeft: number) {
  return {
    subject: `${plural(daysLeft)} left in your ${company.name} trial`,
    ...renderEmail({
      brand: "YashOrbit",
      heading: `${plural(daysLeft)} left in your free trial`,
      paragraphs: [
        `The free trial of ${planName} for ${company.name} ends in ${plural(daysLeft)}.`,
        "Choose a plan before then to keep everything running without interruption. If the trial ends first, your workspace becomes read-only — nothing is deleted, and choosing a plan brings it straight back.",
      ],
      action: { label: "Choose a plan", url: billingUrl(company.slug) },
    }),
  };
}

function expiredEmail(company: CompanyDoc) {
  return {
    subject: `Your ${company.name} trial has ended`,
    ...renderEmail({
      brand: "YashOrbit",
      heading: "Your free trial has ended",
      paragraphs: [
        `The free trial for ${company.name} has ended, so the workspace is now read-only: everyone can still sign in and see their data, but nothing new can be created.`,
        "Your data is safe. Choose a plan to continue right where you left off.",
      ],
      action: { label: "Choose a plan", url: billingUrl(company.slug) },
    }),
  };
}

/** Persists the implicit trial of a company that has no subscription yet. Returns it, or null if one appeared meanwhile. */
async function persistLegacyTrial(col: Collection<CompanyDoc>, company: CompanyDoc, now: Date): Promise<CompanySubscription | null> {
  const plan = await getDefaultPlan();
  const sub: CompanySubscription = {
    planId: plan?._id ?? "trial",
    status: "trialing",
    interval: "monthly",
    trialEndsAt: new Date(company.createdAt.getTime() + (plan?.trialDays ?? DEFAULT_TRIAL_DAYS) * DAY_MS),
    currentPeriodStart: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
    graceEndsAt: null,
    provider: null,
    trialRemindersSent: [],
    updatedAt: now,
  };
  const res = await col.updateOne({ _id: company._id, isPlatformOwner: { $ne: true }, subscription: { $exists: false } }, { $set: { subscription: sub } });
  return res.modifiedCount === 1 ? sub : null;
}

export async function runTrialSweep(now: Date = new Date()): Promise<TrialSweepResult> {
  const col = (await getPlatformDb()).collection<CompanyDoc>(COMPANIES_COLLECTION);
  const result: TrialSweepResult = { scanned: 0, legacyTrialsStarted: 0, reminders: { 7: 0, 3: 0, 1: 0 }, expired: 0, emailFailures: 0, noOwner: 0, errors: 0 };

  const cursor = col.find(
    {
      isPlatformOwner: { $ne: true },
      status: "active",
      $or: [{ subscription: { $exists: false } }, { "subscription.status": "trialing" }],
    },
    { projection: { _id: 1, slug: 1, name: 1, status: 1, isPlatformOwner: 1, createdAt: 1, subscription: 1 } },
  );

  for await (const company of cursor) {
    result.scanned++;
    try {
      let sub = company.subscription;
      if (!sub) {
        const persisted = await persistLegacyTrial(col, company, now);
        if (!persisted) continue; // something else gave it a subscription meanwhile; next run handles it
        result.legacyTrialsStarted++;
        sub = persisted;
      }
      if (sub.status !== "trialing" || !sub.trialEndsAt) continue;

      // Expired → read-only.
      if (sub.trialEndsAt.getTime() <= now.getTime()) {
        const res = await col.updateOne(
          { _id: company._id, isPlatformOwner: { $ne: true }, "subscription.status": "trialing", "subscription.trialEndsAt": { $lte: now } },
          { $set: { "subscription.status": "suspended", "subscription.updatedAt": now } },
        );
        if (res.modifiedCount !== 1) continue;
        result.expired++;
        const to = await ownerEmail(company._id);
        if (!to) {
          result.noOwner++;
          continue;
        }
        const sent = await sendEmail({ to, ...expiredEmail(company) });
        if (!sent.ok) result.emailFailures++;
        continue;
      }

      // Reminders: every threshold at or above the days left is due; send the most urgent one.
      const daysLeft = trialDaysLeft(sub.trialEndsAt, now);
      const sentAlready = new Set(sub.trialRemindersSent ?? []);
      const due = TRIAL_REMINDER_DAYS.filter((d) => daysLeft <= d && !sentAlready.has(d));
      if (due.length === 0) continue;
      const threshold = Math.min(...due) as (typeof TRIAL_REMINDER_DAYS)[number];

      const claim = await col.updateOne(
        { _id: company._id, isPlatformOwner: { $ne: true }, "subscription.status": "trialing", "subscription.trialRemindersSent": { $ne: threshold } },
        { $addToSet: { "subscription.trialRemindersSent": { $each: due } } },
      );
      if (claim.modifiedCount !== 1) continue;

      const to = await ownerEmail(company._id);
      if (!to) {
        result.noOwner++;
        continue;
      }
      const plan = await getPlan(sub.planId);
      const sent = await sendEmail({ to, ...reminderEmail(company, plan?.name ?? "YashOrbit", daysLeft) });
      if (sent.ok) {
        result.reminders[threshold]++;
      } else {
        result.emailFailures++;
        await col.updateOne({ _id: company._id }, { $pullAll: { "subscription.trialRemindersSent": due } });
      }
    } catch (err) {
      console.error(`[billing:trials] sweep failed for company ${company._id}`, err);
      result.errors++;
    }
  }
  return result;
}
