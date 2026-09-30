import type { ModuleKey } from "@/lib/platform/onboarding/catalog";

/**
 * Billing contract shared by every Phase 2 workstream (plans, subscriptions,
 * enforcement, invoices, revenue). Client-safe — no data access here.
 * Money is always an integer in the smallest currency unit (paise for INR).
 */

export type BillingInterval = "monthly" | "yearly";

export interface PlanLimits {
  /** Max active user accounts (admin_users); null = unlimited. */
  seats: number | null;
  /** AI tokens per calendar month across all AI features; null = unlimited. */
  aiTokensPerMonth: number | null;
  /** File storage in MB; null = unlimited. */
  storageMb: number | null;
}

export interface Plan {
  /** Stable key, e.g. "starter". */
  _id: string;
  name: string;
  description: string;
  currency: string;
  /** Per month / per year, smallest currency unit, before tax. */
  priceMonthly: number;
  priceYearly: number;
  /** Panels included; "all" = every panel. Core panels (see MODULES.core) are always included. */
  modules: ModuleKey[] | "all";
  limits: PlanLimits;
  trialDays: number;
  /** Shown on the pricing/checkout pages and selectable for new subscriptions. */
  active: boolean;
  /** Plan offered by default to new sign-ups (exactly one). */
  isDefault: boolean;
  sortOrder: number;
  /** Provider-side plan ids, created lazily by the subscriptions workstream. */
  provider?: { razorpay?: Partial<Record<BillingInterval, string>> };
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Subscription lifecycle:
 * trialing → active (paid) → past_due (payment failed, retrying) → grace (retries exhausted,
 * still usable for GRACE_DAYS) → suspended (read-only / blocked) ; canceled at any point.
 * `internal` = the platform owner (never billed).
 */
export type SubscriptionStatus = "internal" | "trialing" | "active" | "past_due" | "grace" | "suspended" | "canceled";

export interface CompanySubscription {
  planId: string;
  status: SubscriptionStatus;
  interval: BillingInterval;
  trialEndsAt: Date | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  graceEndsAt: Date | null;
  provider: { id: "razorpay"; subscriptionId: string | null; customerId: string | null } | null;
  /** GST / billing details for invoices. */
  billingDetails?: { legalName: string; gstin: string | null; address: string; state: string; email: string } | null;
  updatedAt: Date;
}

/** Usage metrics metered per company per calendar month. */
export type UsageMetric = "ai_tokens" | "storage_mb" | "emails";

/** What the current company may do right now — the single question every panel asks. */
export interface Entitlements {
  planId: string | null;
  planName: string | null;
  status: SubscriptionStatus;
  /** null = all panels. */
  modules: Set<string> | null;
  limits: PlanLimits;
  /** Suspended/canceled: data stays visible but nothing new can be created. */
  readOnly: boolean;
  /** Days left in the trial (trialing only). */
  trialDaysLeft: number | null;
}

/**
 * First-run fallbacks only. The live values are platform settings
 * (`getBillingSettings()` in `settings.ts`), edited in the Platform Panel.
 */
export const GRACE_DAYS = 7;
export const DEFAULT_TRIAL_DAYS = 30;
export const GST_RATE = 0.18;

export function formatMoney(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: amount % 100 === 0 ? 0 : 2 }).format(amount / 100);
}
