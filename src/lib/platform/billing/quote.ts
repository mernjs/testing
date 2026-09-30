import "server-only";
import { getPlan } from "@/lib/platform/billing/plans";
import { getBillingSettings } from "@/lib/platform/billing/settings";
import type { BillingInterval } from "@/lib/platform/billing/types";

/**
 * The one place a price is worked out before a company pays: checkout,
 * plan changes and invoices all ask `quoteCheckout`. Amounts are pre-tax,
 * in paise; GST is split and added by the invoices workstream (`gst.ts`).
 *
 * The coupons & add-ons workstream extends this (discount and add-on lines);
 * callers must only rely on the `Quote` shape.
 */

export interface QuoteLine {
  kind: "plan" | "addon" | "discount";
  /** Plan id, add-on id or coupon id. */
  refId: string;
  label: string;
  /** Pre-tax, paise. Discount lines are negative. */
  amount: number;
}

export interface Quote {
  planId: string;
  interval: BillingInterval;
  currency: string;
  lines: QuoteLine[];
  /** Plan + add-ons, before discount. */
  subtotal: number;
  /** Positive number of paise taken off. */
  discount: number;
  /** subtotal − discount; what GST is charged on. */
  taxable: number;
  gstRatePercent: number;
  /** Applied coupon, if the code was valid. */
  couponId: string | null;
  /** Why a supplied coupon code was not applied. */
  couponError: string | null;
}

export interface QuoteInput {
  planId: string;
  interval: BillingInterval;
  companyId?: string | null;
  couponCode?: string | null;
  addonIds?: string[];
}

export async function quoteCheckout(input: QuoteInput): Promise<Quote | null> {
  const [plan, settings] = await Promise.all([getPlan(input.planId), getBillingSettings()]);
  if (!plan) return null;
  const price = input.interval === "yearly" ? plan.priceYearly : plan.priceMonthly;
  const lines: QuoteLine[] = [{ kind: "plan", refId: plan._id, label: `${plan.name} (${input.interval})`, amount: price }];
  const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);
  return {
    planId: plan._id,
    interval: input.interval,
    currency: plan.currency || settings.billing.currency,
    lines,
    subtotal,
    discount: 0,
    taxable: subtotal,
    gstRatePercent: settings.tax.gstRatePercent,
    couponId: null,
    couponError: input.couponCode ? "Coupons aren't available yet." : null,
  };
}
