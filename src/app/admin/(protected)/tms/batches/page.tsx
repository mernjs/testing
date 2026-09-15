import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchBatches } from "@/lib/tms/batches";
import { isValidBatchStatus } from "@/lib/tms/constants";
import BatchesFilterBar from "./BatchesFilterBar";
import BatchesGrid, { type AdminBatchRow } from "./BatchesGrid";

export default async function AdminBatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; sortBy?: string; sortDir?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const status = sp.status && isValidBatchStatus(sp.status) ? sp.status : undefined;
  const sortBy = sp.sortBy === "startDate" || sp.sortBy === "name" ? sp.sortBy : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await searchBatches({
    page,
    pageSize: 20,
    search: sp.search,
    status,
    sortBy,
    sortDir,
  });

  const rows: AdminBatchRow[] = items.map((b) => ({
    _id: b._id,
    batchCode: b.batchCode,
    name: b.name,
    programName: b.programName,
    status: b.status,
    startDate: b.startDate,
    endDate: b.endDate,
    enrolled: b.enrolled,
    capacity: b.capacity,
    availableSeats: b.availableSeats,
  }));

  const hasActiveFilters = Boolean(sp.search || sp.status);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "TMS" }, { label: "Batches" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Batches</h1>
        <p className="text-sm text-muted-foreground">{total} batch{total === 1 ? "" : "es"}.</p>
      </div>

      <BatchesGrid
        rows={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        filters={<BatchesFilterBar initialSearch={sp.search ?? ""} initialStatus={status ?? ""} />}
      />
    </div>
  );
}
