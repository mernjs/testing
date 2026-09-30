"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Download, ReceiptText } from "lucide-react";
import AdminDataGrid, { type AdminDataGridColumn } from "@/components/admin/data-grid/AdminDataGrid";

/** Pre-formatted on the server (IST dates, money strings) so server and client render identically. */
export interface ConsoleInvoiceRow {
  id: string;
  number: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  buyerGstin: string | null;
  date: string;
  plan: string;
  taxable: string;
  tax: string;
  taxSplit: string;
  total: string;
}

const columns: AdminDataGridColumn<ConsoleInvoiceRow>[] = [
  { key: "number", label: "Invoice", render: (row) => <span className="font-medium text-foreground">{row.number}</span> },
  {
    key: "company",
    label: "Company",
    render: (row) => (
      <Link href={`/console/companies/${row.companyId}`} className="block hover:underline">
        <span className="font-medium text-foreground">{row.companyName}</span>
        <span className="block text-xs">{row.buyerGstin ?? "Unregistered"}</span>
      </Link>
    ),
  },
  { key: "date", label: "Date", render: (row) => row.date },
  { key: "plan", label: "Plan", render: (row) => <span className="text-xs">{row.plan}</span> },
  { key: "taxable", label: "Taxable", cellClassName: "tabular-nums", render: (row) => row.taxable },
  {
    key: "tax",
    label: "GST",
    cellClassName: "tabular-nums",
    render: (row) => (
      <>
        {row.tax}
        <span className="block text-xs">{row.taxSplit}</span>
      </>
    ),
  },
  { key: "total", label: "Total", cellClassName: "tabular-nums font-medium text-foreground", render: (row) => row.total },
];

export default function InvoicesGrid({
  rows,
  total,
  page,
  totalPages,
  filters,
  hasActiveFilters,
  subtitle,
}: {
  rows: ConsoleInvoiceRow[];
  total: number;
  page: number;
  totalPages: number;
  filters: ReactNode;
  hasActiveFilters: boolean;
  subtitle: string;
}) {
  return (
    <AdminDataGrid
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      total={total}
      page={page}
      totalPages={totalPages}
      emptyLabel="No invoices match these filters."
      filters={filters}
      filterTitle="SaaS invoices"
      filterSubtitle={subtitle}
      filterIcon={ReceiptText}
      hasActiveFilters={hasActiveFilters}
      rowActions={(row) => (
        <a href={`/api/platform/billing/invoices/${row.id}/pdf`} target="_blank" rel="noreferrer" aria-label={`Download ${row.number}`} className="text-muted-foreground hover:text-foreground">
          <Download className="size-4" />
        </a>
      )}
    />
  );
}
