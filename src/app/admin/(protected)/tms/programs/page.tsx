import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchPrograms } from "@/lib/tms/programs";
import { isValidProgramStatus, isValidProgramCategory } from "@/lib/tms/constants";
import ProgramsFilterBar from "./ProgramsFilterBar";
import ProgramsGrid, { type AdminProgramRow } from "./ProgramsGrid";

export default async function AdminProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string; category?: string; sortBy?: string; sortDir?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const status = sp.status && isValidProgramStatus(sp.status) ? sp.status : undefined;
  const category = sp.category && isValidProgramCategory(sp.category) ? sp.category : undefined;
  const sortBy = sp.sortBy === "fees" || sp.sortBy === "name" ? sp.sortBy : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await searchPrograms({
    page,
    pageSize: 20,
    search: sp.search,
    status,
    category,
    sortBy,
    sortDir,
  });

  const rows: AdminProgramRow[] = items.map((p) => ({
    _id: p._id,
    programCode: p.programCode,
    name: p.name,
    category: p.category,
    mode: p.mode,
    status: p.status,
    durationWeeks: p.durationWeeks,
    fees: p.fees,
  }));

  const hasActiveFilters = Boolean(sp.search || sp.status || sp.category);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "TMS" }, { label: "Programs" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Programs</h1>
        <p className="text-sm text-muted-foreground">{total} program{total === 1 ? "" : "s"}.</p>
      </div>

      <ProgramsGrid
        rows={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        filters={<ProgramsFilterBar initialSearch={sp.search ?? ""} initialStatus={status ?? ""} initialCategory={category ?? ""} />}
      />
    </div>
  );
}
