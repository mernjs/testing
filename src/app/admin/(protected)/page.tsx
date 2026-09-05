import Link from "next/link";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import StatusBadge from "@/components/admin/StatusBadge";
import KpiCard from "@/components/admin/KpiCard";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import DashboardFilters from "@/components/admin/DashboardFilters";
import CategoryBarChart from "@/components/admin/CategoryBarChart";
import TimeSeriesChart from "@/components/admin/TimeSeriesChart";
import StatusPieChart from "@/components/admin/StatusPieChart";
import ConversionFunnel from "@/components/admin/ConversionFunnel";
import TopCategories from "@/components/admin/TopCategories";
import MonthlyInsights from "@/components/admin/MonthlyInsights";
import GranularityToggle from "@/components/admin/GranularityToggle";
import ExportButton from "@/components/admin/ExportButton";
import SavedFiltersMenu from "@/components/admin/SavedFiltersMenu";
import DashboardAutoRefresh from "@/components/admin/DashboardAutoRefresh";
import { getDashboardStats, CATEGORIES, isValidCategory, getCategoryLabel, type DashboardGranularity } from "@/lib/leads";
import { LEAD_STATUSES, isValidLeadStatus, getStatusMeta } from "@/lib/lead-status";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { listSavedFilters } from "@/lib/saved-filters";
import { formatDateTime } from "@/lib/utils";

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const VALID_GRANULARITIES: DashboardGranularity[] = ["day", "week", "month", "year"];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    status?: string;
    source?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    granularity?: string;
  }>;
}) {
  const sp = await searchParams;
  const admin = await getCurrentAdmin();

  const category = sp.category && isValidCategory(sp.category) ? sp.category : undefined;
  const status = sp.status && isValidLeadStatus(sp.status) ? sp.status : undefined;
  const source = sp.source || undefined;
  const search = sp.search || undefined;
  const granularity: DashboardGranularity = VALID_GRANULARITIES.includes(sp.granularity as DashboardGranularity)
    ? (sp.granularity as DashboardGranularity)
    : "day";

  const defaultTo = new Date();
  const defaultFrom = new Date();
  defaultFrom.setDate(defaultFrom.getDate() - 29);

  const dateFrom = parseDateParam(sp.dateFrom) ?? defaultFrom;
  const dateTo = parseDateParam(sp.dateTo, true) ?? defaultTo;

  const [stats, savedFilters] = await Promise.all([
    getDashboardStats({ category, status, source, search, dateFrom, dateTo, granularity }),
    admin ? listSavedFilters(admin.id) : Promise.resolve([]),
  ]);

  const categoryChartData = CATEGORIES.map((c) => ({ label: c.label, value: stats.byCategory[c.slug] ?? 0 }));
  const statusPieData = LEAD_STATUSES.map((s) => ({ status: s.value, label: s.label, count: stats.byStatus[s.value] ?? 0 }));
  const hasActiveFilters = Boolean(sp.category || sp.status || sp.source || sp.search || sp.dateFrom || sp.dateTo);

  const currentParams: Record<string, string> = {};
  if (sp.category) currentParams.category = sp.category;
  if (sp.status) currentParams.status = sp.status;
  if (sp.source) currentParams.source = sp.source;
  if (sp.search) currentParams.search = sp.search;
  if (sp.dateFrom) currentParams.dateFrom = sp.dateFrom;
  if (sp.dateTo) currentParams.dateTo = sp.dateTo;
  if (sp.granularity) currentParams.granularity = sp.granularity;

  const exportParams = {
    category: category ?? "all",
    status,
    source,
    search,
    dateFrom: dateFrom.toISOString().slice(0, 10),
    dateTo: dateTo.toISOString().slice(0, 10),
  };

  return (
    <div className="relative space-y-4">
      <DashboardAutoRefresh />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] h-[40%] w-[40%] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[40%] w-[40%] rounded-full bg-[#ff8e75]/[0.04] blur-[120px]" />
      </div>

      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time overview across all categories.</p>
        </div>
        <div className="flex items-center gap-2">
          {admin && <SavedFiltersMenu initialFilters={savedFilters.map((f) => ({ id: String(f._id), name: f.name, params: f.params }))} currentParams={currentParams} />}
          <ExportButton params={exportParams} />
        </div>
      </div>

      <DashboardFilters
        category={category ?? ""}
        status={status ?? ""}
        source={source ?? ""}
        search={search ?? ""}
        dateFrom={dateFrom.toISOString().slice(0, 10)}
        dateTo={dateTo.toISOString().slice(0, 10)}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard label="Total" value={stats.totalOverall} accent />
        {LEAD_STATUSES.map((s) => (
          <KpiCard key={s.value} label={s.label} value={stats.byStatus[s.value] ?? 0} />
        ))}
      </div>

      <GlassCard>
        <CardHeader><CardTitle>Performance Insights</CardTitle></CardHeader>
        <CardContent>
          <MonthlyInsights
            growthPercent={stats.growthPercent}
            previousPeriodTotal={stats.previousPeriodTotal}
            totalOverall={stats.totalOverall}
            byWeekday={stats.byWeekday}
          />
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Submissions Over Time</CardTitle>
          <GranularityToggle value={granularity} />
        </CardHeader>
        <CardContent><TimeSeriesChart data={stats.timeSeries} /></CardContent>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Submissions by Category</CardTitle></CardHeader>
          <CardContent><CategoryBarChart data={categoryChartData} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
          <CardContent><StatusPieChart data={statusPieData} /></CardContent>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Conversion Funnel</CardTitle></CardHeader>
          <CardContent>
            <ConversionFunnel stages={stats.funnel} rejectedCount={stats.byStatus.rejected ?? 0} />
          </CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Top Categories</CardTitle></CardHeader>
          <CardContent><TopCategories data={stats.topCategories} /></CardContent>
        </GlassCard>
      </div>

      <GlassCard>
        <CardHeader><CardTitle>Recent Submissions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {stats.recent.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
          {stats.recent.map((lead) => {
            const meta = getStatusMeta(lead.status);
            return (
              <Link
                key={String(lead._id)}
                href={`/admin/submissions/${lead.category}/${lead._id}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3 text-sm transition-colors hover:border-primary/30 hover:bg-muted/50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`size-2 shrink-0 rounded-full ${meta.dotClass}`} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{lead.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {getCategoryLabel(lead.category)} · {formatDateTime(lead.createdAt)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={lead.status} />
              </Link>
            );
          })}
        </CardContent>
      </GlassCard>
    </div>
  );
}
