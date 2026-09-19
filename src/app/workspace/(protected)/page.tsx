import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  ShoppingCart,
  GraduationCap,
  MessagesSquare,
  LayoutGrid,
  ShieldCheck,
  LayoutDashboard,
  Clock,
  CalendarDays,
  Wallet,
  UserCheck,
  KeyRound,
  ArrowUpRight,
  Sparkles,
  Activity,
  Lock,
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Timer,
  Target,
  Star,
  BookOpen,
  Gift,
  Briefcase,
  CalendarCheck,
  BarChart3,
  ListTodo,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { normalizeRoles } from "@/lib/hrms-roles";
import { normalizePmsRoles } from "@/lib/pms-roles";
import { normalizePrmsRoles } from "@/lib/prms-roles";
import { normalizeTmsRoles } from "@/lib/tms-roles";
import { normalizeChatRoles } from "@/lib/messenger-roles";
import { normalizeAdminRoles } from "@/lib/admin-roles";
import { normalizeFmsRoles } from "@/lib/fms-roles";
import { formatDateTime } from "@/lib/utils";
import GlassCard from "@/components/lms/GlassCard";
import { CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import ExecutiveSection from "@/components/admin/ExecutiveSection";
import HubModuleTile from "@/components/hub/HubModuleTile";
import TimeSeriesChart from "@/components/lms/TimeSeriesChart";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
// HRMS employee-level dashboard
import { getEmployeeDashboard as getHrmsDashboard } from "@/lib/hrms/dashboard-me";
import { getDb } from "@/lib/mongodb";
// PMS employee-level dashboard
import { getEmployeeDashboard as getPmsDashboard } from "@/lib/pms/employee-dashboard";
import { todayDateString, shiftMonth } from "@/lib/hrms/time";

interface ModuleTile {
  key: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  visible: boolean;
  roleBadge: string;
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const words = local.replace(/[._-]+/g, " ").replace(/\d+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return email;
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function formatCurrency(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
  return `₹${v.toFixed(0)}`;
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    in_progress: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
    done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    todo: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    review: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
    testing: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    blocked: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
  return map[status] ?? "bg-muted text-muted-foreground border-border/50";
}

function projectHealthColor(health: string) {
  if (health === "on_track") return "text-emerald-600 dark:text-emerald-400";
  if (health === "at_risk") return "text-amber-600 dark:text-amber-400";
  return "text-rose-600 dark:text-rose-400";
}

export default async function HubDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");

  await searchParams;

  const roles = user.roles;
  const hrmsRoles = normalizeRoles(roles);
  const pmsRoles = normalizePmsRoles(roles);
  const prmsRoles = normalizePrmsRoles(roles);
  const tmsRoles = normalizeTmsRoles(roles);
  const fmsRoles = normalizeFmsRoles(roles);
  const chatRoles = normalizeChatRoles(roles);
  const adminRoles = normalizeAdminRoles(roles);

  // ── Resolve linked employee for rich data ──────────────────────────────────
  // The hub user's email matches `hrms_employees.workEmail` (or adminUserId).
  const db = await getDb();
  const employeeDoc = await db
    .collection<{ _id: string; workEmail: string }>("hrms_employees")
    .findOne({ workEmail: user.email, deletedAt: { $exists: false } }, { projection: { _id: 1, workEmail: 1 } });
  const employeeId = employeeDoc?._id ?? null;

  // ── Fetch HRMS + PMS employee dashboards in parallel ─────────────────────
  const today = todayDateString();
  const pmsRange = { dateFrom: shiftMonth(today.slice(0, 7), -1) + "-01", dateTo: today };

  const [hrmsData, pmsData] = await Promise.all([
    employeeId ? getHrmsDashboard(employeeId).catch(() => null) : null,
    employeeId ? getPmsDashboard(employeeId, pmsRange).catch(() => null) : null,
  ]);

  // ── Tiles ──────────────────────────────────────────────────────────────────
  const tiles: ModuleTile[] = [
    {
      key: "hrms",
      label: "Human Resources",
      description: "Attendance, leaves, payroll & profile.",
      href: "/hrms",
      icon: <Users className="size-5" />,
      visible: hrmsRoles.length > 0,
      roleBadge: hrmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "pms",
      label: "Project Management",
      description: "Projects, tasks & timesheets.",
      href: "/pms",
      icon: <FolderKanban className="size-5" />,
      visible: pmsRoles.length > 0,
      roleBadge: pmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "prms",
      label: "Procurement & Expenses",
      description: "Requisitions, vendors & claims.",
      href: "/prms",
      icon: <ShoppingCart className="size-5" />,
      visible: prmsRoles.length > 0,
      roleBadge: prmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "tms",
      label: "Training Management",
      description: "Batches, programs & certifications.",
      href: "/tms",
      icon: <GraduationCap className="size-5" />,
      visible: tmsRoles.length > 0,
      roleBadge: tmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "fms",
      label: "Finance Management",
      description: "Ledger, transactions & billing.",
      href: "/fms",
      icon: <Wallet className="size-5" />,
      visible: fmsRoles.length > 0,
      roleBadge: fmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "messenger",
      label: "YashChat",
      description: "Channels, DMs & video meetings.",
      href: "/messenger",
      icon: <MessagesSquare className="size-5" />,
      visible: chatRoles.length > 0,
      roleBadge: chatRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "lms",
      label: "CRM & Leads",
      description: "Lead pipeline & AI assistant.",
      href: "/lms",
      icon: <LayoutGrid className="size-5" />,
      visible: true,
      roleBadge: "All Staff",
    },
    {
      key: "admin",
      label: "Super Admin",
      description: "Company-wide KPIs & system config.",
      href: "/admin",
      icon: <ShieldCheck className="size-5" />,
      visible: adminRoles.length > 0,
      roleBadge: adminRoles.join(", ").replace(/_/g, " "),
    },
  ];

  const visibleTiles = tiles.filter((t) => t.visible);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = nameFromEmail(user.email);

  // ── Derived HRMS stats ────────────────────────────────────────────────────
  const att = hrmsData?.thisMonth;
  const attendancePct = hrmsData?.attendanceRate ?? 0;
  const prevPct = hrmsData?.attendanceRatePrev ?? 0;
  const attTrend = attendancePct - prevPct;

  // Leave totals
  const lt = hrmsData?.leaveTotals ?? { available: 0, usedYtd: 0, pending: 0, allocated: 0 };

  // Pay YTD
  const ytd = hrmsData?.ytd;
  const latestPay = hrmsData?.latestPayslip?.payslip;

  // ── Derived PMS stats ──────────────────────────────────────────────────────
  const pms = pmsData;
  const taskTotal = (pms?.activeTasks ?? 0) + (pms?.completedTasks ?? 0) + (pms?.pendingTasks ?? 0);

  return (
    <div className="relative space-y-6">
      {/* ── Welcome Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {greeting}, {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                <Sparkles className="size-3" />
                Staff Hub
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as <span className="font-semibold text-foreground">{user.email}</span> · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/hrms/me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02]"
            >
              <UserCheck className="size-4" />
              My Attendance Portal
            </Link>
          </div>
        </div>

        {/* Role badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-xs">
          <span className="text-muted-foreground font-medium">Roles:</span>
          {roles.map((r) => (
            <span key={r} className="rounded-full bg-background border border-border/60 px-2.5 py-0.5 font-medium text-foreground capitalize">
              {r.replace(/_/g, " ")}
            </span>
          ))}
          {roles.length === 0 && <span className="text-muted-foreground italic">Standard Employee</span>}
          {hrmsData && (
            <span className="ml-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
              EMP · {hrmsData.employee.employeeCode}
            </span>
          )}
        </div>
      </div>

      {/* ── My Access KPIs ─────────────────────────────────────────────────── */}
      <ExecutiveSection title="My Workspace Status">
        <KpiGrid>
          <KpiCard
            label="Authorized Panels"
            value={visibleTiles.length}
            suffix={`/${tiles.length}`}
            accent
            icon={<LayoutDashboard className="size-4" />}
          />
          <KpiCard label="Assigned Roles" value={roles.length} icon={<ShieldCheck className="size-4" />} />
          <KpiCard
            label="Last Sign-in"
            value={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "First sign-in"}
            icon={<Clock className="size-4" />}
          />
          <KpiCard label="Member Since" value={formatDateTime(user.createdAt)} icon={<CalendarDays className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* ── HRMS: Attendance Overview ──────────────────────────────────────── */}
      {hrmsData && (
        <ExecutiveSection title="My Attendance — This Month" description={`${hrmsData.thisMonth.label} · ${hrmsData.currentStreak} day streak`}>
          <KpiGrid>
            <KpiCard
              label="Attendance Rate"
              value={attendancePct}
              suffix="%"
              accent
              trend={attTrend}
              icon={<UserCheck className="size-4" />}
            />
            <KpiCard label="Present Days" value={att?.present ?? 0} tone="up" icon={<CheckCircle2 className="size-4" />} />
            <KpiCard label="Absent Days" value={att?.absent ?? 0} tone={att?.absent ? "down" : undefined} icon={<AlertCircle className="size-4" />} />
            <KpiCard label="Avg. Worked Hours" value={Math.round((att?.avgWorkedMinutes ?? 0) / 60 * 10) / 10} suffix=" hrs" icon={<Timer className="size-4" />} />
            <KpiCard label="On Leave" value={att?.onLeave ?? 0} icon={<CalendarDays className="size-4" />} />
            <KpiCard label="Late Arrivals" value={att?.lateCount ?? 0} tone={att?.lateCount ? "down" : undefined} icon={<Clock className="size-4" />} />
            <KpiCard label="Punctual Days" value={hrmsData.punctuality.onTime} tone="up" icon={<Trophy className="size-4" />} />
            <KpiCard label="Current Streak" value={hrmsData.currentStreak} suffix=" days" accent icon={<Star className="size-4" />} />
          </KpiGrid>
        </ExecutiveSection>
      )}

      {/* ── HRMS: Attendance Charts ────────────────────────────────────────── */}
      {hrmsData && hrmsData.monthlyAttendance.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="size-4 text-primary" />
                6-Month Attendance Trend
              </CardTitle>
              <CardDescription>Present vs. Absent vs. On Leave</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBarChart
                data={hrmsData.monthlyAttendance.map((m) => ({
                  label: m.date,
                  value: m.present,
                }))}
              />
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Timer className="size-4 text-primary" />
                Monthly Worked Hours
              </CardTitle>
              <CardDescription>Average hours logged per month</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart data={hrmsData.monthlyHours} />
            </CardContent>
          </GlassCard>
        </div>
      )}

      {/* ── HRMS: Leave Balances ───────────────────────────────────────────── */}
      {hrmsData && hrmsData.leaveBalances.length > 0 && (
        <ExecutiveSection title="My Leave Balances" description={`Year ${hrmsData.year} · Available / Used / Pending`}>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {hrmsData.leaveBalances.map((b) => {
              const usedPct = b.allocated > 0 ? Math.min(Math.round((b.used / b.allocated) * 100), 100) : 0;
              return (
                <GlassCard key={b.leaveTypeCode} interactive={false}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{b.label}</span>
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${b.available > 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/40"}`}>
                        {b.available} left
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Used: {b.used}</span>
                        <span>Allocated: {b.allocated}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-yashorbit-coral transition-all duration-500"
                          style={{ width: `${usedPct}%` }}
                        />
                      </div>
                    </div>
                    {b.pending > 0 && (
                      <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        {b.pending} pending approval
                      </p>
                    )}
                  </CardContent>
                </GlassCard>
              );
            })}
          </div>
        </ExecutiveSection>
      )}

      {/* ── HRMS: Upcoming Leave ──────────────────────────────────────────── */}
      {hrmsData && hrmsData.upcomingLeave.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard interactive={false}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarCheck className="size-4 text-primary" />
                Upcoming Leave
              </CardTitle>
              <Link href="/hrms/me" target="_blank" className="text-xs font-medium text-primary hover:underline">
                View all →
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {hrmsData.upcomingLeave.slice(0, 4).map((req) => (
                <div key={req._id} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/60 px-3 py-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CalendarDays className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{req.leaveTypeLabel}</p>
                    <p className="text-xs text-muted-foreground">{req.startDate} → {req.endDate} · {req.days} day(s)</p>
                  </div>
                  <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${req.status === "approved" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </GlassCard>

          {/* Upcoming Holidays */}
          <GlassCard interactive={false}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <Gift className="size-4 text-primary" />
                Upcoming Holidays
              </CardTitle>
              {hrmsData.nextHoliday && (
                <span className="text-xs text-muted-foreground">{hrmsData.nextHoliday.daysAway} days away</span>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {hrmsData.upcomingHolidays.slice(0, 4).map((h) => (
                <div key={h._id} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/60 px-3 py-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Star className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.date}</p>
                  </div>
                </div>
              ))}
              {hrmsData.upcomingHolidays.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming holidays</p>
              )}
            </CardContent>
          </GlassCard>
        </div>
      )}

      {/* ── HRMS: Pay Trend ───────────────────────────────────────────────── */}
      {hrmsData && hrmsData.netPayTrend.length > 0 && (
        <ExecutiveSection title="Pay Overview" description="Net pay trend · Year-to-date summary">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GlassCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wallet className="size-4 text-primary" />
                    Net Pay Trend
                  </CardTitle>
                  <CardDescription>Last 6 months net salary</CardDescription>
                </CardHeader>
                <CardContent>
                  <TimeSeriesChart data={hrmsData.netPayTrend} />
                </CardContent>
              </GlassCard>
            </div>
            <div className="space-y-3">
              {ytd && (
                <GlassCard interactive={false}>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm font-bold text-foreground">YTD Summary ({hrmsData.year})</p>
                    <div className="space-y-2">
                      {[
                        { label: "Gross Pay", value: ytd.gross, color: "text-emerald-600 dark:text-emerald-400" },
                        { label: "Deductions", value: ytd.deductions, color: "text-rose-600 dark:text-rose-400" },
                        { label: "Net Pay", value: ytd.net, color: "text-primary font-bold" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{item.label}</span>
                          <span className={`font-semibold tabular-nums ${item.color}`}>{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                      <div className="pt-1 border-t border-border/40 text-xs text-muted-foreground">{ytd.months} payslip(s) processed</div>
                    </div>
                  </CardContent>
                </GlassCard>
              )}
              {latestPay && (
                <GlassCard interactive={false}>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-sm font-bold text-foreground">Latest Payslip</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Month</span>
                        <span className="font-medium">{latestPay.month}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Gross</span>
                        <span className="font-semibold text-foreground">{formatCurrency(latestPay.grossPay)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Net Pay</span>
                        <span className="font-bold text-primary">{formatCurrency(latestPay.netPay)}</span>
                      </div>
                    </div>
                    <Link href="/hrms/me" target="_blank" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1">
                      View Payslip <ArrowUpRight className="size-3" />
                    </Link>
                  </CardContent>
                </GlassCard>
              )}
            </div>
          </div>
        </ExecutiveSection>
      )}

      {/* ── PMS: Project & Task Overview ──────────────────────────────────── */}
      {pms && (
        <ExecutiveSection title="My Projects & Tasks" description="Active project status and task breakdown">
          <KpiGrid>
            <KpiCard label="Assigned Projects" value={pms.assignedProjects} accent icon={<Briefcase className="size-4" />} />
            <KpiCard label="Active Tasks" value={pms.activeTasks} tone="up" icon={<ListTodo className="size-4" />} />
            <KpiCard label="Completed Tasks" value={pms.completedTasks} tone="up" icon={<CheckCircle2 className="size-4" />} />
            <KpiCard label="Pending Tasks" value={pms.pendingTasks} icon={<AlertCircle className="size-4" />} />
            <KpiCard label="Today's Hours" value={pms.todayHours} suffix=" hrs" icon={<Timer className="size-4" />} />
            <KpiCard label="Week Hours" value={pms.weekHours} suffix=" hrs" icon={<Clock className="size-4" />} />
            <KpiCard label="Month Hours" value={pms.monthHours} suffix=" hrs" accent icon={<BarChart3 className="size-4" />} />
            <KpiCard label="Productivity" value={pms.productivity} suffix="%" tone={pms.productivity >= 60 ? "up" : "down"} icon={<Target className="size-4" />} />
          </KpiGrid>
        </ExecutiveSection>
      )}

      {/* ── PMS: Timesheet Trend + Hours by Project ───────────────────────── */}
      {pms && pms.hoursTrend.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Timer className="size-4 text-primary" />
                Timesheet Hours Trend
              </CardTitle>
              <CardDescription>Daily hours logged this period</CardDescription>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart data={pms.hoursTrend} />
            </CardContent>
          </GlassCard>

          {pms.hoursByProject.length > 0 && (
            <GlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FolderKanban className="size-4 text-primary" />
                  Hours by Project
                </CardTitle>
                <CardDescription>Time distribution across projects</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBarChart data={pms.hoursByProject} />
              </CardContent>
            </GlassCard>
          )}
        </div>
      )}

      {/* ── PMS: Task breakdown + Upcoming Deadlines ──────────────────────── */}
      {pms && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Task Status Breakdown */}
          <GlassCard interactive={false}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <ListTodo className="size-4 text-primary" />
                My Tasks
              </CardTitle>
              <Link href="/pms" target="_blank" className="text-xs font-medium text-primary hover:underline">
                Open PMS →
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {pms.recentTasks.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/60 px-3 py-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/8">
                    <ListTodo className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.updatedAt).toLocaleDateString("en-IN")}</p>
                  </div>
                  <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 border capitalize ${statusColor(t.status)}`}>
                    {t.status.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
              {pms.recentTasks.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No tasks assigned</p>
              )}
            </CardContent>
          </GlassCard>

          {/* Upcoming Deadlines */}
          <GlassCard interactive={false}>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4 text-primary" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pms.upcomingDeadlines.slice(0, 6).map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/60 px-3 py-2">
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${d.overdue ? "bg-rose-500/10" : "bg-amber-500/10"}`}>
                    <CalendarDays className={`size-4 ${d.overdue ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{d.title}</p>
                    <p className={`text-xs font-medium ${d.overdue ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}>
                      {d.overdue ? "⚠ Overdue · " : ""}{d.date}
                    </p>
                  </div>
                </div>
              ))}
              {pms.upcomingDeadlines.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No upcoming deadlines 🎉</p>
              )}
            </CardContent>
          </GlassCard>
        </div>
      )}

      {/* ── PMS: My Projects Table ─────────────────────────────────────────── */}
      {pms && pms.projects.length > 0 && (
        <ExecutiveSection title="My Projects" description="Active & recent project health">
          <GlassCard interactive={false}>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-xs text-muted-foreground">
                    <th className="text-left px-4 py-3 font-medium">Project</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Status</th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Progress</th>
                    <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">My Hours</th>
                    <th className="text-left px-4 py-3 font-medium">Health</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {pms.projects.slice(0, 6).map((p) => (
                    <tr key={p._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-foreground truncate max-w-[200px]">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.projectCode}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 border capitalize ${statusColor(p.status)}`}>
                          {p.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-yashorbit-coral"
                              style={{ width: `${p.progressPercent}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{p.progressPercent}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="font-semibold text-foreground tabular-nums">{p.myLoggedHours}h</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={`flex items-center gap-1 text-xs font-semibold capitalize ${projectHealthColor(p.health)}`}>
                          {p.health === "on_track" ? <TrendingUp className="size-3" /> : p.health === "at_risk" ? <Activity className="size-3" /> : <TrendingDown className="size-3" />}
                          {p.health.replace(/_/g, " ")}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </GlassCard>
        </ExecutiveSection>
      )}

      {/* ── HRMS: Milestones & Profile ─────────────────────────────────────── */}
      {hrmsData && (
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Milestone & Tenure */}
          <GlassCard interactive={false}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="size-4 text-primary" />
                Career Milestones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-background/60 border border-border/40 p-3 text-center">
                  <p className="text-2xl font-black text-primary">{hrmsData.tenure.years}<span className="text-sm">y</span></p>
                  <p className="text-xs text-muted-foreground mt-0.5">Years</p>
                </div>
                <div className="rounded-xl bg-background/60 border border-border/40 p-3 text-center">
                  <p className="text-2xl font-black text-primary">{hrmsData.tenure.months}<span className="text-sm">m</span></p>
                  <p className="text-xs text-muted-foreground mt-0.5">Months</p>
                </div>
                <div className="rounded-xl bg-background/60 border border-border/40 p-3 text-center">
                  <p className="text-2xl font-black text-primary">{hrmsData.tenure.totalDays}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Days</p>
                </div>
              </div>
              {hrmsData.nextMilestone && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {hrmsData.nextMilestone.kind === "birthday" ? <Gift className="size-4" /> : hrmsData.nextMilestone.kind === "anniversary" ? <Trophy className="size-4" /> : <BookOpen className="size-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{hrmsData.nextMilestone.label}</p>
                    <p className="text-xs text-muted-foreground">{hrmsData.nextMilestone.date} · in {hrmsData.nextMilestone.daysAway} days</p>
                  </div>
                </div>
              )}
              <div className="pt-2 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profile Completeness</span>
                  <span className={`font-bold ${hrmsData.profileCompleteness >= 80 ? "text-emerald-600" : "text-amber-600"}`}>{hrmsData.profileCompleteness}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${hrmsData.profileCompleteness >= 80 ? "bg-gradient-to-r from-emerald-500 to-green-400" : "bg-gradient-to-r from-amber-500 to-orange-400"}`}
                    style={{ width: `${hrmsData.profileCompleteness}%` }}
                  />
                </div>
                {hrmsData.profileCompleteness < 100 && (
                  <Link href="/hrms/me" target="_blank" className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-1">
                    Complete profile <ArrowUpRight className="size-3" />
                  </Link>
                )}
              </div>
            </CardContent>
          </GlassCard>

          {/* Leave Usage Chart */}
          {hrmsData.leaveUsageByType.length > 0 && (
            <GlassCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="size-4 text-primary" />
                  Leave Usage by Type
                </CardTitle>
                <CardDescription>Days used this year per category</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryBarChart data={hrmsData.leaveUsageByType.map((l) => ({ label: l.label, value: l.count }))} />
              </CardContent>
            </GlassCard>
          )}
        </div>
      )}

      {/* ── Operational Panels (SSO Launcher) ─────────────────────────────── */}
      <ExecutiveSection
        title="My Operational Panels"
        description="Single sign-on access to your authorized panels. Opens in new tab."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTiles.map((tile, i) => (
            <div key={tile.key} className="relative group">
              <HubModuleTile
                href={tile.href}
                label={tile.label}
                description={tile.description}
                icon={tile.icon}
                index={i}
              />
              <div className="absolute top-3 right-3 pointer-events-none">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Activity className="size-2.5" />
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      </ExecutiveSection>

      {/* ── Module Privileges ──────────────────────────────────────────────── */}
      <ExecutiveSection title="My Privileges & Role Breakdown" description="Permissions granted to your employee account">
        <GlassCard interactive={false}>
          <CardContent className="p-4">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                { module: "HRMS", status: hrmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: hrmsRoles },
                { module: "PMS", status: pmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: pmsRoles },
                { module: "PRMS", status: prmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: prmsRoles },
                { module: "TMS", status: tmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: tmsRoles },
                { module: "FMS", status: fmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: fmsRoles },
                { module: "YashChat", status: chatRoles.length > 0 ? "Authorized" : "Not Assigned", roles: chatRoles },
                { module: "LMS/CRM", status: "Authorized (All Staff)", roles: ["Staff Viewer"] },
                { module: "Super Admin", status: adminRoles.length > 0 ? "Authorized" : "Not Assigned", roles: adminRoles },
              ].map((item) => (
                <div key={item.module} className="rounded-xl border border-border/50 bg-background/70 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{item.module}</span>
                    <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${item.status.includes("Authorized") ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-muted text-muted-foreground"}`}>
                      {item.status.includes("Authorized") ? "Active" : "Locked"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize truncate">
                    {item.roles.length > 0 ? item.roles.join(", ").replace(/_/g, " ") : "No roles assigned"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </ExecutiveSection>

      {/* ── Account Security ───────────────────────────────────────────────── */}
      <ExecutiveSection title="Account Security & Governance">
        <KpiGrid>
          <KpiCard label="Account Status" value="Active" tone="up" icon={<ShieldCheck className="size-4" />} />
          <KpiCard label="Authentication" value="Hub Password SSO" icon={<Lock className="size-4" />} />
          <KpiCard label="SSO Token" value="Active Session" icon={<Zap className="size-4" />} />
          <KpiCard label="Security Status" value="Compliant" tone="up" icon={<UserCheck className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* ── Quick Self-Service Links ───────────────────────────────────────── */}
      <ExecutiveSection title="Quick Self-Service" description="Everyday staff tools and workspace shortcuts">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Attendance Portal", desc: "Clock in, leaves & payslips", href: "/hrms/me", icon: <UserCheck className="size-5 text-emerald-500" />, tag: "HRMS", external: true },
            { label: "Team Chat", desc: "Channels, DMs & video calls", href: "/messenger", icon: <MessagesSquare className="size-5 text-sky-500" />, tag: "Messenger", external: true },
            { label: "My Tasks & Projects", desc: "Timesheets & deliverables", href: "/pms", icon: <FolderKanban className="size-5 text-amber-500" />, tag: "PMS", external: true },
            { label: "Change Password", desc: "Update security credentials", href: "/workspace/change-password", icon: <KeyRound className="size-5 text-rose-500" />, tag: "Security", external: false },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              target={action.external ? "_blank" : undefined}
              rel={action.external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-3 rounded-2xl border border-border/40 bg-card/80 px-4 py-3.5 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background border border-border/50">
                {action.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{action.label}</p>
                <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          ))}
        </div>
      </ExecutiveSection>
    </div>
  );
}
