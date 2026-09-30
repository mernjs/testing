import "server-only";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { COMPANIES_COLLECTION, type Company } from "@/lib/platform/tenancy/companies";
import { listPlans } from "@/lib/platform/billing/plans";
import { loadSubscriptionEvents, planMrr, type SubscriptionEvent } from "@/lib/platform/billing/events";
import { DEFAULT_TRIAL_DAYS, type BillingInterval, type CompanySubscription, type Plan, type SubscriptionStatus } from "@/lib/platform/billing/types";

/**
 * Platform revenue metrics for the owner's console (`/console/revenue`).
 * Cross-company, raw DB. The platform owner (`internal`) is excluded from
 * every figure.
 *
 * Definitions (all money = paise, pre-tax unless noted):
 * - MRR: companies whose EFFECTIVE status is active, past_due or grace, at the
 *   catalogue price of their plan + interval (yearly price / 12). Effective =
 *   the stored status with time-based transitions applied (expired trial or
 *   expired grace → suspended), exactly like `getEntitlements()`. A company
 *   with no stored subscription is an implicit trial of the default plan.
 * - ARR = 12 × MRR. ARPU = MRR / paying companies.
 * - Movements (per month, from `subscription_events`): new (0 → >0, includes
 *   reactivations), expansion (up), contraction (down, still >0), churn (>0 → 0).
 *   A company's first-ever event that isn't trial_started/activated is taken as
 *   its baseline, not a movement (history started after it was already paying).
 * - Logo churn (month) = companies paying at the month's start and not at its
 *   end ÷ companies paying at the start. MRR churn (gross) = (churn +
 *   contraction) ÷ MRR at the start.
 * - Trial conversion = trials started in the last TRIAL_WINDOW_DAYS that later
 *   reached `activated` ÷ those trials that have ended (still-running trials are
 *   left out of the denominator). Falls back to current state when there are
 *   no trial_started events in the window (`source: "current_state"`).
 * - Collected = paid `saas_invoices` by paidAt month, tax-inclusive `amount`.
 * Months are calendar months in India time (UTC+05:30, no DST).
 */

export const PLATFORM_UTC_OFFSET_MIN = 330;
export const TRIAL_WINDOW_DAYS = 90;
export const AT_RISK_TRIAL_DAYS = 7;
const DAY = 86_400_000;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PAYING: ReadonlySet<SubscriptionStatus> = new Set(["active", "past_due", "grace"]);

type TrackedStatus = Exclude<SubscriptionStatus, "internal">;

export interface MonthRow {
  /** "2026-09" */
  key: string;
  /** "Sep 2026" */
  label: string;
  /** MRR at the end of the month (the current month: live MRR now). */
  mrr: number;
  startMrr: number;
  new: number;
  expansion: number;
  contraction: number;
  churn: number;
  /** new + expansion − contraction − churn */
  net: number;
  payingAtStart: number;
  churnedLogos: number;
  logoChurnRate: number | null;
  mrrChurnRate: number | null;
  /** Paid invoices (tax-inclusive) by paidAt month. */
  collected: number;
  collectedTax: number;
  invoices: number;
}

export interface PlanMixRow {
  planId: string;
  name: string;
  companies: number;
  mrr: number;
  /** Share of total MRR, 0..1. */
  share: number;
}

export interface AtRiskRow {
  companyId: string;
  name: string;
  slug: string;
  planName: string;
  status: "past_due" | "grace" | "trialing";
  /** MRR at stake (for a trial: what it would be on conversion). */
  mrr: number;
  /** When it tips over: grace end, trial end, or period end for past_due. ISO string. */
  deadline: string | null;
}

export interface TrialConversion {
  windowDays: number;
  started: number;
  converted: number;
  open: number;
  rate: number | null;
  source: "events" | "current_state";
}

export interface RevenueDashboard {
  generatedAt: string;
  currency: string;
  mrr: number;
  arr: number;
  arpu: number | null;
  paying: number;
  totalCompanies: number;
  counts: Record<TrackedStatus, number>;
  planMix: PlanMixRow[];
  trialConversion: TrialConversion;
  /** Last 12 months, oldest first; the last row is the current (partial) month. */
  months: MonthRow[];
  atRisk: AtRiskRow[];
  history: { hasEvents: boolean; untrackedPaying: number };
}

// ─── months (India time) ──────────────────────────────────────────────────────

interface MonthSpan {
  key: string;
  label: string;
  start: Date;
  end: Date;
}

function monthStart(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 1) - PLATFORM_UTC_OFFSET_MIN * 60_000);
}

export function monthKeyOf(d: Date): string {
  const local = new Date(d.getTime() + PLATFORM_UTC_OFFSET_MIN * 60_000);
  return `${local.getUTCFullYear()}-${String(local.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** The last `n` calendar months ending with the one containing `now`, oldest first. */
export function lastMonths(now: Date, n = 12): MonthSpan[] {
  const local = new Date(now.getTime() + PLATFORM_UTC_OFFSET_MIN * 60_000);
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth();
  const out: MonthSpan[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const start = monthStart(y, m - i);
    const end = monthStart(y, m - i + 1);
    const s = new Date(start.getTime() + PLATFORM_UTC_OFFSET_MIN * 60_000);
    out.push({ key: `${s.getUTCFullYear()}-${String(s.getUTCMonth() + 1).padStart(2, "0")}`, label: `${MONTH_NAMES[s.getUTCMonth()]} ${s.getUTCFullYear()}`, start, end });
  }
  return out;
}

// ─── current state ────────────────────────────────────────────────────────────

type CompanyDoc = Company & { subscription?: CompanySubscription };

interface EffectiveSub {
  companyId: string;
  name: string;
  slug: string;
  createdAt: Date;
  planId: string;
  interval: BillingInterval;
  status: TrackedStatus;
  trialEndsAt: Date | null;
  graceEndsAt: Date | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
}

function effectiveSub(c: CompanyDoc, defaultPlan: Plan | undefined, now: Date): EffectiveSub | null {
  const s = c.subscription;
  if (s?.status === "internal") return null;
  const base = { companyId: c._id, name: c.name, slug: c.slug, createdAt: c.createdAt };
  if (!s) {
    const trialEndsAt = new Date(c.createdAt.getTime() + (defaultPlan?.trialDays ?? DEFAULT_TRIAL_DAYS) * DAY);
    return { ...base, planId: defaultPlan?._id ?? "trial", interval: "monthly", status: trialEndsAt <= now ? "suspended" : "trialing", trialEndsAt, graceEndsAt: null, currentPeriodStart: null, currentPeriodEnd: null };
  }
  let status: TrackedStatus = s.status;
  if (status === "trialing" && s.trialEndsAt && s.trialEndsAt <= now) status = "suspended";
  if (status === "grace" && s.graceEndsAt && s.graceEndsAt <= now) status = "suspended";
  return { ...base, planId: s.planId, interval: s.interval ?? "monthly", status, trialEndsAt: s.trialEndsAt ?? null, graceEndsAt: s.graceEndsAt ?? null, currentPeriodStart: s.currentPeriodStart ?? null, currentPeriodEnd: s.currentPeriodEnd ?? null };
}

// ─── history from events ─────────────────────────────────────────────────────

type Bucket = "new" | "expansion" | "contraction" | "churn";

function classify(prev: number, cur: number): Bucket | null {
  if (prev === cur) return null;
  if (prev === 0) return "new";
  if (cur === 0) return "churn";
  return cur > prev ? "expansion" : "contraction";
}

/** One company's MRR over time: an opening value plus ordered steps. */
interface Timeline {
  opening: number;
  steps: { at: Date; mrr: number }[];
}

function valueBefore(t: Timeline, when: Date): number {
  let v = t.opening;
  for (const s of t.steps) {
    if (s.at >= when) break;
    v = s.mrr;
  }
  return v;
}

// ─── the dashboard ───────────────────────────────────────────────────────────

interface InvoiceDoc {
  companyId: string;
  amount?: number;
  tax?: number;
  currency?: string;
  paidAt?: Date;
  status?: string;
}

export async function getRevenueDashboard(now: Date = new Date()): Promise<RevenueDashboard> {
  const db = await getPlatformDb();
  const months = lastMonths(now, 12);
  const windowStart = months[0].start;

  const [plans, companies, events, invoices] = await Promise.all([
    listPlans(),
    db
      .collection<CompanyDoc>(COMPANIES_COLLECTION)
      .find({}, { projection: { name: 1, slug: 1, createdAt: 1, isPlatformOwner: 1, subscription: 1 } })
      .toArray(),
    loadSubscriptionEvents(windowStart),
    db
      .collection<InvoiceDoc>("saas_invoices")
      .find({ status: "paid", paidAt: { $gte: windowStart, $lte: now } }, { projection: { companyId: 1, amount: 1, tax: 1, currency: 1, paidAt: 1 } })
      .toArray()
      .catch(() => [] as InvoiceDoc[]),
  ]);

  const planById = new Map(plans.map((p) => [p._id, p]));
  const defaultPlan = plans.find((p) => p.isDefault && p.active) ?? plans.find((p) => p.active);
  const ownerIds = new Set(companies.filter((c) => c.isPlatformOwner).map((c) => c._id));
  const subs = companies
    .filter((c) => !c.isPlatformOwner)
    .map((c) => effectiveSub(c, defaultPlan, now))
    .filter((s): s is EffectiveSub => s !== null);

  // Live figures.
  const counts: Record<TrackedStatus, number> = { trialing: 0, active: 0, past_due: 0, grace: 0, suspended: 0, canceled: 0 };
  const liveMrr = new Map<string, number>();
  const mix = new Map<string, PlanMixRow>();
  for (const s of subs) {
    counts[s.status]++;
    if (!PAYING.has(s.status)) continue;
    const plan = planById.get(s.planId);
    const mrr = planMrr(plan, s.interval);
    liveMrr.set(s.companyId, mrr);
    const row = mix.get(s.planId) ?? { planId: s.planId, name: plan?.name ?? s.planId, companies: 0, mrr: 0, share: 0 };
    row.companies++;
    row.mrr += mrr;
    mix.set(s.planId, row);
  }
  const mrr = [...liveMrr.values()].reduce((a, b) => a + b, 0);
  const paying = liveMrr.size;
  const planOrder = new Map(plans.map((p) => [p._id, p.sortOrder]));
  const planMix = [...mix.values()]
    .map((r) => ({ ...r, share: mrr > 0 ? r.mrr / mrr : 0 }))
    .sort((a, b) => (planOrder.get(a.planId) ?? 1e9) - (planOrder.get(b.planId) ?? 1e9) || a.name.localeCompare(b.name));

  // Timelines + movements.
  const isTracked = (e: SubscriptionEvent) => !ownerIds.has(e.companyId) && e.at <= now;
  const openingEvents = events.opening.filter(isTracked);
  const inWindow = events.inWindow.filter(isTracked);
  const timelines = new Map<string, Timeline>();
  for (const e of openingEvents) timelines.set(e.companyId, { opening: e.mrr, steps: [] });
  const movement = new Map<string, Record<Bucket, number>>(months.map((m) => [m.key, { new: 0, expansion: 0, contraction: 0, churn: 0 }]));
  for (const e of inWindow) {
    let t = timelines.get(e.companyId);
    const firstEver = !t;
    if (!t) {
      t = { opening: 0, steps: [] };
      timelines.set(e.companyId, t);
    }
    const prev = t.steps.length ? t.steps[t.steps.length - 1].mrr : t.opening;
    if (firstEver && e.type !== "trial_started" && e.type !== "activated") {
      // History began after this company was already subscribed: baseline, not a movement.
      t.opening = e.mrr;
      continue;
    }
    t.steps.push({ at: e.at, mrr: e.mrr });
    const bucket = classify(prev, e.mrr);
    const m = movement.get(monthKeyOf(e.at));
    if (bucket && m) m[bucket] += Math.abs(e.mrr - prev);
  }
  // Paying companies with no history at all: shown flat at their live MRR from sign-up.
  const untracked = subs.filter((s) => liveMrr.has(s.companyId) && !timelines.has(s.companyId));

  const valueAt = (when: Date) => {
    let total = 0;
    let logos = 0;
    for (const t of timelines.values()) {
      const v = valueBefore(t, when);
      total += v;
      if (v > 0) logos++;
    }
    for (const s of untracked) {
      if (s.createdAt < when) {
        total += liveMrr.get(s.companyId) ?? 0;
        logos++;
      }
    }
    return { total, logos };
  };

  // Cash collected.
  const cash = new Map<string, { amount: number; tax: number; count: number }>();
  for (const inv of invoices) {
    if (!inv.paidAt || ownerIds.has(inv.companyId)) continue;
    if (inv.currency && inv.currency !== "INR") continue;
    const key = monthKeyOf(inv.paidAt);
    const c = cash.get(key) ?? { amount: 0, tax: 0, count: 0 };
    c.amount += Number(inv.amount) || 0;
    c.tax += Number(inv.tax) || 0;
    c.count++;
    cash.set(key, c);
  }

  const monthRows: MonthRow[] = months.map((m, i) => {
    const isCurrent = i === months.length - 1;
    const endAt = isCurrent ? new Date(now.getTime() + 1) : m.end;
    const start = valueAt(m.start);
    const mv = movement.get(m.key)!;
    let churnedLogos = 0;
    for (const t of timelines.values()) if (valueBefore(t, m.start) > 0 && valueBefore(t, endAt) === 0) churnedLogos++;
    const c = cash.get(m.key);
    return {
      key: m.key,
      label: m.label,
      mrr: isCurrent ? mrr : valueAt(m.end).total,
      startMrr: start.total,
      ...mv,
      net: mv.new + mv.expansion - mv.contraction - mv.churn,
      payingAtStart: start.logos,
      churnedLogos,
      logoChurnRate: start.logos > 0 ? churnedLogos / start.logos : null,
      mrrChurnRate: start.total > 0 ? (mv.churn + mv.contraction) / start.total : null,
      collected: c?.amount ?? 0,
      collectedTax: c?.tax ?? 0,
      invoices: c?.count ?? 0,
    };
  });

  // Trial conversion.
  const trialFrom = new Date(now.getTime() - TRIAL_WINDOW_DAYS * DAY);
  const statusById = new Map(subs.map((s) => [s.companyId, s]));
  const trialStarts = new Map<string, Date>();
  for (const e of inWindow) if (e.type === "trial_started" && e.at >= trialFrom && !trialStarts.has(e.companyId)) trialStarts.set(e.companyId, e.at);
  let trialConversion: TrialConversion;
  if (trialStarts.size > 0) {
    let converted = 0;
    let open = 0;
    for (const [companyId, startedAt] of trialStarts) {
      if (inWindow.some((e) => e.companyId === companyId && e.type === "activated" && e.at >= startedAt)) converted++;
      else if (statusById.get(companyId)?.status === "trialing") open++;
    }
    const decided = trialStarts.size - open;
    trialConversion = { windowDays: TRIAL_WINDOW_DAYS, started: trialStarts.size, converted, open, rate: decided > 0 ? converted / decided : null, source: "events" };
  } else {
    const cohort = subs.filter((s) => s.createdAt >= trialFrom);
    const converted = cohort.filter((s) => PAYING.has(s.status) || ((s.status === "canceled" || s.status === "suspended") && s.currentPeriodStart !== null)).length;
    const open = cohort.filter((s) => s.status === "trialing").length;
    const decided = cohort.length - open;
    trialConversion = { windowDays: TRIAL_WINDOW_DAYS, started: cohort.length, converted, open, rate: decided > 0 ? converted / decided : null, source: "current_state" };
  }

  // At risk.
  const soon = new Date(now.getTime() + AT_RISK_TRIAL_DAYS * DAY);
  const atRisk: AtRiskRow[] = [];
  for (const s of subs) {
    const plan = planById.get(s.planId);
    const planName = plan?.name ?? s.planId;
    if (s.status === "past_due" || s.status === "grace") {
      const deadline = s.status === "grace" ? s.graceEndsAt : s.currentPeriodEnd;
      atRisk.push({ companyId: s.companyId, name: s.name, slug: s.slug, planName, status: s.status, mrr: liveMrr.get(s.companyId) ?? 0, deadline: deadline?.toISOString() ?? null });
    } else if (s.status === "trialing" && s.trialEndsAt && s.trialEndsAt > now && s.trialEndsAt <= soon) {
      atRisk.push({ companyId: s.companyId, name: s.name, slug: s.slug, planName, status: "trialing", mrr: planMrr(plan, s.interval), deadline: s.trialEndsAt.toISOString() });
    }
  }
  const rank = { grace: 0, past_due: 1, trialing: 2 } as const;
  atRisk.sort((a, b) => rank[a.status] - rank[b.status] || (a.deadline ?? "9").localeCompare(b.deadline ?? "9"));

  return {
    generatedAt: now.toISOString(),
    currency: "INR",
    mrr,
    arr: mrr * 12,
    arpu: paying > 0 ? Math.round(mrr / paying) : null,
    paying,
    totalCompanies: subs.length,
    counts,
    planMix,
    trialConversion,
    months: monthRows,
    atRisk,
    history: { hasEvents: timelines.size > 0, untrackedPaying: untracked.length },
  };
}
