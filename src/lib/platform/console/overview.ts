import "server-only";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { COMPANIES_COLLECTION, type Company } from "@/lib/platform/tenancy/companies";
import { getBillingSettings } from "@/lib/platform/billing/settings";
import type { CompanySubscription, SubscriptionStatus } from "@/lib/platform/billing/types";

/**
 * Platform Panel dashboard data (cross-company, raw DB): subscription status
 * mix and trials ending soon. Companies with no stored subscription (created
 * before billing) count as trialing from their creation date, matching
 * `getCompanySubscription`. The platform owner is excluded.
 */

export interface SubscriptionSnapshot {
  counts: Record<Exclude<SubscriptionStatus, "internal">, number>;
  trialsEndingSoon: { id: string; name: string; slug: string; endsAt: string; daysLeft: number }[];
}

export async function getSubscriptionSnapshot(now = new Date()): Promise<SubscriptionSnapshot> {
  const db = await getPlatformDb();
  const { billing } = await getBillingSettings();
  const companies = await db
    .collection<Company & { subscription?: CompanySubscription }>(COMPANIES_COLLECTION)
    .find({ isPlatformOwner: { $ne: true } }, { projection: { name: 1, slug: 1, createdAt: 1, subscription: 1 } })
    .toArray();

  const counts: SubscriptionSnapshot["counts"] = { trialing: 0, active: 0, past_due: 0, grace: 0, suspended: 0, canceled: 0 };
  const soon: SubscriptionSnapshot["trialsEndingSoon"] = [];
  for (const c of companies) {
    const sub = c.subscription;
    const trialEnds = sub?.trialEndsAt ?? new Date(c.createdAt.getTime() + billing.defaultTrialDays * 86_400_000);
    let status: Exclude<SubscriptionStatus, "internal"> = sub && sub.status !== "internal" ? sub.status : "trialing";
    // Same on-read expiry rule as entitlements.
    if (status === "trialing" && trialEnds.getTime() <= now.getTime()) status = "suspended";
    if (status === "grace" && sub?.graceEndsAt && sub.graceEndsAt.getTime() <= now.getTime()) status = "suspended";
    counts[status]++;
    if (status === "trialing") {
      const daysLeft = Math.ceil((trialEnds.getTime() - now.getTime()) / 86_400_000);
      if (daysLeft <= 7) soon.push({ id: c._id, name: c.name, slug: c.slug, endsAt: trialEnds.toISOString(), daysLeft });
    }
  }
  soon.sort((a, b) => a.daysLeft - b.daysLeft);
  return { counts, trialsEndingSoon: soon.slice(0, 20) };
}
