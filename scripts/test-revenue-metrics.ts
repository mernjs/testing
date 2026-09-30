/**
 * Revenue metrics checks (MRR normalisation, owner exclusion, movements,
 * churn, trial conversion, collections, empty state) against a throwaway
 * database that is dropped at the end.
 *
 *   MONGODB_URI=mongodb://127.0.0.1:27099/p2f_test_$(date +%s) \
 *     npx --yes tsx --require ./scripts/lib/next-server-shims.cjs scripts/test-revenue-metrics.ts
 */
import assert from "node:assert/strict";
import { clientPromise, getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { getRevenueDashboard, lastMonths } from "@/lib/platform/billing/metrics";
import { recordSubscriptionEvent, SUBSCRIPTION_EVENTS_COLLECTION } from "@/lib/platform/billing/events";

const DAY = 86_400_000;
// Noon IST, 15 Sep 2026.
const NOW = new Date("2026-09-15T06:30:00Z");
const at = (iso: string) => new Date(iso);
const later = (days: number) => new Date(NOW.getTime() + days * DAY);

const GROWTH_M = 299_900;
const STARTER_M = 99_900;
const BUSINESS_Y = Math.round(7_999_000 / 12); // 666_583

function sub(planId: string, status: string, interval: "monthly" | "yearly", extra: Record<string, unknown> = {}) {
  return { planId, status, interval, trialEndsAt: null, currentPeriodStart: status === "trialing" ? null : at("2026-09-01T00:00:00Z"), currentPeriodEnd: null, cancelAtPeriodEnd: false, graceEndsAt: null, provider: null, updatedAt: NOW, ...extra };
}

let checks = 0;
function eq<T>(actual: T, expected: T, msg: string) {
  assert.deepEqual(actual, expected, msg);
  checks++;
}

async function main() {
  const db = await getPlatformDb();
  if (!/test/.test(db.databaseName)) throw new Error(`Refusing to run against "${db.databaseName}"`);
  const companies = db.collection("companies");
  const events = db.collection(SUBSCRIPTION_EVENTS_COLLECTION);
  const invoices = db.collection("saas_invoices");
  const created = at("2025-01-01T00:00:00Z");

  // ── Month helper ──
  const months = lastMonths(NOW, 12);
  eq(months.length, 12, "12 months");
  eq([months[0].key, months[11].key, months[11].label], ["2025-10", "2026-09", "Sep 2026"], "window Oct 2025 → Sep 2026");
  eq(months[11].start.toISOString(), "2026-08-31T18:30:00.000Z", "months start at IST midnight");

  // ── Empty platform: only the owner exists ──
  await companies.insertOne({ _id: "owner" as never, slug: "owner", name: "Owner", status: "active", isPlatformOwner: true, createdAt: created, updatedAt: created, subscription: sub("internal", "internal", "monthly") });
  const empty = await getRevenueDashboard(NOW);
  eq([empty.mrr, empty.arr, empty.arpu, empty.paying, empty.totalCompanies], [0, 0, null, 0, 0], "empty: zeros");
  eq(empty.months.length, 12, "empty: 12-month series");
  eq(empty.months.every((m) => m.mrr === 0 && m.net === 0 && m.collected === 0 && m.logoChurnRate === null && m.mrrChurnRate === null), true, "empty: all-zero months");
  eq([empty.trialConversion.rate, empty.trialConversion.source, empty.atRisk.length, empty.planMix.length], [null, "current_state", 0, 0], "empty: no conversion, risk, mix");
  eq(empty.history, { hasEvents: false, untrackedPaying: 0 }, "empty: no history");

  // ── Seed ──
  await companies.insertMany(
    [
      ["A", sub("growth", "active", "monthly")],
      ["B", sub("business", "active", "yearly")],
      ["C", sub("starter", "canceled", "monthly")],
      ["D", sub("starter", "past_due", "monthly", { currentPeriodEnd: later(3) })],
      ["E", sub("starter", "grace", "monthly", { graceEndsAt: later(2) })],
      ["F", sub("growth", "trialing", "monthly", { trialEndsAt: later(5) })],
      ["G", sub("growth", "trialing", "monthly", { trialEndsAt: later(-1) })],
      ["H", undefined],
      ["I", sub("growth", "grace", "monthly", { graceEndsAt: later(-1) })],
      ["J", sub("starter", "active", "monthly")],
    ].map(([id, s]) => ({
      _id: id as never,
      slug: String(id).toLowerCase(),
      name: `Company ${id}`,
      status: "active",
      isPlatformOwner: false,
      createdAt: id === "D" ? at("2026-07-01T00:00:00Z") : id === "H" ? later(-2) : created,
      updatedAt: NOW,
      ...(s ? { subscription: s } : {}),
    })),
  );
  let n = 0;
  const ev = (companyId: string, type: string, iso: string, mrr: number, planId = "x") => ({ _id: `e${++n}`, companyId, type, planId, interval: "monthly", mrr, at: at(iso) });
  await events.insertMany([
    ev("owner", "activated", "2026-05-01T00:00:00Z", 9_999_900), // must be ignored
    ev("A", "trial_started", "2026-05-01T00:00:00Z", 0),
    ev("A", "activated", "2026-05-15T00:00:00Z", GROWTH_M),
    ev("B", "activated", "2026-06-10T00:00:00Z", GROWTH_M),
    ev("B", "plan_changed", "2026-08-05T00:00:00Z", BUSINESS_Y),
    ev("C", "activated", "2026-04-03T00:00:00Z", STARTER_M),
    ev("C", "canceled", "2026-08-20T00:00:00Z", 0),
    ev("E", "activated", "2026-03-01T00:00:00Z", GROWTH_M),
    ev("E", "plan_changed", "2026-07-10T00:00:00Z", STARTER_M),
    ev("E", "past_due", "2026-09-01T00:00:00Z", STARTER_M),
    ev("E", "grace", "2026-09-05T00:00:00Z", STARTER_M),
    ev("F", "trial_started", "2026-09-10T00:00:00Z", 0),
    ev("G", "trial_started", "2026-08-01T00:00:00Z", 0),
    ev("J", "trial_started", "2026-07-01T00:00:00Z", 0),
    ev("J", "activated", "2026-07-15T00:00:00Z", STARTER_M),
    ev("A", "activated", "2026-10-01T00:00:00Z", 1), // future: ignored
  ]);
  await invoices.insertMany([
    { _id: "i1" as never, companyId: "A", number: "YO-1", amount: 353_882, taxable: 299_900, tax: 53_982, currency: "INR", status: "paid", paidAt: at("2026-08-15T00:00:00Z") },
    { _id: "i2" as never, companyId: "B", number: "YO-2", amount: 9_438_820, taxable: 7_999_000, tax: 1_439_820, currency: "INR", status: "paid", paidAt: at("2026-08-05T00:00:00Z") },
    { _id: "i3" as never, companyId: "owner", number: "YO-3", amount: 5_000_000, tax: 0, currency: "INR", status: "paid", paidAt: at("2026-08-05T00:00:00Z") },
    { _id: "i4" as never, companyId: "A", number: "YO-4", amount: 777, tax: 0, currency: "INR", status: "issued", paidAt: null },
    { _id: "i5" as never, companyId: "A", number: "YO-5", amount: 888, tax: 0, currency: "USD", status: "paid", paidAt: at("2026-08-05T00:00:00Z") },
    { _id: "i6" as never, companyId: "J", number: "YO-6", amount: 100_000, tax: 15_254, currency: "INR", status: "paid", paidAt: at("2026-08-31T20:00:00Z") }, // Sep 1 IST
  ]);

  const d = await getRevenueDashboard(NOW);
  const LIVE = GROWTH_M + BUSINESS_Y + STARTER_M /* D */ + STARTER_M /* E */ + STARTER_M; /* J */
  eq(d.mrr, LIVE, "MRR: monthly + yearly/12, active + past_due + grace, owner excluded");
  eq(d.arr, LIVE * 12, "ARR = 12 × MRR");
  eq(d.paying, 5, "paying companies");
  eq(d.arpu, Math.round(LIVE / 5), "ARPU");
  eq(d.totalCompanies, 10, "owner not counted");
  eq(d.counts, { trialing: 2, active: 3, past_due: 1, grace: 1, suspended: 2, canceled: 1 }, "effective status counts (expired trial/grace → suspended, implicit trial)");
  eq(
    d.planMix.map((p) => [p.planId, p.companies, p.mrr]),
    [
      ["starter", 3, STARTER_M * 3],
      ["growth", 1, GROWTH_M],
      ["business", 1, BUSINESS_Y],
    ],
    "plan mix in catalogue order",
  );
  eq(Math.abs(d.planMix.reduce((a, p) => a + p.share, 0) - 1) < 1e-9, true, "shares sum to 1");

  const m = Object.fromEntries(d.months.map((r) => [r.key, r]));
  eq(d.months.length, 12, "12-month series");
  eq([m["2026-03"].new, m["2026-04"].new, m["2026-05"].new, m["2026-06"].new], [GROWTH_M, STARTER_M, GROWTH_M, GROWTH_M], "new MRR by month");
  eq([m["2026-07"].new, m["2026-07"].contraction, m["2026-07"].net], [STARTER_M, GROWTH_M - STARTER_M, STARTER_M - (GROWTH_M - STARTER_M)], "July: new J, contraction E");
  eq([m["2026-08"].expansion, m["2026-08"].churn, m["2026-08"].net], [BUSINESS_Y - GROWTH_M, STARTER_M, BUSINESS_Y - GROWTH_M - STARTER_M], "August: expansion B, churn C");
  eq([m["2026-09"].new, m["2026-09"].expansion, m["2026-09"].contraction, m["2026-09"].churn], [0, 0, 0, 0], "September: past_due/grace are not movements");
  const augStart = GROWTH_M /* A */ + GROWTH_M /* B */ + STARTER_M /* C */ + STARTER_M /* E */ + STARTER_M /* D untracked */ + STARTER_M; /* J */
  eq([m["2026-08"].startMrr, m["2026-08"].payingAtStart, m["2026-08"].churnedLogos], [augStart, 6, 1], "August opening");
  eq(m["2026-08"].logoChurnRate, 1 / 6, "logo churn");
  eq(m["2026-08"].mrrChurnRate, STARTER_M / augStart, "MRR churn");
  eq(m["2026-08"].mrr, LIVE, "August closing MRR = today's (no September movements)");
  eq(m["2026-09"].mrr, LIVE, "current month = live MRR");
  eq([m["2025-10"].mrr, m["2025-10"].logoChurnRate], [0, null], "before any revenue");
  eq(m["2026-06"].mrr, GROWTH_M * 3 + STARTER_M, "June closing: A, B, C, E");
  eq([m["2026-08"].collected, m["2026-08"].invoices, m["2026-08"].collectedTax], [353_882 + 9_438_820, 2, 53_982 + 1_439_820], "collected: paid INR only, owner excluded");
  eq([m["2026-09"].collected, m["2026-09"].invoices], [100_000, 1], "collected: bucketed by IST month");
  eq(d.history, { hasEvents: true, untrackedPaying: 1 }, "D has no history");

  eq(
    [d.trialConversion.source, d.trialConversion.started, d.trialConversion.converted, d.trialConversion.open, d.trialConversion.rate],
    ["events", 3, 1, 1, 0.5],
    "trial conversion from events (A's trial is outside 90 days)",
  );
  eq(
    d.atRisk.map((r) => [r.companyId, r.status, r.mrr]),
    [
      ["E", "grace", STARTER_M],
      ["D", "past_due", STARTER_M],
      ["F", "trialing", GROWTH_M],
    ],
    "at risk: grace, past due, trial ending in 7 days (not H, 12 days left)",
  );
  eq(d.atRisk[0].deadline, later(2).toISOString(), "grace deadline");

  // ── recordSubscriptionEvent ──
  eq(await recordSubscriptionEvent({ companyId: "owner", type: "activated", planId: "growth" }), null, "owner: no-op");
  eq(await recordSubscriptionEvent({ companyId: "nope", type: "activated", planId: "growth" }), null, "unknown company: no-op");
  const yearly = await recordSubscriptionEvent({ companyId: "B", type: "plan_changed", planId: "business", interval: "yearly", at: later(-1) });
  eq(yearly?.mrr, BUSINESS_Y, "derived MRR: yearly / 12");
  eq((await recordSubscriptionEvent({ companyId: "F", type: "plan_changed", planId: "business", at: later(-1) }))?.mrr, 0, "plan change during a trial pays nothing");
  eq((await recordSubscriptionEvent({ companyId: "C", type: "canceled", planId: "starter", at: later(-1) }))?.mrr, 0, "canceled = 0");
  const first = await recordSubscriptionEvent({ companyId: "A", type: "past_due", planId: "growth", key: "evt_1", at: later(-1) });
  eq(first?.mrr, GROWTH_M, "past_due keeps MRR");
  eq(await recordSubscriptionEvent({ companyId: "A", type: "past_due", planId: "growth", key: "evt_1" }), null, "duplicate key ignored");
  eq(await events.countDocuments({ companyId: "A", type: "past_due" }), 1, "one row for the keyed event");

  console.log(`revenue metrics: all ${checks} checks passed`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    const c = await clientPromise;
    if (/test/.test(c.db().databaseName)) await c.db().dropDatabase();
    await c.close();
  });
