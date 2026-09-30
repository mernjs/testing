import type { ModuleKey } from "@/lib/platform/onboarding/catalog";
import type { Plan } from "@/lib/platform/billing/types";

/**
 * The plan form's raw values (what the browser submits) and their conversion
 * to/from a plan. Client-safe and data-free: prices are typed in rupees and
 * stored in paise; a blank limit means unlimited.
 */

export interface PlanFormValues {
  id: string;
  name: string;
  description: string;
  /** Rupees, up to 2 decimals. */
  priceMonthly: string;
  priceYearly: string;
  allModules: boolean;
  modules: string[];
  /** Blank = unlimited. */
  seats: string;
  aiTokensPerMonth: string;
  storageMb: string;
  trialDays: string;
  sortOrder: string;
  active: boolean;
  isDefault: boolean;
}

export interface ParsedPlanForm {
  _id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  modules: ModuleKey[] | "all";
  limits: { seats: number | null; aiTokensPerMonth: number | null; storageMb: number | null };
  trialDays: number;
  active: boolean;
  isDefault: boolean;
  sortOrder: number;
}

export type PlanFormErrors = Partial<Record<"id" | "name" | "description" | "priceMonthly" | "priceYearly" | "modules" | "seats" | "aiTokensPerMonth" | "storageMb" | "trialDays" | "sortOrder" | "isDefault", string>>;

export const EMPTY_PLAN_FORM: PlanFormValues = {
  id: "",
  name: "",
  description: "",
  priceMonthly: "",
  priceYearly: "",
  allModules: false,
  modules: [],
  seats: "",
  aiTokensPerMonth: "",
  storageMb: "",
  trialDays: "14",
  sortOrder: "100",
  active: true,
  isDefault: false,
};

/** Paise → "1999" / "1999.50" for an input. */
export function paiseToRupees(paise: number): string {
  const whole = Math.trunc(paise / 100);
  const rest = Math.abs(paise % 100);
  return rest === 0 ? String(whole) : `${whole}.${String(rest).padStart(2, "0")}`;
}

/** "1,999.5" → 199950; NaN when it isn't a non-negative amount with at most 2 decimals. */
export function rupeesToPaise(value: string): number {
  const v = value.replace(/[,\s₹]/g, "");
  const m = /^(\d{1,9})(?:\.(\d{1,2}))?$/.exec(v);
  if (!m) return Number.NaN;
  return Number(m[1]) * 100 + Number((m[2] ?? "").padEnd(2, "0"));
}

const toInt = (value: string): number => (/^-?\d{1,12}$/.test(value.trim()) ? Number(value.trim()) : Number.NaN);
const toLimit = (value: string): number | null => (value.replace(/[,\s]/g, "") === "" ? null : toInt(value.replace(/[,\s]/g, "")));

export function planToFormValues(plan: Plan): PlanFormValues {
  const limit = (v: number | null) => (v === null ? "" : String(v));
  return {
    id: plan._id,
    name: plan.name,
    description: plan.description,
    priceMonthly: paiseToRupees(plan.priceMonthly),
    priceYearly: paiseToRupees(plan.priceYearly),
    allModules: plan.modules === "all",
    modules: plan.modules === "all" ? [] : [...plan.modules],
    seats: limit(plan.limits.seats),
    aiTokensPerMonth: limit(plan.limits.aiTokensPerMonth),
    storageMb: limit(plan.limits.storageMb),
    trialDays: String(plan.trialDays),
    sortOrder: String(plan.sortOrder),
    active: plan.active,
    isDefault: plan.isDefault,
  };
}

/**
 * Converts submitted values to a plan input. Values that can't be read as
 * numbers become NaN, which the plan validator reports on the right field;
 * only the rupee format gets its own, more specific message here.
 */
export function parsePlanForm(v: PlanFormValues): { input: ParsedPlanForm; errors: PlanFormErrors } {
  const errors: PlanFormErrors = {};
  const priceMonthly = rupeesToPaise(String(v.priceMonthly ?? ""));
  const priceYearly = rupeesToPaise(String(v.priceYearly ?? ""));
  if (Number.isNaN(priceMonthly)) errors.priceMonthly = "Enter an amount in rupees, e.g. 999 or 999.50.";
  if (Number.isNaN(priceYearly)) errors.priceYearly = "Enter an amount in rupees, e.g. 9990 or 9990.50.";
  return {
    errors,
    input: {
      _id: String(v.id ?? ""),
      name: String(v.name ?? ""),
      description: String(v.description ?? ""),
      priceMonthly,
      priceYearly,
      modules: v.allModules ? "all" : (Array.isArray(v.modules) ? v.modules.map(String) : []) as ModuleKey[],
      limits: { seats: toLimit(String(v.seats ?? "")), aiTokensPerMonth: toLimit(String(v.aiTokensPerMonth ?? "")), storageMb: toLimit(String(v.storageMb ?? "")) },
      trialDays: toInt(String(v.trialDays ?? "")),
      sortOrder: toInt(String(v.sortOrder ?? "")),
      active: v.active === true,
      isDefault: v.isDefault === true,
    },
  };
}
