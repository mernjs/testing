import { NextRequest, NextResponse } from "next/server";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { isPlatformOwnerContext } from "@/lib/platform/tenancy/context";
import { formatInvoiceDate, istMonthRange, listSaasInvoices, type SaasInvoiceRow } from "@/lib/platform/billing/invoices";
import { toCsv, type CsvColumn } from "@/lib/csv";

const rupees = (paise: number) => (paise / 100).toFixed(2);

const COLUMNS: CsvColumn<SaasInvoiceRow>[] = [
  { header: "Invoice number", value: (r) => r.number },
  { header: "Invoice date", value: (r) => formatInvoiceDate(r.issuedAt) },
  { header: "Company", value: (r) => r.companyName },
  { header: "Company slug", value: (r) => r.companySlug },
  { header: "Buyer legal name", value: (r) => r.buyer.legalName },
  { header: "Buyer GSTIN", value: (r) => r.buyer.gstin ?? "" },
  { header: "Place of supply", value: (r) => (r.placeOfSupply ? `${r.placeOfSupply.code}-${r.placeOfSupply.name}` : "") },
  { header: "Supply type", value: (r) => (r.supplyType === "intra" ? "Intra-state" : "Inter-state") },
  { header: "Plan", value: (r) => r.planName },
  { header: "Interval", value: (r) => r.interval },
  { header: "Period start", value: (r) => formatInvoiceDate(r.periodStart) },
  { header: "Period end", value: (r) => formatInvoiceDate(r.periodEnd) },
  { header: "SAC", value: (r) => r.items[0]?.sac ?? "" },
  { header: "Currency", value: (r) => r.currency },
  { header: "Taxable value", value: (r) => rupees(r.taxable) },
  { header: "CGST", value: (r) => rupees(r.cgst) },
  { header: "SGST", value: (r) => rupees(r.sgst) },
  { header: "IGST", value: (r) => rupees(r.igst) },
  { header: "Total tax", value: (r) => rupees(r.taxTotal) },
  { header: "Invoice total", value: (r) => rupees(r.total) },
  { header: "Payment ref", value: (r) => r.paymentRef },
];

/** CSV of every SaaS invoice matching the console filters. Platform owner's Super Admins only. */
export async function GET(req: NextRequest) {
  if (!(await isPlatformOwnerContext())) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const user = await getCurrentHubUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.roles.includes("super_admin")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sp = req.nextUrl.searchParams;
  const month = sp.get("month") ?? "";
  const { rows } = await listSaasInvoices(
    { q: sp.get("q") ?? undefined, month: istMonthRange(month) ? month : undefined, companyId: sp.get("company") ?? undefined },
    { pageSize: 50_000 },
  );
  const csv = toCsv([...rows].reverse(), COLUMNS);
  return new NextResponse(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="saas-invoices${month ? `-${month}` : ""}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
