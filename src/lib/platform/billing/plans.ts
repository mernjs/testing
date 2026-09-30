import "server-only";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { DEFAULT_TRIAL_DAYS, type Plan } from "@/lib/platform/billing/types";

/**
 * The plans catalogue (platform-level `billing_plans`), managed in the
 * Platform Panel. The list below only seeds an empty catalogue on first use
 * (Starter ₹999, Growth ₹1,999, Business ₹4,999 per month; yearly = 10×
 * monthly; 30-day trial) — after that, the database is the only source.
 */

export const PLANS_COLLECTION = "billing_plans";

type PlanSeed = Omit<Plan, "createdAt" | "updatedAt">;

export const DEFAULT_PLANS: PlanSeed[] = [
  {
    _id: "starter",
    name: "Starter",
    description: "For small teams getting organised.",
    currency: "INR",
    priceMonthly: 99_900,
    priceYearly: 999_000,
    modules: ["hrms", "pms", "lms", "sop", "cms"],
    limits: { seats: 10, aiTokensPerMonth: 200_000, storageMb: 5_000 },
    trialDays: DEFAULT_TRIAL_DAYS,
    active: true,
    isDefault: false,
    sortOrder: 10,
  },
  {
    _id: "growth",
    name: "Growth",
    description: "Run delivery, sales and finance in one place.",
    currency: "INR",
    priceMonthly: 199_900,
    priceYearly: 1_999_000,
    modules: ["hrms", "pms", "lms", "fms", "prms", "sop", "dlms", "cms", "seo", "portal", "ots"],
    limits: { seats: 50, aiTokensPerMonth: 1_000_000, storageMb: 25_000 },
    trialDays: DEFAULT_TRIAL_DAYS,
    active: true,
    isDefault: true,
    sortOrder: 20,
  },
  {
    _id: "business",
    name: "Business",
    description: "Every panel, AI and automation for growing companies.",
    currency: "INR",
    priceMonthly: 499_900,
    priceYearly: 4_999_000,
    modules: "all",
    limits: { seats: 200, aiTokensPerMonth: 5_000_000, storageMb: 100_000 },
    trialDays: DEFAULT_TRIAL_DAYS,
    active: true,
    isDefault: false,
    sortOrder: 30,
  },
];

let seeded = false;
async function collection() {
  const col = (await getPlatformDb()).collection<Plan>(PLANS_COLLECTION);
  if (!seeded) {
    seeded = true;
    if ((await col.countDocuments({}, { limit: 1 })) === 0) {
      const now = new Date();
      await col.insertMany(DEFAULT_PLANS.map((p) => ({ ...p, createdAt: now, updatedAt: now }))).catch(() => {});
    }
  }
  return col;
}

export async function listPlans(opts: { activeOnly?: boolean } = {}): Promise<Plan[]> {
  return (await collection()).find(opts.activeOnly ? { active: true } : {}).sort({ sortOrder: 1 }).toArray();
}

export async function getPlan(id: string): Promise<Plan | null> {
  return (await collection()).findOne({ _id: id });
}

export async function getDefaultPlan(): Promise<Plan | null> {
  const col = await collection();
  return (await col.findOne({ isDefault: true, active: true })) ?? (await col.findOne({ active: true }, { sort: { sortOrder: 1 } }));
}
