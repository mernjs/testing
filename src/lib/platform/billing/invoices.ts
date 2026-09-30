import "server-only";
import { randomUUID } from "node:crypto";
import type { Collection } from "mongodb";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { COMPANIES_COLLECTION, getCompany, getPlatformOwnerCompanyId, type Company } from "@/lib/platform/tenancy/companies";
import { companyBaseUrl } from "@/lib/platform/tenancy/provisioning";
import { getCompanyDetails, type CompanyDetails } from "@/lib/hrms/company";
import { getPlan } from "@/lib/platform/billing/plans";
import { formatMoney, type BillingInterval, type CompanySubscription } from "@/lib/platform/billing/types";
import { SAAS_SAC_CODE, isValidGstin, normalizeGstin, resolveGstState, splitGstInclusive, type SupplyType } from "@/lib/platform/billing/gst";
import { sendEmail } from "@/lib/platform/email";
import { renderEmail } from "@/lib/platform/email/template";

/**
 * SaaS invoices the platform issues to its customer companies (platform-level
 * `saas_invoices`). The subscriptions workstream calls `issueSaasInvoice` on
 * every successful charge; it is idempotent on `paymentRef`.
 *
 * Each invoice is a tax invoice-cum-receipt: it is only ever issued for a
 * payment already received, so it is born `paid`. Seller (the platform owner)
 * and buyer details are snapshotted at issue time — later edits to either
 * company's details never change an issued invoice.
 *
 * Numbering: `SAAS/<FY>/<seq>` (e.g. `SAAS/2026-27/000001`), sequential per
 * Indian financial year (April–March, IST), from an atomic counter in
 * `platform_settings`. A number is only drawn after the invoice document has
 * won the unique `paymentRef` insert, so concurrent/retried webhooks for the
 * same payment never burn a number.
 */

export const SAAS_INVOICES_COLLECTION = "saas_invoices";
const COUNTERS_COLLECTION = "platform_settings";
const IST_OFFSET_MS = 330 * 60_000;

export interface IssueSaasInvoiceInput {
  companyId: string;
  planId: string;
  interval: "monthly" | "yearly";
  periodStart: Date;
  periodEnd: Date;
  /** Amount charged, smallest currency unit, tax-inclusive. */
  amount: number;
  currency: string;
  /** Provider payment id — the idempotency key. */
  paymentRef: string;
  /** Invoice/payment date; defaults to now. Decides the financial year of the number. */
  issuedAt?: Date;
}

export interface SaasInvoiceRef {
  id: string;
  number: string;
}

export interface SaasInvoiceParty {
  name: string;
  legalName: string;
  address: string;
  gstin: string | null;
  pan: string | null;
  state: string | null;
  stateCode: string | null;
  email: string | null;
  phone: string | null;
}

export interface SaasInvoiceItem {
  description: string;
  sac: string;
  quantity: number;
  /** Taxable value of the line (paise). */
  taxable: number;
}

export interface SaasInvoice {
  _id: string;
  companyId: string;
  /** Null only in the instant between winning the insert and drawing a number. */
  number: string | null;
  financialYear: string;
  status: "paid";
  paymentRef: string;
  planId: string;
  planName: string;
  interval: BillingInterval;
  periodStart: Date;
  periodEnd: Date;
  currency: string;
  seller: SaasInvoiceParty;
  buyer: SaasInvoiceParty;
  placeOfSupply: { code: string; name: string } | null;
  supplyType: SupplyType;
  taxRate: number;
  items: SaasInvoiceItem[];
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  taxTotal: number;
  total: number;
  issuedAt: Date;
  paidAt: Date;
  emailedAt: Date | null;
  createdAt: Date;
}

let indexesReady: Promise<unknown> | null = null;
async function invoices(): Promise<Collection<SaasInvoice>> {
  const col = (await getPlatformDb()).collection<SaasInvoice>(SAAS_INVOICES_COLLECTION);
  indexesReady ??= Promise.all([
    col.createIndex({ paymentRef: 1 }, { unique: true }),
    col.createIndex({ number: 1 }, { unique: true, partialFilterExpression: { number: { $type: "string" } } }),
    col.createIndex({ companyId: 1, issuedAt: -1 }),
    col.createIndex({ issuedAt: -1 }),
  ]).catch((err) => {
    indexesReady = null;
    throw err;
  });
  await indexesReady;
  return col;
}

/** Indian financial year of a moment, in IST: "2026-27" for 1 Apr 2026 – 31 Mar 2027. */
export function financialYear(at: Date): string {
  const ist = new Date(at.getTime() + IST_OFFSET_MS);
  const start = ist.getUTCMonth() >= 3 ? ist.getUTCFullYear() : ist.getUTCFullYear() - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/** Draws the next number in a financial year (atomic; one counter document per FY). */
async function nextInvoiceNumber(fy: string): Promise<string> {
  const counters = (await getPlatformDb()).collection<{ _id: string; seq?: number }>(COUNTERS_COLLECTION);
  const doc = await counters.findOneAndUpdate({ _id: `saas_invoice_seq:${fy}` }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
  return `SAAS/${fy}/${String(doc?.seq ?? 1).padStart(6, "0")}`;
}

function isDuplicateKey(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: number }).code === 11000;
}

function joinAddress(parts: (string | null | undefined)[]): string {
  return parts.map((s) => (s ?? "").trim()).filter(Boolean).join(", ");
}

/** Invoice dates are legal dates in India: always IST, identical wherever rendered. */
export function formatInvoiceDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

async function sellerSnapshot(): Promise<SaasInvoiceParty> {
  const ownerId = await getPlatformOwnerCompanyId();
  if (!ownerId) throw new Error("No platform owner company — can't issue SaaS invoices");
  const c = await runAsCompany(ownerId, () => getCompanyDetails());
  return partyFromDetails(c, null);
}

function partyFromDetails(c: CompanyDetails, fallbackEmail: string | null): SaasInvoiceParty {
  const gstin = isValidGstin(c.gstin) ? normalizeGstin(c.gstin) : null;
  const state = resolveGstState(gstin, c.state);
  return {
    name: c.name || c.legalName,
    legalName: c.legalName || c.name,
    address: joinAddress([c.addressLine1, c.addressLine2, c.city, c.state, c.postalCode, c.country]),
    gstin,
    pan: c.pan?.trim() || (gstin ? gstin.slice(2, 12) : null),
    state: state?.name ?? (c.state?.trim() || null),
    stateCode: state?.code ?? null,
    email: c.email?.trim() || fallbackEmail,
    phone: c.phone?.trim() || null,
  };
}

async function firstSuperAdminEmail(companyId: string): Promise<string | null> {
  const users = (await getPlatformDb()).collection<{ companyId: string; email: string; roles?: string[]; createdAt?: Date }>("admin_users");
  const u = await users.findOne({ companyId, roles: "super_admin" }, { sort: { createdAt: 1, _id: 1 }, projection: { email: 1 } });
  return u?.email ?? null;
}

async function buyerSnapshot(company: Company & { subscription?: CompanySubscription }): Promise<SaasInvoiceParty> {
  const bd = company.subscription?.billingDetails;
  const ownerEmail = await firstSuperAdminEmail(company._id);
  if (bd?.legalName?.trim()) {
    const gstin = isValidGstin(bd.gstin) ? normalizeGstin(bd.gstin) : null;
    if (bd.gstin && !gstin) console.warn(`[saas-invoices] company ${company._id} has an invalid GSTIN on file ("${bd.gstin}"); invoicing as unregistered`);
    const state = resolveGstState(gstin, bd.state);
    return {
      name: company.name,
      legalName: bd.legalName.trim(),
      address: bd.address?.trim() ?? "",
      gstin,
      pan: gstin ? gstin.slice(2, 12) : null,
      state: state?.name ?? (bd.state?.trim() || null),
      stateCode: state?.code ?? null,
      email: bd.email?.trim() || ownerEmail,
      phone: null,
    };
  }
  const details = await runAsCompany(company._id, () => getCompanyDetails());
  return { ...partyFromDetails(details, ownerEmail), name: company.name, email: ownerEmail ?? (details.email?.trim() || null) };
}

/** "Growth plan — Monthly — 1 Oct 2026 to 31 Oct 2026" */
export function saasLineDescription(planName: string, interval: BillingInterval, periodStart: Date, periodEnd: Date): string {
  return `${planName} plan — ${interval === "yearly" ? "Yearly" : "Monthly"} — ${formatInvoiceDate(periodStart)} to ${formatInvoiceDate(periodEnd)}`;
}

async function emailInvoice(inv: SaasInvoice, slug: string): Promise<void> {
  if (!inv.buyer.email || !inv.number) return;
  const url = `${companyBaseUrl(slug)}/settings/billing/invoices`;
  const { html, text } = renderEmail({
    brand: inv.seller.name,
    heading: `Invoice ${inv.number}`,
    paragraphs: [
      `Thank you — we've received your payment of ${formatMoney(inv.total, inv.currency)} for the ${inv.planName} plan (${formatInvoiceDate(inv.periodStart)} to ${formatInvoiceDate(inv.periodEnd)}).`,
      `Your GST tax invoice-cum-receipt ${inv.number} is ready to download from your billing settings.`,
    ],
    action: { label: "View invoices", url },
    footnote: `Payment reference: ${inv.paymentRef}`,
  });
  const res = await sendEmail({ to: inv.buyer.email, subject: `Invoice ${inv.number} — ${inv.seller.name}`, html, text });
  if (res.ok) await (await invoices()).updateOne({ _id: inv._id }, { $set: { emailedAt: new Date() } });
}

/**
 * Issues the tax invoice-cum-receipt for one successful payment. Idempotent on
 * `paymentRef`: calling it again (webhook retries, duplicate events, races)
 * returns the invoice already issued and sends nothing. Returns null when the
 * company doesn't exist or is the platform owner (never billed).
 */
export async function issueSaasInvoice(input: IssueSaasInvoiceInput): Promise<SaasInvoiceRef | null> {
  const paymentRef = String(input.paymentRef ?? "").trim();
  if (!paymentRef) throw new Error("issueSaasInvoice: paymentRef is required");
  if (!Number.isInteger(input.amount) || input.amount <= 0) throw new Error(`issueSaasInvoice: amount must be a positive integer (got ${input.amount})`);
  const col = await invoices();

  const existing = await col.findOne({ paymentRef });
  if (existing?.number) return { id: existing._id, number: existing.number };

  let inv: SaasInvoice;
  let company: (Company & { subscription?: CompanySubscription }) | null;
  if (existing) {
    // A previous call won the insert but died before drawing a number — finish it.
    inv = existing;
    company = await getCompany(existing.companyId);
  } else {
    company = await (await getPlatformDb()).collection<Company & { subscription?: CompanySubscription }>(COMPANIES_COLLECTION).findOne({ _id: input.companyId });
    if (!company || company.isPlatformOwner) return null;
    const [seller, buyer, plan] = await Promise.all([sellerSnapshot(), buyerSnapshot(company), getPlan(input.planId)]);
    const gst = splitGstInclusive(input.amount, seller.stateCode, buyer.stateCode);
    const issuedAt = input.issuedAt ?? new Date();
    const planName = plan?.name ?? input.planId;
    inv = {
      _id: randomUUID(),
      companyId: company._id,
      number: null,
      financialYear: financialYear(issuedAt),
      status: "paid",
      paymentRef,
      planId: input.planId,
      planName,
      interval: input.interval,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      currency: input.currency || "INR",
      seller,
      buyer,
      placeOfSupply: buyer.stateCode ? { code: buyer.stateCode, name: buyer.state ?? "" } : null,
      supplyType: gst.supplyType,
      taxRate: gst.rate,
      items: [{ description: saasLineDescription(planName, input.interval, input.periodStart, input.periodEnd), sac: SAAS_SAC_CODE, quantity: 1, taxable: gst.taxable }],
      taxable: gst.taxable,
      cgst: gst.cgst,
      sgst: gst.sgst,
      igst: gst.igst,
      taxTotal: gst.tax,
      total: gst.total,
      issuedAt,
      paidAt: issuedAt,
      emailedAt: null,
      createdAt: new Date(),
    };
    try {
      await col.insertOne(inv);
    } catch (err) {
      if (!isDuplicateKey(err)) throw err;
      // Lost a race for this payment: the winner numbers and emails it.
      const winner = await col.findOne({ paymentRef });
      if (winner?.number) return { id: winner._id, number: winner.number };
      if (!winner) throw err;
      inv = winner;
    }
  }

  // Only the insert winner (or a retry finishing its work) gets here; the
  // conditional update makes sure a number is attached at most once.
  const number = await nextInvoiceNumber(inv.financialYear);
  const numbered = await col.findOneAndUpdate({ _id: inv._id, number: null }, { $set: { number } }, { returnDocument: "after" });
  if (!numbered) {
    const current = await col.findOne({ _id: inv._id });
    console.error(`[saas-invoices] number ${number} drawn but invoice ${inv._id} was numbered concurrently — sequence has a gap`);
    return current?.number ? { id: current._id, number: current.number } : null;
  }
  if (company) await emailInvoice(numbered, company.slug).catch((err) => console.error("[saas-invoices] email failed", err));
  return { id: numbered._id, number };
}

/* ─────────────────────────── Reads ─────────────────────────── */

export async function getSaasInvoice(id: string): Promise<SaasInvoice | null> {
  if (typeof id !== "string" || !id || id.length > 64) return null;
  return (await invoices()).findOne({ _id: id, number: { $type: "string" } });
}

/** A company's invoices, newest first. */
export async function listCompanySaasInvoices(companyId: string): Promise<SaasInvoice[]> {
  return (await invoices()).find({ companyId, number: { $type: "string" } }).sort({ issuedAt: -1, _id: -1 }).limit(500).toArray();
}

export interface SaasInvoiceFilter {
  /** Invoice number, payment ref, or company name/slug (substring, case-insensitive). */
  q?: string;
  /** "yyyy-mm" (IST calendar month of the invoice date). */
  month?: string;
  companyId?: string;
}

export interface SaasInvoiceRow extends SaasInvoice {
  companyName: string;
  companySlug: string;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** IST calendar month → [start, end) in UTC; null for a malformed month. */
export function istMonthRange(month: string): { start: Date; end: Date } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  if (mo < 1 || mo > 12) return null;
  return { start: new Date(Date.UTC(y, mo - 1, 1) - IST_OFFSET_MS), end: new Date(Date.UTC(y, mo, 1) - IST_OFFSET_MS) };
}

/** Every company's invoices for the console, newest first, with company names. */
export async function listSaasInvoices(filter: SaasInvoiceFilter = {}, opts: { page?: number; pageSize?: number } = {}): Promise<{ rows: SaasInvoiceRow[]; total: number; totals: { taxable: number; tax: number; total: number } }> {
  const db = await getPlatformDb();
  const companies = db.collection<Company>(COMPANIES_COLLECTION);
  const match: Record<string, unknown> = { number: { $type: "string" } };
  if (filter.companyId) match.companyId = filter.companyId;
  const range = filter.month ? istMonthRange(filter.month) : null;
  if (range) match.issuedAt = { $gte: range.start, $lt: range.end };
  const q = filter.q?.trim();
  if (q) {
    const re = new RegExp(escapeRegex(q.slice(0, 100)), "i");
    const companyIds = await companies.distinct("_id", { $or: [{ name: re }, { slug: re }] });
    match.$or = [{ number: re }, { paymentRef: re }, { "buyer.legalName": re }, { companyId: { $in: companyIds } }];
  }
  const col = await invoices();
  const pageSize = opts.pageSize ?? 50;
  const page = Math.max(1, opts.page ?? 1);
  const [docs, agg] = await Promise.all([
    col.find(match).sort({ issuedAt: -1, _id: -1 }).skip((page - 1) * pageSize).limit(pageSize).toArray(),
    col.aggregate<{ count: number; taxable: number; tax: number; total: number }>([{ $match: match }, { $group: { _id: null, count: { $sum: 1 }, taxable: { $sum: "$taxable" }, tax: { $sum: "$taxTotal" }, total: { $sum: "$total" } } }]).toArray(),
  ]);
  const names = new Map((await companies.find({ _id: { $in: [...new Set(docs.map((d) => d.companyId))] } }, { projection: { name: 1, slug: 1 } }).toArray()).map((c) => [c._id, c]));
  const a = agg[0];
  return {
    rows: docs.map((d) => ({ ...d, companyName: names.get(d.companyId)?.name ?? d.buyer.name, companySlug: names.get(d.companyId)?.slug ?? "" })),
    total: a?.count ?? 0,
    totals: { taxable: a?.taxable ?? 0, tax: a?.tax ?? 0, total: a?.total ?? 0 },
  };
}
