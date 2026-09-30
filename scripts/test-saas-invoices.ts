/**
 * SaaS invoice checks (numbering + FY rollover, idempotency, GST split,
 * GSTIN validation, PDF) against a throwaway database dropped at the end.
 *
 *   EMAIL_PROVIDER=console MONGODB_URI=mongodb://127.0.0.1:27099/p2d_test_$(date +%s) \
 *     npx --yes tsx --require ./scripts/lib/next-server-shims.cjs scripts/test-saas-invoices.ts
 */
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { clientPromise, getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { getCompanyDetails, updateCompanyDetails } from "@/lib/hrms/company";
import { financialYear, getSaasInvoice, issueSaasInvoice, listCompanySaasInvoices, listSaasInvoices } from "@/lib/platform/billing/invoices";
import { gstStateCode, gstinError, isValidGstin, splitGstInclusive, stateCodeFromGstin } from "@/lib/platform/billing/gst";

/** Builds a checksum-valid GSTIN for a state + PAN. */
function makeGstin(state: string, pan: string): string {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const body = `${state}${pan}1Z`;
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const p = chars.indexOf(body[i]) * (i % 2 === 0 ? 1 : 2);
    sum += Math.floor(p / 36) + (p % 36);
  }
  return body + chars[(36 - (sum % 36)) % 36];
}

async function main() {
  const db = await getPlatformDb();
  if (!/test/.test(db.databaseName)) throw new Error(`Refusing to run against "${db.databaseName}"`);

  // ── GSTIN validation / state resolution ──
  assert.equal(isValidGstin("27AAPFU0939F1ZV"), true, "well-known valid GSTIN");
  assert.ok(gstinError("27AAPFU0939F1ZX"), "bad check char rejected");
  assert.ok(gstinError("27AAPFU0939F1Z"), "14 chars rejected");
  assert.ok(gstinError("00AAPFU0939F1ZV"), "unknown state code rejected");
  assert.ok(gstinError("27aapfu0939f1zv") === null, "lowercase is normalised");
  assert.equal(stateCodeFromGstin("27AAPFU0939F1ZV"), "27");
  assert.equal(gstStateCode("Uttar Pradesh"), "09");
  assert.equal(gstStateCode("orissa"), "21");
  assert.equal(gstStateCode("9"), "09");
  assert.equal(gstStateCode("Atlantis"), null);

  // ── GST split sums exactly ──
  for (const total of [1, 99, 100, 117_882, 999_000, 1_178_820, 353_882, 12_345_677]) {
    const intra = splitGstInclusive(total, "09", "09");
    assert.equal(intra.supplyType, "intra");
    assert.equal(intra.taxable + intra.cgst + intra.sgst + intra.igst, total, `intra sums for ${total}`);
    assert.ok(Math.abs(intra.cgst - intra.sgst) <= 1);
    const inter = splitGstInclusive(total, "09", "27");
    assert.equal(inter.supplyType, "inter");
    assert.equal(inter.cgst + inter.sgst, 0);
    assert.equal(inter.taxable + inter.igst, total, `inter sums for ${total}`);
  }
  assert.equal(splitGstInclusive(117_882, "09", null).supplyType, "inter", "unknown buyer state → IGST");
  assert.deepEqual(
    { t: splitGstInclusive(118_000, "09", "09").taxable, c: splitGstInclusive(118_000, "09", "09").cgst },
    { t: 100_000, c: 9_000 },
    "₹1,180 → ₹1,000 + 90 + 90",
  );

  // ── FY ──
  assert.equal(financialYear(new Date("2026-03-31T18:29:59Z")), "2025-26", "31 Mar 23:59 IST");
  assert.equal(financialYear(new Date("2026-03-31T18:30:00Z")), "2026-27", "1 Apr 00:00 IST");

  // ── Companies ──
  const now = new Date();
  const owner = randomUUID();
  const intra = randomUUID();
  const inter = randomUUID();
  const fallback = randomUUID();
  const sellerGstin = makeGstin("09", "AAACY1234A");
  const buyerGstin = makeGstin("27", "AABCB5678C");
  assert.ok(isValidGstin(sellerGstin) && isValidGstin(buyerGstin));
  const sub = (billingDetails: unknown) => ({ planId: "growth", status: "active", interval: "monthly", billingDetails, updatedAt: now });
  await db.collection("companies").insertMany([
    { _id: owner as never, slug: "owner", name: "Owner", status: "active", isPlatformOwner: true, createdAt: now, updatedAt: now },
    { _id: intra as never, slug: "intra", name: "Intra Co", status: "active", isPlatformOwner: false, createdAt: now, updatedAt: now, subscription: sub({ legalName: "Intra Co Pvt Ltd", gstin: null, address: "1 MG Road, Lucknow", state: "Uttar Pradesh", email: "billing@intra.test" }) },
    { _id: inter as never, slug: "inter", name: "Inter Co", status: "active", isPlatformOwner: false, createdAt: now, updatedAt: now, subscription: sub({ legalName: "Inter Co LLP", gstin: buyerGstin, address: "Pune", state: "Karnataka", email: "billing@inter.test" }) },
    { _id: fallback as never, slug: "fallback", name: "Fallback Co", status: "active", isPlatformOwner: false, createdAt: now, updatedAt: now },
  ]);
  await db.collection("admin_users").insertOne({ companyId: fallback, email: "boss@fallback.test", roles: ["super_admin"], createdAt: now });
  await runAsCompany(owner, async () => {
    const d = await getCompanyDetails();
    await updateCompanyDetails({ ...d, legalName: "YashOrbit Technologies Pvt Ltd", gstin: sellerGstin, state: "Uttar Pradesh" }, "test");
  });

  const base = { planId: "growth", interval: "monthly" as const, periodStart: new Date("2026-10-01T00:00:00+05:30"), periodEnd: new Date("2026-10-31T23:59:59+05:30"), currency: "INR" };
  const fy = financialYear(new Date());

  // ── Numbering + idempotency ──
  const r1 = await issueSaasInvoice({ ...base, companyId: intra, amount: 353_882, paymentRef: "pay_1" });
  assert.equal(r1?.number, `SAAS/${fy}/000001`);
  const again = await issueSaasInvoice({ ...base, companyId: intra, amount: 353_882, paymentRef: "pay_1" });
  assert.deepEqual(again, r1, "same paymentRef → same invoice");
  const racers = await Promise.all(Array.from({ length: 5 }, () => issueSaasInvoice({ ...base, companyId: inter, amount: 353_882, paymentRef: "pay_race" })));
  assert.equal(new Set(racers.map((r) => r?.number)).size, 1, "concurrent duplicates → one invoice");
  assert.equal(racers[0]?.number, `SAAS/${fy}/000002`, "no number burnt by the race");
  const parallel = await Promise.all(Array.from({ length: 6 }, (_, i) => issueSaasInvoice({ ...base, companyId: intra, amount: 99_900 + i, paymentRef: `pay_p${i}` })));
  const seqs = parallel.map((r) => Number(r!.number.split("/")[2])).sort((a, b) => a - b);
  assert.deepEqual(seqs, [3, 4, 5, 6, 7, 8], "concurrent distinct payments → gap-free sequence");
  assert.equal(await db.collection("saas_invoices").countDocuments({ paymentRef: "pay_race" }), 1);

  // ── FY rollover ──
  const lastFy = await issueSaasInvoice({ ...base, companyId: intra, amount: 1000, paymentRef: "pay_old", issuedAt: new Date("2026-03-31T18:00:00Z") });
  assert.equal(lastFy?.number, "SAAS/2025-26/000001", "previous FY has its own sequence");
  const nextFy = await issueSaasInvoice({ ...base, companyId: intra, amount: 1000, paymentRef: "pay_new", issuedAt: new Date("2027-04-01T00:00:00+05:30") });
  assert.equal(nextFy?.number, "SAAS/2027-28/000001");

  // ── Tax split on stored invoices ──
  const i1 = (await getSaasInvoice(r1!.id))!;
  assert.equal(i1.supplyType, "intra", "UP seller → UP buyer");
  assert.equal(i1.taxable + i1.cgst + i1.sgst, 353_882);
  assert.equal(i1.igst, 0);
  assert.equal(i1.seller.gstin, sellerGstin);
  assert.equal(i1.items[0].sac, "998314");
  assert.match(i1.items[0].description, /^Growth plan — Monthly — 1 Oct 2026 to 31 Oct 2026$/);
  assert.ok(i1.emailedAt, "buyer emailed");
  const i2 = (await getSaasInvoice(racers[0]!.id))!;
  assert.equal(i2.supplyType, "inter");
  assert.equal(i2.buyer.stateCode, "27", "GSTIN state wins over the typed state");
  assert.equal(i2.taxable + i2.igst, 353_882);

  const fb = await issueSaasInvoice({ ...base, companyId: fallback, amount: 117_882, paymentRef: "pay_fb" });
  const i3 = (await getSaasInvoice(fb!.id))!;
  assert.equal(i3.buyer.email, "boss@fallback.test", "fallback to owner email");
  assert.equal(i3.buyer.legalName, "Fallback Co");
  assert.equal(i3.supplyType, "inter", "no buyer state → IGST");

  assert.equal(await issueSaasInvoice({ ...base, companyId: owner, amount: 1000, paymentRef: "pay_owner" }), null, "owner never invoiced");
  assert.equal(await issueSaasInvoice({ ...base, companyId: randomUUID(), amount: 1000, paymentRef: "pay_ghost" }), null);

  // ── Reads ──
  assert.equal((await listCompanySaasInvoices(inter)).length, 1, "company sees only its own");
  assert.equal((await listSaasInvoices({ q: "Inter Co" })).total, 1);
  assert.equal((await listSaasInvoices({ month: "2026-03" })).total, 1);
  const all = await listSaasInvoices();
  assert.equal(all.total, 12);
  assert.equal(all.totals.taxable + all.totals.tax, all.totals.total);

  // ── PDF ──
  try {
    const { renderSaasInvoicePdf } = await import("@/components/platform/billing/SaasInvoicePdf");
    for (const inv of [i1, i2]) {
      const pdf = await renderSaasInvoicePdf(inv);
      assert.equal(pdf.subarray(0, 5).toString(), "%PDF-", "PDF renders");
    }
    console.log("  pdf: rendered intra + inter invoices");
  } catch (err) {
    console.warn("  pdf: NOT verified under tsx —", err instanceof Error ? err.message.split("\n")[0] : err);
    process.exitCode = 2;
  }
  console.log("saas invoices: all data-layer checks passed");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    const c = await clientPromise;
    await c.db().dropDatabase();
    await c.close();
  });
