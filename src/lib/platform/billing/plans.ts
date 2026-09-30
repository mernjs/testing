import "server-only";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { COMPANIES_COLLECTION } from "@/lib/platform/tenancy/companies";
import { MODULES, type ModuleKey } from "@/lib/platform/onboarding/catalog";
import { DEFAULT_TRIAL_DAYS, type Plan, type PlanLimits } from "@/lib/platform/billing/types";

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
  return (await collection()).find(opts.activeOnly ? { active: true } : {}).sort({ sortOrder: 1, _id: 1 }).toArray();
}

export async function getPlan(id: string): Promise<Plan | null> {
  return (await collection()).findOne({ _id: id });
}

export async function getDefaultPlan(): Promise<Plan | null> {
  const col = await collection();
  return (await col.findOne({ isDefault: true, active: true })) ?? (await col.findOne({ active: true }, { sort: { sortOrder: 1 } }));
}

// ---------------------------------------------------------------------------
// Managing the catalogue (platform console, `/console/plans`).
//
//  - Plan ids are stable, lowercase and never change once created.
//  - Exactly one ACTIVE plan is the default. Making a plan the default clears
//    the flag everywhere else; the default can't be archived or un-defaulted
//    directly — another plan has to be made the default instead.
//  - Plans are never deleted. Archiving (active = false) hides a plan from
//    pricing/checkout and new subscriptions, but companies already on it keep
//    it (`getPlan` still resolves it, so their entitlements don't change).
//  - Price edits apply to NEW subscriptions only. `provider` (Razorpay plan
//    ids) is never written here: a provider plan's price is fixed, so the
//    subscriptions workstream must create new provider plans after a price
//    change — existing subscribers stay on the provider plan they bought.
// ---------------------------------------------------------------------------

/** What the console submits for a plan (money already in paise). */
export interface PlanInput {
  _id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  modules: ModuleKey[] | "all";
  limits: PlanLimits;
  trialDays: number;
  active: boolean;
  isDefault: boolean;
  sortOrder: number;
}

export type PlanField = "id" | "name" | "description" | "priceMonthly" | "priceYearly" | "modules" | "seats" | "aiTokensPerMonth" | "storageMb" | "trialDays" | "sortOrder" | "isDefault";
export type PlanFieldErrors = Partial<Record<PlanField, string>>;
export type SavePlanResult = { ok: true; plan: Plan } | { ok: false; error: string; fieldErrors?: PlanFieldErrors };
export type SetPlanActiveResult = { ok: true } | { ok: false; error: string };

export const PLAN_ID_PATTERN = /^[a-z][a-z0-9-]{1,31}$/;
export const MAX_TRIAL_DAYS = 90;
/** Ids with a meaning elsewhere (the platform owner, the fallback trial) or in console URLs. */
const RESERVED_PLAN_IDS = new Set(["internal", "trial", "new", "all", "none", "default"]);
const SELECTABLE_MODULES = new Set<string>(MODULES.filter((m) => !m.core).map((m) => m.key));

const isWholeNumber = (n: unknown): n is number => typeof n === "number" && Number.isSafeInteger(n);

/** Field validation without the database. Uniqueness and the default rule are checked in `savePlan`. */
export function validatePlanInput(input: PlanInput, mode: "create" | "update"): PlanFieldErrors {
  const errors: PlanFieldErrors = {};
  if (mode === "create") {
    if (!PLAN_ID_PATTERN.test(input._id)) errors.id = "Use 2–32 lowercase letters, digits or hyphens, starting with a letter.";
    else if (RESERVED_PLAN_IDS.has(input._id)) errors.id = `"${input._id}" is reserved — choose another id.`;
  }
  const name = input.name.trim();
  if (!name) errors.name = "Give the plan a name.";
  else if (name.length > 60) errors.name = "Keep the name under 60 characters.";
  if (input.description.trim().length > 300) errors.description = "Keep the description under 300 characters.";
  for (const key of ["priceMonthly", "priceYearly"] as const) {
    if (!isWholeNumber(input[key]) || input[key] < 0) errors[key] = "Enter a price of 0 or more.";
  }
  if (input.modules !== "all") {
    if (!Array.isArray(input.modules) || input.modules.length === 0) errors.modules = "Pick at least one panel, or include every panel.";
    else if (input.modules.some((m) => !SELECTABLE_MODULES.has(m))) errors.modules = "Unknown panel selected.";
  }
  for (const key of ["seats", "aiTokensPerMonth", "storageMb"] as const) {
    const v = input.limits[key];
    const min = key === "seats" ? 1 : 0;
    if (v !== null && (!isWholeNumber(v) || v < min)) errors[key] = key === "seats" ? "Enter at least 1 seat, or leave blank for unlimited." : "Enter a whole number, or leave blank for unlimited.";
  }
  if (!isWholeNumber(input.trialDays) || input.trialDays < 0 || input.trialDays > MAX_TRIAL_DAYS) errors.trialDays = `Enter 0–${MAX_TRIAL_DAYS} days.`;
  if (!isWholeNumber(input.sortOrder) || Math.abs(input.sortOrder) > 1_000_000) errors.sortOrder = "Enter a whole number.";
  if (input.isDefault && !input.active) errors.isDefault = "The default plan must be active.";
  return errors;
}

/** Creates or edits a plan. Never touches `provider`, `currency` (INR) or `createdAt` of an existing plan. */
export async function savePlan(input: PlanInput, mode: "create" | "update"): Promise<SavePlanResult> {
  const clean: PlanInput = {
    ...input,
    _id: String(input._id ?? "").trim().toLowerCase(),
    name: String(input.name ?? "").trim(),
    description: String(input.description ?? "").trim(),
    modules: input.modules === "all" ? "all" : Array.isArray(input.modules) ? [...new Set(input.modules)].sort((a, b) => a.localeCompare(b)) : [],
    active: input.active === true,
    isDefault: input.isDefault === true,
  };
  const fieldErrors = validatePlanInput(clean, mode);
  const col = await collection();
  const existing = PLAN_ID_PATTERN.test(clean._id) ? await col.findOne({ _id: clean._id }) : null;
  if (mode === "create" && existing) fieldErrors.id = `A plan with the id "${clean._id}" already exists.`;
  if (mode === "update" && !existing) return { ok: false, error: "That plan no longer exists." };
  if (existing?.isDefault && existing.active) {
    if (!clean.active) fieldErrors.isDefault = "The default plan can't be archived. Make another plan the default first.";
    else if (!clean.isDefault) fieldErrors.isDefault = "This is the default plan. Make another plan the default instead.";
  }
  if (Object.keys(fieldErrors).length > 0) return { ok: false, error: "Fix the highlighted fields.", fieldErrors };

  const now = new Date();
  const fields = {
    name: clean.name,
    description: clean.description,
    priceMonthly: clean.priceMonthly,
    priceYearly: clean.priceYearly,
    modules: clean.modules,
    limits: { seats: clean.limits.seats, aiTokensPerMonth: clean.limits.aiTokensPerMonth, storageMb: clean.limits.storageMb },
    trialDays: clean.trialDays,
    active: clean.active,
    isDefault: clean.isDefault,
    sortOrder: clean.sortOrder,
    updatedAt: now,
  };
  if (mode === "create") {
    try {
      await col.insertOne({ _id: clean._id, currency: "INR", ...fields, createdAt: now });
    } catch (err) {
      if ((err as { code?: number }).code === 11000) return { ok: false, error: "Fix the highlighted fields.", fieldErrors: { id: `A plan with the id "${clean._id}" already exists.` } };
      throw err;
    }
  } else {
    await col.updateOne({ _id: clean._id }, { $set: fields });
  }
  if (clean.isDefault) await col.updateMany({ _id: { $ne: clean._id }, isDefault: true }, { $set: { isDefault: false, updatedAt: now } });
  return { ok: true, plan: (await col.findOne({ _id: clean._id }))! };
}

/** Archive (`active: false`) or restore a plan. Companies already on an archived plan keep it. */
export async function setPlanActive(id: string, active: boolean): Promise<SetPlanActiveResult> {
  const col = await collection();
  const plan = await col.findOne({ _id: id });
  if (!plan) return { ok: false, error: "That plan no longer exists." };
  if (!active && plan.isDefault) return { ok: false, error: "The default plan can't be archived. Make another plan the default first." };
  if (plan.active !== active) await col.updateOne({ _id: id }, { $set: { active, updatedAt: new Date() } });
  return { ok: true };
}

/**
 * How many companies reference each plan (any subscription status; the
 * platform owner excluded), read from the raw registry so it covers every
 * company. Companies without a stored subscription aren't counted.
 */
export async function countCompaniesByPlan(): Promise<Map<string, number>> {
  const rows = await (await getPlatformDb())
    .collection(COMPANIES_COLLECTION)
    .aggregate<{ _id: string; n: number }>([
      { $match: { isPlatformOwner: { $ne: true }, "subscription.planId": { $type: "string" } } },
      { $group: { _id: "$subscription.planId", n: { $sum: 1 } } },
    ])
    .toArray();
  return new Map(rows.map((r) => [r._id, r.n]));
}
