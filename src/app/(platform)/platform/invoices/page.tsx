import type { Metadata } from "next";
import { FileDown, IndianRupee, Landmark, ReceiptText } from "lucide-react";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { countAwaitingApproval } from "@/lib/platform/signup";
import { formatInvoiceDate, istMonthRange, listSaasInvoices, type SaasInvoiceRow } from "@/lib/platform/billing/invoices";
import { formatMoney } from "@/lib/platform/billing/types";
import ConsoleNav from "../ConsoleNav";
import InvoicesFilterBar from "./InvoicesFilterBar";
import InvoicesGrid, { type ConsoleInvoiceRow } from "./InvoicesGrid";

export const metadata: Metadata = { title: "SaaS invoices", robots: { index: false, follow: false } };

const PAGE_SIZE = 50;

function toRow(inv: SaasInvoiceRow): ConsoleInvoiceRow {
  const m = (n: number) => formatMoney(n, inv.currency);
  return {
    id: inv._id,
    number: inv.number ?? "",
    companyId: inv.companyId,
    companyName: inv.companyName,
    companySlug: inv.companySlug,
    buyerGstin: inv.buyer.gstin,
    date: formatInvoiceDate(inv.issuedAt),
    plan: `${inv.planName} · ${inv.interval === "yearly" ? "Yearly" : "Monthly"}`,
    taxable: m(inv.taxable),
    tax: m(inv.taxTotal),
    taxSplit: inv.supplyType === "intra" ? `CGST ${m(inv.cgst)} + SGST ${m(inv.sgst)}` : "IGST",
    total: m(inv.total),
  };
}

export default async function ConsoleInvoicesPage({ searchParams }: { searchParams: Promise<{ q?: string; month?: string; company?: string; page?: string }> }) {
  await requirePlatformAdmin();
  const sp = await searchParams;
  const month = sp.month && istMonthRange(sp.month) ? sp.month : "";
  const filter = { q: sp.q, month: month || undefined, companyId: sp.company || undefined };
  const page = Math.max(1, Number(sp.page) || 1);
  const [list, pending] = await Promise.all([listSaasInvoices(filter, { page, pageSize: PAGE_SIZE }), countAwaitingApproval()]);
  const exportParams = new URLSearchParams(Object.entries({ q: sp.q ?? "", month, company: sp.company ?? "" }).filter(([, v]) => v));

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <ConsoleNav active="invoices" pendingApprovals={pending} />
        <KpiGrid cols={4}>
          <KpiCard label="Invoices" value={list.total} icon={<ReceiptText className="size-4" />} />
          <KpiCard label="Taxable value" value={formatMoney(list.totals.taxable)} icon={<Landmark className="size-4" />} />
          <KpiCard label="GST collected" value={formatMoney(list.totals.tax)} icon={<IndianRupee className="size-4" />} />
          <KpiCard label="Total invoiced" value={formatMoney(list.totals.total)} icon={<IndianRupee className="size-4" />} />
        </KpiGrid>
        <div className="flex justify-end">
          <a
            href={`/console/invoices/export${exportParams.size ? `?${exportParams}` : ""}`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <FileDown className="size-4" /> Export CSV
          </a>
        </div>
        <InvoicesGrid
          rows={list.rows.map(toRow)}
          total={list.total}
          page={page}
          totalPages={Math.max(1, Math.ceil(list.total / PAGE_SIZE))}
          hasActiveFilters={Boolean(sp.q || month || sp.company)}
          subtitle={`${list.total} invoice${list.total === 1 ? "" : "s"}`}
          filters={<InvoicesFilterBar initialSearch={sp.q ?? ""} initialMonth={month} />}
        />
      </div>
    </div>
  );
}
