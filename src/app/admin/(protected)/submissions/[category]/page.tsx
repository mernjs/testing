import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import SubmissionsDataTable from "@/components/admin/SubmissionsDataTable";
import ExportButton from "@/components/admin/ExportButton";
import { searchLeads, isValidCategory, getCategoryLabel } from "@/lib/leads";
import { isValidLeadStatus } from "@/lib/lead-status";
import type { SerializedLead } from "@/components/admin/types";

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function SubmissionsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}) {
  const { category } = await params;
  if (!isValidCategory(category)) notFound();

  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const status = sp.status && isValidLeadStatus(sp.status) ? sp.status : undefined;
  const dateFrom = parseDateParam(sp.dateFrom);
  const dateTo = parseDateParam(sp.dateTo, true);
  const sortBy = sp.sortBy === "name" ? "name" : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await searchLeads(category, {
    page,
    pageSize: 20,
    search: sp.search,
    status,
    dateFrom,
    dateTo,
    sortBy,
    sortDir,
  });

  const serializedItems: SerializedLead[] = items.map((lead) => ({
    ...lead,
    _id: String(lead._id),
    createdAt: new Date(lead.createdAt).toISOString(),
    updatedAt: new Date(lead.updatedAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/admin" }, { label: getCategoryLabel(category) }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{getCategoryLabel(category)}</h1>
          <p className="text-sm text-muted-foreground">{total} submission{total === 1 ? "" : "s"}</p>
        </div>
        <ExportButton
          params={{
            category,
            search: sp.search,
            status,
            dateFrom: sp.dateFrom,
            dateTo: sp.dateTo,
            sortBy,
            sortDir,
          }}
        />
      </div>

      <SubmissionsDataTable
        category={category}
        items={serializedItems}
        total={total}
        page={page}
        totalPages={totalPages}
        initialSearch={sp.search ?? ""}
        initialStatus={status ?? ""}
        initialDateFrom={sp.dateFrom ?? ""}
        initialDateTo={sp.dateTo ?? ""}
        initialSortBy={sortBy}
        initialSortDir={sortDir}
      />
    </div>
  );
}
