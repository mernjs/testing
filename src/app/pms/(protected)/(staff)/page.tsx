import Link from "next/link";
import {
  FolderKanban,
  Rocket,
  CheckCircle2,
  PauseCircle,
  AlarmClock,
  Building2,
  Users,
  Gauge,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import TimeSeriesChart from "@/components/lms/TimeSeriesChart";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import StatusPieChart from "@/components/lms/StatusPieChart";
import GranularityToggle from "@/components/lms/GranularityToggle";
import PmsDashboardFilters from "@/components/pms/PmsDashboardFilters";
import ProgressBar from "@/components/pms/ProgressBar";
import { ProjectStatusBadge } from "@/components/pms/StatusBadges";
import { getCurrentPmsUser } from "@/lib/pms-auth";
import { canViewAllProjects } from "@/lib/pms-roles";
import { getPmsDashboardStats } from "@/lib/pms/dashboard";
import { PROJECT_STATUSES } from "@/lib/pms/constants";
import { isValidDateRangePreset, resolveDateRangePreset, type DateRangePreset } from "@/lib/date-ranges";
import type { DashboardGranularity } from "@/lib/granularity";
import { formatDate } from "@/lib/utils";

const VALID_GRANULARITIES: DashboardGranularity[] = ["day", "week", "month", "year"];

const STATUS_COLORS: Record<string, string> = {
  planning: "#7ba0d9",
  in_progress: "#E56043",
  review: "#3b82f6",
  testing: "#a855f7",
  completed: "#22c55e",
  on_hold: "#f59e0b",
  cancelled: "#ef4444",
};

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function PmsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; dateFrom?: string; dateTo?: string; granularity?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentPmsUser();

  const granularity: DashboardGranularity = VALID_GRANULARITIES.includes(sp.granularity as DashboardGranularity)
    ? (sp.granularity as DashboardGranularity)
    : "month";

  const rangeParam: DateRangePreset =
    sp.range && isValidDateRangePreset(sp.range) ? sp.range : sp.dateFrom || sp.dateTo ? "custom" : "thisYear";

  let dateFrom: Date | undefined;
  let dateTo: Date | undefined;
  if (rangeParam === "custom") {
    dateFrom = parseDateParam(sp.dateFrom);
    dateTo = parseDateParam(sp.dateTo, true);
  } else {
    const resolved = resolveDateRangePreset(rangeParam)!;
    dateFrom = resolved.from;
    dateTo = resolved.to;
  }

  const restrictToEmployeeId =
    user && !canViewAllProjects(user.roles) ? user.employeeId ?? "__none__" : undefined;

  const stats = await getPmsDashboardStats({ dateFrom, dateTo, granularity, restrictToEmployeeId });
  const hasActiveFilters = Boolean(sp.range || sp.dateFrom || sp.dateTo);
  const scoped = Boolean(restrictToEmployeeId);

  return (
    <div className="relative space-y-4">
      <Breadcrumbs items={[{ label: "PMS" }, { label: "Dashboard" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Project Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {scoped
              ? "Projects you manage or contribute to."
              : `Welcome back${user ? `, ${user.email.split("@")[0]}` : ""}. Real-time delivery overview.`}
          </p>
        </div>
        <Link href="/pms/projects/new" className="text-sm font-medium text-primary hover:underline">
          + New Project
        </Link>
      </div>

      <PmsDashboardFilters
        range={rangeParam}
        dateFrom={(dateFrom ?? new Date()).toISOString().slice(0, 10)}
        dateTo={(dateTo ?? new Date()).toISOString().slice(0, 10)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Portfolio KPIs */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Portfolio</h2>
        <KpiGrid>
          <KpiCard label="Total Projects" value={stats.totalProjects} accent icon={<FolderKanban className="size-4" />} />
          <KpiCard label="Active Projects" value={stats.activeProjects} icon={<Rocket className="size-4" />} />
          <KpiCard label="Completed" value={stats.completedProjects} icon={<CheckCircle2 className="size-4" />} />
          <KpiCard label="On Hold" value={stats.onHoldProjects} icon={<PauseCircle className="size-4" />} />
        </KpiGrid>
      </div>

      {/* Health KPIs */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Health &amp; Capacity</h2>
        <KpiGrid>
          <KpiCard label="Overdue Projects" value={stats.overdueProjects} tone={stats.overdueProjects > 0 ? "down" : undefined} icon={<AlarmClock className="size-4" />} />
          {!scoped && <KpiCard label="Total Clients" value={stats.totalClients} icon={<Building2 className="size-4" />} />}
          <KpiCard label="Team Utilization" value={stats.teamUtilization} suffix="%" icon={<Users className="size-4" />} />
          <KpiCard label="Overall Completion" value={stats.overallCompletion} suffix="%" icon={<Gauge className="size-4" />} />
          {scoped && <KpiCard label="New This Period" value={stats.newProjects} trend={stats.newProjectsGrowth} icon={<FolderKanban className="size-4" />} />}
        </KpiGrid>
      </div>

      {/* Distribution */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Distribution</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Project Status</CardTitle></CardHeader>
            <CardContent>
              <StatusPieChart
                data={stats.statusDistribution.filter((s) => s.count > 0)}
                colors={STATUS_COLORS}
              />
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Priority Mix</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.priorityDistribution} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Client-wise Projects</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.clientDistribution} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Deadline &amp; Overdue Analysis</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.deadlineBuckets} /></CardContent>
          </GlassCard>
        </div>
      </div>

      {/* Trends */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Trends</h2>
        <GlassCard>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Monthly Project Growth</CardTitle>
            <GranularityToggle value={granularity} />
          </CardHeader>
          <CardContent><TimeSeriesChart data={stats.monthlyGrowth} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Average Progress Trend</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={stats.progressTrend} /></CardContent>
        </GlassCard>
      </div>

      {/* Team workload */}
      {!scoped && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Team Workload</h2>
          <GlassCard>
            <CardHeader><CardTitle>Allocation by Person (%)</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.teamWorkload} /></CardContent>
          </GlassCard>
        </div>
      )}

      {/* Status board summary + recent */}
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Status Board</CardTitle></CardHeader>
          <CardContent className="space-y-2 pt-2">
            {PROJECT_STATUSES.map((s) => {
              const row = stats.statusDistribution.find((d) => d.status === s.value);
              return (
                <div key={s.value} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
                  <ProjectStatusBadge status={s.value} />
                  <span className="font-semibold tabular-nums text-foreground">{row?.count ?? 0}</span>
                </div>
              );
            })}
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader><CardTitle>Recent Projects</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.recentProjects.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
            {stats.recentProjects.map((p) => (
              <Link
                key={p.id}
                href={`/pms/projects/${p.id}`}
                className="block rounded-lg border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate font-medium">{p.name}</span>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {p.code}
                  {p.endDate ? ` · Due ${formatDate(p.endDate)}` : ""}
                </p>
                <ProgressBar value={p.progressPercent} className="mt-2" />
              </Link>
            ))}
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
