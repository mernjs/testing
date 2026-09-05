import Link from "next/link";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import KpiCard from "@/components/admin/KpiCard";
import CareerStatusBadge from "@/components/admin/CareerStatusBadge";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import CareerDashboardFilters from "@/components/admin/CareerDashboardFilters";
import TopPositions from "@/components/admin/TopPositions";
import CareersExportButton from "@/components/admin/CareersExportButton";
import { buttonVariants } from "@/components/ui/button";
import { getCareerDashboardStats, getAllJobPositions } from "@/lib/career-applications";
import { CAREER_APPLICATION_STATUSES, isValidCareerApplicationStatus, getCareerApplicationStatusMeta } from "@/lib/career-application-status";
import { formatDateTime } from "@/lib/utils";

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function CareersDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    position?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const sp = await searchParams;

  const status = sp.status && isValidCareerApplicationStatus(sp.status) ? sp.status : undefined;
  const positionSlug = sp.position || undefined;
  const search = sp.search || undefined;
  const dateFrom = parseDateParam(sp.dateFrom);
  const dateTo = parseDateParam(sp.dateTo, true);

  const [stats, positions] = await Promise.all([
    getCareerDashboardStats({ status, positionSlug, search, dateFrom, dateTo }),
    getAllJobPositions(),
  ]);

  const hasActiveFilters = Boolean(sp.status || sp.position || sp.search || sp.dateFrom || sp.dateTo);

  const exportParams: Record<string, string | undefined> = {};
  if (sp.status) exportParams.status = sp.status;
  if (sp.position) exportParams.position = sp.position;
  if (sp.search) exportParams.search = sp.search;
  if (sp.dateFrom) exportParams.dateFrom = sp.dateFrom;
  if (sp.dateTo) exportParams.dateTo = sp.dateTo;

  return (
    <div className="relative space-y-4">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] h-[40%] w-[40%] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[40%] w-[40%] rounded-full bg-[#ff8e75]/[0.04] blur-[120px]" />
      </div>

      <Breadcrumbs items={[{ label: "Dashboard", href: "/admin" }, { label: "Careers" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Careers</h1>
          <p className="text-sm text-muted-foreground">Applicant overview across every open and closed role.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/careers/applicants" className={buttonVariants({ variant: "outline", size: "sm" })}>
            View Applicants
          </Link>
          <CareersExportButton params={exportParams} />
        </div>
      </div>

      <CareerDashboardFilters
        status={status ?? ""}
        position={positionSlug ?? ""}
        positions={positions}
        search={search ?? ""}
        dateFrom={sp.dateFrom ?? ""}
        dateTo={sp.dateTo ?? ""}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-8">
        <KpiCard label="Total" value={stats.total} accent />
        {CAREER_APPLICATION_STATUSES.map((s) => (
          <KpiCard key={s.value} label={s.label} value={stats.byStatus[s.value] ?? 0} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Top Positions</CardTitle></CardHeader>
          <CardContent><TopPositions data={stats.topPositions} /></CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader><CardTitle>Recent Applications</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.recent.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
            {stats.recent.map((application) => {
              const meta = getCareerApplicationStatusMeta(application.status);
              return (
                <Link
                  key={String(application._id)}
                  href={`/admin/careers/applicants/${application._id}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3 text-sm transition-colors hover:border-primary/30 hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`size-2 shrink-0 rounded-full ${meta.dotClass}`} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{application.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {application.positionTitle} · {formatDateTime(application.createdAt)}
                      </p>
                    </div>
                  </div>
                  <CareerStatusBadge status={application.status} />
                </Link>
              );
            })}
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
