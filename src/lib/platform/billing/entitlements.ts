import "server-only";
import { cache } from "react";
import { currentCompanyId } from "@/lib/platform/tenancy/context";
import { getPlan } from "@/lib/platform/billing/plans";
import { getCompanySubscription } from "@/lib/platform/billing/subscription";
import { MODULES } from "@/lib/platform/onboarding/catalog";
import { getBillingSettings } from "@/lib/platform/billing/settings";
import { effectiveSubscriptionStatus, trialDaysLeft } from "@/lib/platform/billing/lifecycle";
import type { Entitlements, PlanLimits } from "@/lib/platform/billing/types";

const UNLIMITED: PlanLimits = { seats: null, aiTokensPerMonth: null, storageMb: null };
const CORE = MODULES.filter((m) => m.core).map((m) => m.key);

/**
 * What the current company may use right now — the single question every
 * panel and API asks (enforcement lives with each panel; see `guard.ts`).
 * Resolved once per request. The platform owner is unlimited.
 */
export const getEntitlements = cache(async (): Promise<Entitlements> => {
  const sub = await getCompanySubscription(await currentCompanyId());
  if (!sub || sub.status === "internal") {
    return { planId: null, planName: null, status: "internal", modules: null, limits: UNLIMITED, readOnly: false, trialDaysLeft: null };
  }
  const now = new Date();
  // Time-based transitions are applied on read, so an expired trial (→ grace for the
  // platform's grace days, then suspended) or grace takes effect immediately, even
  // before the daily sweep persists it.
  const { status } = effectiveSubscriptionStatus(sub, (await getBillingSettings()).billing.graceDays, now);

  const plan = await getPlan(sub.planId);
  const modules = !plan || plan.modules === "all" ? null : new Set<string>([...CORE, ...plan.modules]);
  return {
    planId: sub.planId,
    planName: plan?.name ?? null,
    status,
    modules,
    limits: plan?.limits ?? UNLIMITED,
    readOnly: status === "suspended" || status === "canceled",
    trialDaysLeft: status === "trialing" && sub.trialEndsAt ? trialDaysLeft(sub.trialEndsAt, now) : null,
  };
});

/** Whether the company's plan includes a panel (core panels always). */
export async function canUseModule(moduleKey: string): Promise<boolean> {
  const e = await getEntitlements();
  return e.modules === null || e.modules.has(moduleKey);
}
