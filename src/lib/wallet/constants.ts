/**
 * Client-safe Wallet & Credits constants and pure helpers. NEVER import
 * `server-only` here — this is the one wallet file client components
 * (WalletSummaryCard, ReferralCodeCard, the claim-modal wallet toggle) may
 * import. Server modules re-export from here where convenient.
 */

export const WALLET_TX_TYPES = [
  "signup_bonus",
  "referral_bonus_referrer",
  "referral_bonus_referee",
  "manual_adjustment",
  "redemption_reserved",
  "redemption_confirmed",
  "redemption_released",
  "expiry",
  "reversal",
] as const;

export type WalletTxType = (typeof WALLET_TX_TYPES)[number];

export function isValidWalletTxType(v: unknown): v is WalletTxType {
  return typeof v === "string" && (WALLET_TX_TYPES as readonly string[]).includes(v);
}

export const WALLET_TX_TYPE_LABELS: Record<WalletTxType, string> = {
  signup_bonus: "Signup Reward",
  referral_bonus_referrer: "Referral Reward",
  referral_bonus_referee: "Referral Welcome Bonus",
  manual_adjustment: "Manual Adjustment",
  redemption_reserved: "Redemption Reserved",
  redemption_confirmed: "Redemption",
  redemption_released: "Redemption Released",
  expiry: "Expired",
  reversal: "Reversed",
};

export const WALLET_BUCKETS = ["available", "pending", "locked"] as const;
export type WalletBucket = (typeof WALLET_BUCKETS)[number];

export const WALLET_TX_DIRECTIONS = ["credit", "debit"] as const;
export type WalletTxDirection = (typeof WALLET_TX_DIRECTIONS)[number];

export const WALLET_TX_STATUSES = ["active", "expired", "reversed", "superseded"] as const;
export type WalletTxStatus = (typeof WALLET_TX_STATUSES)[number];

export const WALLET_STATUSES = ["active", "frozen"] as const;
export type WalletStatus = (typeof WALLET_STATUSES)[number];

export const REWARD_RULE_TYPES = ["signup", "referral_referrer", "referral_referee"] as const;
export type RewardRuleType = (typeof REWARD_RULE_TYPES)[number];

export function isValidRewardRuleType(v: unknown): v is RewardRuleType {
  return typeof v === "string" && (REWARD_RULE_TYPES as readonly string[]).includes(v);
}

export const REWARD_RULE_TYPE_LABELS: Record<RewardRuleType, string> = {
  signup: "Signup Reward",
  referral_referrer: "Referral Reward (Referrer)",
  referral_referee: "Referral Welcome Bonus (Referee)",
};

/** `PortalRole | "ALL"` without importing `portal-roles.ts` here (kept import-light and dependency-free). */
export const REWARD_RULE_AUDIENCES = ["ALL", "job_applicant", "intern", "trainee", "client"] as const;
export type RewardRuleAudience = (typeof REWARD_RULE_AUDIENCES)[number];

export function isValidRewardRuleAudience(v: unknown): v is RewardRuleAudience {
  return typeof v === "string" && (REWARD_RULE_AUDIENCES as readonly string[]).includes(v);
}

export const REFERRAL_STATUSES = ["REGISTERED", "QUALIFIED", "REWARDED", "REJECTED", "FRAUD_HOLD"] as const;
export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

export const REFERRAL_STATUS_META: Record<ReferralStatus, { label: string; badgeClass: string; dotClass: string }> = {
  REGISTERED: { label: "Pending", badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400", dotClass: "bg-blue-500" },
  QUALIFIED: { label: "Qualified", badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400", dotClass: "bg-amber-500" },
  REWARDED: { label: "Rewarded", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400", dotClass: "bg-green-500" },
  REJECTED: { label: "Rejected", badgeClass: "bg-destructive/15 text-destructive", dotClass: "bg-destructive" },
  FRAUD_HOLD: { label: "Fraud Hold", badgeClass: "bg-destructive/15 text-destructive", dotClass: "bg-destructive" },
};

/** What must happen before a referral is rewarded. `first_offer_claim` is the one real purchase-intent signal that exists today (TMS/FMS payment hooks are a later phase). */
export const REFERRAL_QUALIFYING_EVENTS = ["account_created", "first_offer_claim", "first_payment"] as const;
export type ReferralQualifyingEvent = (typeof REFERRAL_QUALIFYING_EVENTS)[number];

export const REFERRAL_QUALIFYING_EVENT_LABELS: Record<ReferralQualifyingEvent, string> = {
  account_created: "Referred person creates an account",
  first_offer_claim: "Referred person claims their first offer",
  first_payment: "Referred person makes their first payment (course fee or invoice)",
};

export function isValidQualifyingEvent(v: unknown): v is ReferralQualifyingEvent {
  return typeof v === "string" && (REFERRAL_QUALIFYING_EVENTS as readonly string[]).includes(v);
}

/** Friendly account-type names for the four portal roles, used in admin rule screens and the signup form. */
export const AUDIENCE_LABELS: Record<RewardRuleAudience, string> = {
  ALL: "All account types",
  trainee: "Student (Training)",
  intern: "Student (Intern)",
  client: "Client / Business",
  job_applicant: "Job Seeker / Hiring User",
};

/** Platform areas that can spend credits. Only `offers` is wired to a live checkout today; the others are configurable now and enforced by `chargeCredits` the moment a panel calls it. */
export const USAGE_MODULES = ["offers", "training", "projects", "hiring"] as const;
export type UsageModule = (typeof USAGE_MODULES)[number];

export const USAGE_MODULE_LABELS: Record<UsageModule, string> = {
  offers: "Festival Offers",
  training: "Courses & Training",
  projects: "Projects & Services",
  hiring: "Hiring Services",
};

export function isValidUsageModule(v: unknown): v is UsageModule {
  return typeof v === "string" && (USAGE_MODULES as readonly string[]).includes(v);
}

export const DEFAULT_CURRENCY = "INR";

export const CREDITS_LABEL = "YO Credits";

export function formatCredits(n: number): string {
  return `${Math.round(n).toLocaleString("en-IN")} ${CREDITS_LABEL}`;
}

/** Referral codes are 8 uppercase Crockford-base32-ish chars — no ambiguous 0/O/1/I/L, no internal IDs exposed. */
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function isValidReferralCode(code: unknown): code is string {
  return typeof code === "string" && /^[A-Z0-9]{6,10}$/.test(code);
}

export function randomReferralCode(bytes: Buffer): string {
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}
