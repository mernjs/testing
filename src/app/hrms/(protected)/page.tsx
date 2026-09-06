import Link from "next/link";
import { Users, UserCheck, UserPlus, Building2, Clock3, CalendarOff, AlarmClock, MailQuestion } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import KpiCard from "@/components/admin/KpiCard";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import TimeSeriesChart from "@/components/admin/TimeSeriesChart";
import CategoryBarChart from "@/components/admin/CategoryBarChart";
import StatusPieChart from "@/components/admin/StatusPieChart";
import GranularityToggle from "@/components/admin/GranularityToggle";
import HrmsDashboardFilters from "@/components/hrms/HrmsDashboardFilters";
import EmployeeStatusBadge from "@/components/hrms/EmployeeStatusBadge";
import AttendanceOverviewChart from "@/components/hrms/AttendanceOverviewChart";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { canViewAllEmployees } from "@/lib/hrms-roles";
import { getHrmsDashboardStats } from "@/lib/hrms/dashboard";
import { getHrmsOperationsStats } from "@/lib/hrms/dashboard-ops";
import { isValidDateRangePreset, resolveDateRangePreset, type DateRangePreset } from "@/lib/date-ranges";
import type { DashboardGranularity } from "@/lib/granularity";
import { formatDate } from "@/lib/utils";

const VALID_GRANULARITIES: DashboardGranularity[] = ["day", "week", "month", "year"];

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

// Statuses / colours for the pie share the brand palette used elsewhere.
const GENDER_COLORS: Record<string, string> = {
  male: "#1D428A",
  female: "#E56043",
  other: "#ff8e75",
  undisclosed: "#7ba0d9",
  unknown: "#94a3b8",
};

export default async function HrmsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; dateFrom?: string; dateTo?: string; granularity?: string }>;
}) {
  const sp = await searchParams;
  const user = await getCurrentHrmsUser();

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

  const restrictToManagerId = user && !canViewAllEmployees(user.roles) ? user.employeeId ?? "__none__" : undefined;
  const opsFrom = (dateFrom ?? new Date()).toISOString().slice(0, 10);
  const opsTo = (dateTo ?? new Date()).toISOString().slice(0, 10);

  const [stats, ops] = await Promise.all([
    getHrmsDashboardStats({ dateFrom, dateTo, granularity }),
    getHrmsOperationsStats({ from: opsFrom, to: opsTo, restrictToManagerId }),
  ]);
  const hasActiveFilters = Boolean(sp.range || sp.dateFrom || sp.dateTo);

  const genderPie = stats.genderDistribution.filter((g) => g.count > 0);

  return (
    <div className="relative space-y-4">
      <Breadcrumbs items={[{ label: "HRMS" }, { label: "Dashboard" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">HR Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back{user ? `, ${user.email.split("@")[0]}` : ""}. Real-time workforce overview.
          </p>
        </div>
        <Link href="/hrms/employees/new" className="text-sm font-medium text-primary hover:underline">
          + Add Employee
        </Link>
      </div>

      <HrmsDashboardFilters
        range={rangeParam}
        dateFrom={(dateFrom ?? new Date()).toISOString().slice(0, 10)}
        dateTo={(dateTo ?? new Date()).toISOString().slice(0, 10)}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Workforce KPIs */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Workforce</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <KpiCard label="Total Employees" value={stats.totalEmployees} accent icon={<Users className="size-4" />} />
          <KpiCard label="Active Employees" value={stats.activeEmployees} icon={<UserCheck className="size-4" />} />
          <KpiCard
            label="New Joinees"
            value={stats.newJoinees}
            trend={stats.newJoineesGrowth}
            icon={<UserPlus className="size-4" />}
          />
          <KpiCard label="Departments" value={stats.departments} icon={<Building2 className="size-4" />} />
        </div>
      </div>

      {/* Attendance & Leave KPIs */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Today &amp; Pending</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <KpiCard label="Present Today" value={ops.presentToday} icon={<Clock3 className="size-4" />} />
          <KpiCard label="On Leave" value={ops.onLeaveToday} icon={<CalendarOff className="size-4" />} />
          <KpiCard label="Late Check-ins" value={ops.lateToday} icon={<AlarmClock className="size-4" />} />
          <KpiCard label="Pending Leave Requests" value={ops.pendingLeaveRequests} icon={<MailQuestion className="size-4" />} />
        </div>
      </div>

      {/* Operations analytics */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Attendance &amp; Leave</h2>
        <GlassCard>
          <CardHeader><CardTitle>Attendance Overview</CardTitle></CardHeader>
          <CardContent><AttendanceOverviewChart data={ops.attendanceOverview} /></CardContent>
        </GlassCard>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Leave by Type</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={ops.leaveAnalytics.byType} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Leave by Month</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={ops.leaveAnalytics.byMonth} /></CardContent>
          </GlassCard>
        </div>
      </div>

      {/* Trends */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Trends</h2>
        <GlassCard>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Headcount Over Time</CardTitle>
            <GranularityToggle value={granularity} />
          </CardHeader>
          <CardContent>
            <TimeSeriesChart data={stats.headcountTimeSeries} />
          </CardContent>
        </GlassCard>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader>
              <CardTitle>Monthly Hiring</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart data={stats.hiringTimeSeries} />
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader>
              <CardTitle>Attrition</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart data={stats.attritionTimeSeries} />
            </CardContent>
          </GlassCard>
        </div>
      </div>

      {/* Distribution */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Distribution</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader>
              <CardTitle>Department-wise Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryBarChart data={stats.departmentDistribution} />
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader>
              <CardTitle>Employment Type</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryBarChart data={stats.employmentTypeDistribution} />
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusPieChart
                data={genderPie.map((g) => ({ status: g.status, label: g.label, count: g.count }))}
                colors={GENDER_COLORS}
              />
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader>
              <CardTitle>Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              {stats.statusDistribution.map((s) => (
                <div key={s.status} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
                  <EmployeeStatusBadge status={s.status} />
                  <span className="font-semibold tabular-nums text-foreground">{s.count}</span>
                </div>
              ))}
            </CardContent>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <CardHeader>
          <CardTitle>Recent Joinees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {stats.recentJoinees.length === 0 && <p className="text-sm text-muted-foreground">No employees yet.</p>}
          {stats.recentJoinees.map((e) => (
            <Link
              key={e.id}
              href={`/hrms/employees/${e.id}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{e.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {e.code} · Joined {e.joiningDate ? formatDate(e.joiningDate) : formatDate(e.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </CardContent>
      </GlassCard>
    </div>
  );
}
