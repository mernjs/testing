import Breadcrumbs from "@/components/admin/Breadcrumbs";
import CareerApplicationsDataTable from "@/components/admin/CareerApplicationsDataTable";
import CareersExportButton from "@/components/admin/CareersExportButton";
import { searchApplications, getAllJobPositions } from "@/lib/career-applications";
import { isValidCareerApplicationStatus } from "@/lib/career-application-status";
import type { SerializedCareerApplication } from "@/components/admin/types";

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function ApplicantsListPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    position?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const status = sp.status && isValidCareerApplicationStatus(sp.status) ? sp.status : undefined;
  const dateFrom = parseDateParam(sp.dateFrom);
  const dateTo = parseDateParam(sp.dateTo, true);
  const sortBy = sp.sortBy === "name" ? "name" : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const [{ items, total, totalPages }, positions] = await Promise.all([
    searchApplications({
      page,
      pageSize: 20,
      search: sp.search,
      status,
      positionSlug: sp.position,
      dateFrom,
      dateTo,
      sortBy,
      sortDir,
    }),
    getAllJobPositions(),
  ]);

  const serializedItems: SerializedCareerApplication[] = items.map((application) => ({
    _id: String(application._id),
    positionSlug: application.positionSlug,
    positionTitle: application.positionTitle,
    name: application.name,
    email: application.email,
    phone: application.phone,
    coverNote: application.coverNote,
    status: application.status,
    notes: application.notes,
    resume: application.resume,
    source: application.source,
    createdAt: new Date(application.createdAt).toISOString(),
    updatedAt: new Date(application.updatedAt).toISOString(),
  }));

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/admin" }, { label: "Applicants" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Applicants</h1>
          <p className="text-sm text-muted-foreground">{total} application{total === 1 ? "" : "s"}</p>
        </div>
        <CareersExportButton
          params={{
            search: sp.search,
            status,
            position: sp.position,
            dateFrom: sp.dateFrom,
            dateTo: sp.dateTo,
            sortBy,
            sortDir,
          }}
        />
      </div>

      <CareerApplicationsDataTable
        items={serializedItems}
        total={total}
        page={page}
        totalPages={totalPages}
        positions={positions}
        initialSearch={sp.search ?? ""}
        initialStatus={status ?? ""}
        initialPosition={sp.position ?? ""}
        initialDateFrom={sp.dateFrom ?? ""}
        initialDateTo={sp.dateTo ?? ""}
        initialSortBy={sortBy}
        initialSortDir={sortDir}
      />
    </div>
  );
}
