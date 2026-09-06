import Link from "next/link";
import { Inbox } from "lucide-react";
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
import CategoryTabs, { type CategoryPanelData } from "@/components/admin/CategoryTabs";
import StackedCategoryStatusChart, { type StackedRow } from "@/components/admin/StackedCategoryStatusChart";
import PendingTasksWidget from "@/components/admin/PendingTasksWidget";
import QuickActions from "@/components/admin/QuickActions";
import { getDashboardStats, CATEGORIES, isValidCategory, getCategoryLabel, type DashboardGranularity } from "@/lib/leads";
import { LEAD_STATUSES, isValidLeadStatus, getStatusMeta } from "@/lib/lead-status";
import { LEAD_STATUS_ICONS } from "@/lib/lead-status-icons";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { listSavedFilters } from "@/lib/saved-filters";
import { formatDateTime } from "@/lib/utils";
import { isValidDateRangePreset, resolveDateRangePreset, type DateRangePreset } from "@/lib/date-ranges";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import type { SerializedLead } from "@/components/admin/types";

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
    range?: string;
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

  // A preset drives the query when valid; otherwise fall back to explicit dateFrom/dateTo
  // (back-compat with links/saved filters from before presets existed), defaulting to last30.
  const rangeParam: DateRangePreset =
    sp.range && isValidDateRangePreset(sp.range)
      ? sp.range
      : sp.dateFrom || sp.dateTo
        ? "custom"
        : "last30";

  let dateFrom: Date;
  let dateTo: Date;
  if (rangeParam === "custom") {
    const defaultTo = new Date();
    const defaultFrom = new Date();
    defaultFrom.setDate(defaultFrom.getDate() - 29);
    dateFrom = parseDateParam(sp.dateFrom) ?? defaultFrom;
    dateTo = parseDateParam(sp.dateTo, true) ?? defaultTo;
  } else {
    const resolved = resolveDateRangePreset(rangeParam)!;
    dateFrom = resolved.from;
    dateTo = resolved.to;
  }

  const [stats, savedFilters] = await Promise.all([
    getDashboardStats({ category, status, source, search, dateFrom, dateTo, granularity }),
    admin ? listSavedFilters(admin.id) : Promise.resolve([]),
  ]);

  const categoryChartData = CATEGORIES.map((c) => ({ label: c.label, value: stats.byCategory[c.slug] ?? 0 }));
  const statusPieData = LEAD_STATUSES.map((s) => ({ status: s.value, label: s.label, count: stats.byStatus[s.value] ?? 0 }));
  const hasActiveFilters = Boolean(sp.category || sp.status || sp.source || sp.search || sp.dateFrom || sp.dateTo || sp.range);

  const currentParams: Record<string, string> = {};
  if (sp.category) currentParams.category = sp.category;
  if (sp.status) currentParams.status = sp.status;
  if (sp.source) currentParams.source = sp.source;
  if (sp.search) currentParams.search = sp.search;
  if (sp.range) currentParams.range = sp.range;
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

  const perCategoryStats = Object.values(stats.perCategory);
  const categoryPanelData: CategoryPanelData[] = perCategoryStats.map((cat) => ({
    slug: cat.slug,
    label: cat.label,
    total: cat.total,
    growthPercent: cat.growthPercent,
    byStatus: cat.byStatus,
    bySubService: cat.bySubService,
    timeSeries: cat.timeSeries,
    previousTimeSeries: cat.previousTimeSeries,
    funnel: cat.funnel,
  }));
  const stackedCategoryData: StackedRow[] = perCategoryStats.map((cat) => ({
    category: cat.slug,
    label: cat.label,
    new: cat.byStatus.new ?? 0,
    in_progress: cat.byStatus.in_progress ?? 0,
    completed: cat.byStatus.completed ?? 0,
    rejected: cat.byStatus.rejected ?? 0,
  }));
  const serializedStaleLeads: SerializedLead[] = stats.staleLeads.map((lead) => ({
    ...lead,
    _id: String(lead._id),
    createdAt: new Date(lead.createdAt).toISOString(),
    updatedAt: new Date(lead.updatedAt).toISOString(),
  }));

  return (
    <div className="relative space-y-4">
      <DashboardAutoRefresh />
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Dashboard</h1>
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
        range={rangeParam}
        dateFrom={dateFrom.toISOString().slice(0, 10)}
        dateTo={dateTo.toISOString().slice(0, 10)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Overview — the at-a-glance numbers, first thing on the page. */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <KpiCard label="Total" value={stats.totalOverall} accent trend={stats.growthPercent} icon={<Inbox className="size-4" />} />
          {LEAD_STATUSES.map((s) => {
            const Icon = LEAD_STATUS_ICONS[s.value];
            return <KpiCard key={s.value} label={s.label} value={stats.byStatus[s.value] ?? 0} icon={<Icon className="size-4" />} />;
          })}
        </div>
      </div>

      {/* Attention Needed — what to act on, right after the numbers. */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Attention Needed</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Pending Tasks</CardTitle></CardHeader>
            <CardContent><PendingTasksWidget count={stats.staleCount} leads={serializedStaleLeads} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <QuickActions exportParams={exportParams} hasActiveFilters={hasActiveFilters} resetHref="/admin" />
            </CardContent>
          </GlassCard>
        </div>
      </div>

      {/* Trends — how volume is moving over time. */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Trends</h2>
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
      </div>

      {/* Category Performance — every category-level view grouped together. */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Category Performance</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {perCategoryStats.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug];
            return (
              <KpiCard
                key={cat.slug}
                label={cat.label}
                value={cat.total}
                icon={<Icon className="size-4" />}
                trend={cat.growthPercent}
              />
            );
          })}
        </div>

        <GlassCard>
          <CardHeader><CardTitle>Submissions by Category</CardTitle></CardHeader>
          <CardContent><CategoryBarChart data={categoryChartData} /></CardContent>
        </GlassCard>

        <CategoryTabs categories={categoryPanelData} />

        {stackedCategoryData.length > 1 && (
          <GlassCard>
            <CardHeader><CardTitle>Category Comparison by Status</CardTitle></CardHeader>
            <CardContent><StackedCategoryStatusChart data={stackedCategoryData} /></CardContent>
          </GlassCard>
        )}
      </div>

      {/* Status & Conversion — where leads sit in the pipeline. */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Status &amp; Conversion</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent><StatusPieChart data={statusPieData} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Conversion Funnel</CardTitle></CardHeader>
            <CardContent>
              <ConversionFunnel stages={stats.funnel} rejectedCount={stats.byStatus.rejected ?? 0} />
            </CardContent>
          </GlassCard>
        </div>
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
                className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
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
