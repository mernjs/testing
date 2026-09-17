/**
 * Client-safe Festival Offers constants and pure helpers. NEVER import
 * `server-only` here — this module is imported by client components (forms,
 * cards, the audience selector, the claim modal). Server modules re-export
 * from here where convenient.
 *
 * Badge/dot class shapes mirror `src/lib/tms/constants.ts` so the shared
 * badge styling applies unchanged.
 */

import type { CategorySlug } from "@/lib/categories";

// ---------------------------------------------------------------------------
// Audience
// ---------------------------------------------------------------------------

export const AUDIENCES = [
  { value: "CLIENT", label: "Business / Client" },
  { value: "STUDENT", label: "Student / Developer" },
  { value: "INTERN", label: "Internship" },
  { value: "HIRING", label: "Hiring / Resource Augmentation" },
  { value: "ALL", label: "Everyone" },
] as const;

export type Audience = (typeof AUDIENCES)[number]["value"];

export function isValidAudience(value: unknown): value is Audience {
  return typeof value === "string" && AUDIENCES.some((a) => a.value === value);
}

export function getAudienceLabel(value: string): string {
  return AUDIENCES.find((a) => a.value === value)?.label ?? value;
}

/** The 3 public-facing audience-selector tabs. "Student" also surfaces Internship offers. */
export const PUBLIC_AUDIENCE_TABS = [
  { key: "CLIENT", label: "I'm a Business / Client", cta: "Explore Client Offers", matches: ["CLIENT", "HIRING"] as Audience[] },
  { key: "STUDENT", label: "I'm a Student / Developer", cta: "Explore Student Offers", matches: ["STUDENT", "INTERN"] as Audience[] },
  { key: "HIRING", label: "I Need Developers", cta: "Explore Hiring Offers", matches: ["HIRING"] as Audience[] },
] as const;

export type PublicAudienceTabKey = (typeof PUBLIC_AUDIENCE_TABS)[number]["key"];

// ---------------------------------------------------------------------------
// Campaign
// ---------------------------------------------------------------------------

export const CAMPAIGN_TYPES = [
  { value: "festival", label: "Festival" },
  { value: "seasonal", label: "Seasonal Sale" },
  { value: "flash-sale", label: "Flash Sale" },
  { value: "evergreen", label: "Evergreen" },
] as const;

export type CampaignType = (typeof CAMPAIGN_TYPES)[number]["value"];

export function isValidCampaignType(value: unknown): value is CampaignType {
  return typeof value === "string" && CAMPAIGN_TYPES.some((t) => t.value === value);
}

export const CAMPAIGN_STATUSES = [
  { value: "draft", label: "Draft", badgeClass: "bg-secondary/60 text-secondary-foreground", dotClass: "bg-secondary-foreground/50" },
  { value: "scheduled", label: "Scheduled", badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400", dotClass: "bg-blue-500" },
  { value: "active", label: "Active", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400", dotClass: "bg-green-500" },
  { value: "paused", label: "Paused", badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400", dotClass: "bg-amber-500" },
  { value: "expired", label: "Expired", badgeClass: "bg-muted text-muted-foreground", dotClass: "bg-muted-foreground/60" },
  { value: "archived", label: "Archived", badgeClass: "bg-muted text-muted-foreground", dotClass: "bg-muted-foreground/40" },
] as const;

export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number]["value"];

export const DEFAULT_CAMPAIGN_STATUS: CampaignStatus = "draft";

export function isValidCampaignStatus(value: unknown): value is CampaignStatus {
  return typeof value === "string" && CAMPAIGN_STATUSES.some((s) => s.value === value);
}

export function getCampaignStatusMeta(status: string | undefined) {
  return CAMPAIGN_STATUSES.find((s) => s.value === status) ?? CAMPAIGN_STATUSES[0];
}

/**
 * Display-only status that folds the date window into the stored `status`
 * (e.g. a "scheduled" campaign whose window has passed reads as "expired" in
 * the admin list, even though nothing has flipped its stored status). Purely
 * cosmetic — `getActiveCampaign()` in `campaigns.ts` is the functional source
 * of truth and does its own date comparison independently.
 */
export function getCampaignEffectiveStatus(
  status: CampaignStatus,
  startDate: Date | string,
  endDate: Date | string,
  now: Date = new Date()
): CampaignStatus {
  if (status === "draft" || status === "paused" || status === "archived") return status;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (now < start) return "scheduled";
  if (now > end) return "expired";
  return "active";
}

// ---------------------------------------------------------------------------
// Offer
// ---------------------------------------------------------------------------

export const OFFER_STATUSES = [
  { value: "draft", label: "Draft", badgeClass: "bg-secondary/60 text-secondary-foreground", dotClass: "bg-secondary-foreground/50" },
  { value: "active", label: "Active", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400", dotClass: "bg-green-500" },
  { value: "paused", label: "Paused", badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400", dotClass: "bg-amber-500" },
  { value: "expired", label: "Expired", badgeClass: "bg-muted text-muted-foreground", dotClass: "bg-muted-foreground/60" },
  { value: "archived", label: "Archived", badgeClass: "bg-muted text-muted-foreground", dotClass: "bg-muted-foreground/40" },
] as const;

export type OfferStatus = (typeof OFFER_STATUSES)[number]["value"];

export const DEFAULT_OFFER_STATUS: OfferStatus = "draft";

export function isValidOfferStatus(value: unknown): value is OfferStatus {
  return typeof value === "string" && OFFER_STATUSES.some((s) => s.value === value);
}

export function getOfferStatusMeta(status: string | undefined) {
  return OFFER_STATUSES.find((s) => s.value === status) ?? OFFER_STATUSES[0];
}

export const PRICING_MODES = [
  { value: "percentage", label: "Percentage off" },
  { value: "flat", label: "Flat amount off" },
  { value: "custom_quote", label: "Custom Quote (no numeric price)" },
] as const;

export type PricingMode = (typeof PRICING_MODES)[number]["value"];

export function isValidPricingMode(value: unknown): value is PricingMode {
  return typeof value === "string" && PRICING_MODES.some((m) => m.value === value);
}

export const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage" },
  { value: "flat", label: "Flat amount" },
] as const;

export type DiscountType = (typeof DISCOUNT_TYPES)[number]["value"];

export function isValidDiscountType(value: unknown): value is DiscountType {
  return typeof value === "string" && DISCOUNT_TYPES.some((t) => t.value === value);
}

export const DEFAULT_CURRENCY = "INR";

/** Builds a human badge string from an offer's pricing config, e.g. "UP TO 70% OFF" / "₹10,000 OFF" / "Custom Quote". */
export function formatOfferBadge(pricing: {
  mode: PricingMode;
  percentage?: number | null;
  flatDiscountAmount?: number | null;
  currency?: string | null;
  startingPriceLabel?: string | null;
}): string {
  if (pricing.mode === "percentage" && pricing.percentage) return `UP TO ${pricing.percentage}% OFF`;
  if (pricing.mode === "flat" && pricing.flatDiscountAmount) {
    const currency = pricing.currency ?? DEFAULT_CURRENCY;
    return `${currency === "INR" ? "₹" : currency + " "}${pricing.flatDiscountAmount.toLocaleString("en-IN")} OFF`;
  }
  return pricing.startingPriceLabel?.trim() || "Custom Quote";
}

// ---------------------------------------------------------------------------
// Service reference href — where a claimed service's real detail page lives.
// Each pillar uses a different URL convention on the public site today; this
// is a read helper only, no new pages are created here.
// ---------------------------------------------------------------------------

export function getServiceHref(category: CategorySlug, subService: string): string {
  switch (category) {
    case "software-development":
      return subService === "all" ? "/software-development" : `/services/${subService}`;
    case "ai-automations":
      return subService === "all" ? "/ai-automations" : `/ai-automations/${subService}`;
    case "resource-augmentation":
      return subService === "all" ? "/resource-augmentation" : `/resource-augmentation/${subService}`;
    case "industrial-training":
      return "/industrial-training";
    case "internship-program":
      return "/internship-program";
    default:
      return "/services";
  }
}

// ---------------------------------------------------------------------------
// Analytics event types
// ---------------------------------------------------------------------------

export const EVENT_TYPES = [
  "campaign_view",
  "offer_view",
  "offer_click",
  "form_start",
  "coupon_apply",
  "whatsapp_click",
  "call_click",
  "exit_intent_shown",
  "scroll_cta_click",
] as const;

export type OfferEventType = (typeof EVENT_TYPES)[number];

export function isValidEventType(value: unknown): value is OfferEventType {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value);
}

export const DEVICE_TYPES = ["mobile", "tablet", "desktop"] as const;
export type DeviceType = (typeof DEVICE_TYPES)[number];

export function isValidDeviceType(value: unknown): value is DeviceType {
  return typeof value === "string" && (DEVICE_TYPES as readonly string[]).includes(value);
}

/** Classifies a viewport width the same way this codebase's own Tailwind breakpoints do (sm=640, lg=1024). */
export function classifyDevice(viewportWidth: number): DeviceType {
  if (viewportWidth < 640) return "mobile";
  if (viewportWidth < 1024) return "tablet";
  return "desktop";
}

// ---------------------------------------------------------------------------
// Festival theme presets — an optional starting point for a campaign's
// theme colors; the admin can still hand-edit primaryColor/accentColor
// afterwards. "custom" (the default) applies no preset at all.
// ---------------------------------------------------------------------------

export const CAMPAIGN_THEME_PRESETS = [
  { key: "custom", label: "Custom (manual colors)", emoji: null, primaryColor: null, accentColor: null },
  { key: "diwali", label: "Diwali — Festive Gold", emoji: "🪔", primaryColor: "#E56043", accentColor: "#D4AF37" },
  { key: "holi", label: "Holi — Colorful", emoji: "🎨", primaryColor: "#E0537A", accentColor: "#4CAF93" },
  { key: "new-year", label: "New Year — Modern", emoji: "🎉", primaryColor: "#1D428A", accentColor: "#E56043" },
  { key: "independence-day", label: "Independence Day — Patriotic", emoji: "🇮🇳", primaryColor: "#FF9933", accentColor: "#138808" },
  { key: "christmas", label: "Christmas", emoji: "🎄", primaryColor: "#B3261E", accentColor: "#1E7A4C" },
  { key: "summer-sale", label: "Summer Sale", emoji: "☀️", primaryColor: "#F5A623", accentColor: "#1D428A" },
  { key: "back-to-college", label: "Back to College", emoji: "🎓", primaryColor: "#1D428A", accentColor: "#E56043" },
] as const;

export type CampaignThemePreset = (typeof CAMPAIGN_THEME_PRESETS)[number]["key"];

export const DEFAULT_THEME_PRESET: CampaignThemePreset = "custom";

export function isValidThemePreset(value: unknown): value is CampaignThemePreset {
  return typeof value === "string" && CAMPAIGN_THEME_PRESETS.some((p) => p.key === value);
}

export function getThemePreset(key: string | undefined) {
  return CAMPAIGN_THEME_PRESETS.find((p) => p.key === key) ?? CAMPAIGN_THEME_PRESETS[0];
}

// ---------------------------------------------------------------------------
// Generic label helper
// ---------------------------------------------------------------------------

export function titleize(value: string): string {
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
