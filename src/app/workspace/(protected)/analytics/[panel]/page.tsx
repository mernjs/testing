import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  Landmark,
  Users,
  LayoutGrid,
  MessagesSquare,
  FolderKanban,
  Globe,
  ShoppingCart,
  GraduationCap,
  LayoutDashboard,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Wallet,
  PiggyBank,
  Percent,
  ReceiptText,
  Target,
  CheckCircle2,
  Clock,
  Gauge,
  Award,
  CreditCard,
  MessageSquare,
  Building2,
  UserCheck,
  ShieldCheck,
  Activity,
  Briefcase,
  Hash,
  BarChart3,
  CalendarClock,
  Star,
  Zap,
  Eye,
  DollarSign,
  Ban,
  Timer,
  UserPlus,
  Lock,
} from "lucide-react";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { normalizeRoles } from "@/lib/hrms-roles";
import { normalizePmsRoles } from "@/lib/pms-roles";
import { normalizePrmsRoles } from "@/lib/prms-roles";
import { normalizeTmsRoles } from "@/lib/tms-roles";
import { normalizeChatRoles } from "@/lib/messenger-roles";
import { normalizeAdminRoles } from "@/lib/admin-roles";
import { normalizeFmsRoles } from "@/lib/fms-roles";
import { CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import TimeSeriesChart from "@/components/lms/TimeSeriesChart";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import ExecutiveSection from "@/components/admin/ExecutiveSection";
import { AnalyticsFilterBar, type FilterField } from "@/components/admin/AnalyticsFilterBar";
import {
  isPanelKey,
  PANEL_CONFIGS,
  getFmsAnalytics,
  getHrmsAnalytics,
  getLmsAnalytics,
  getMessengerAnalytics,
  getPmsAnalytics,
  getPortalAnalytics,
  getPrmsAnalytics,
  getTmsAnalytics,
  getWorkspaceAnalytics,
  type PanelKey,
  type PanelAnalyticsFilters,
} from "@/lib/admin/panel-analytics";
import { getCareerDashboardStats } from "@/lib/career-applications";
import { getChatbotDashboardStats } from "@/lib/chatbot-analytics";
import { getPortfolioCosting } from "@/lib/pms/costing";
import { formatCurrency } from "@/lib/utils";

/* ─── Panel Filter Field Configurations ───────────────── */
const PANEL_FILTER_FIELDS: Record<PanelKey, FilterField[]> = {
  fms: [
    {
      key: "status",
      label: "Invoice Status",
      options: [
        { label: "Overdue Invoices", value: "overdue" },
        { label: "Pending Approvals", value: "pending" },
      ],
    },
    {
      key: "category",
      label: "Ledger Category",
      options: [
        { label: "Client Revenue", value: "client_revenue" },
        { label: "Training Revenue", value: "training" },
        { label: "Payroll Expenses", value: "payroll" },
        { label: "SaaS Subscriptions", value: "saas" },
        { label: "Tax Liability", value: "tax" },
      ],
    },
  ],
  hrms: [
    {
      key: "status",
      label: "Employee Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Probation", value: "probation" },
        { label: "Relieved", value: "relieved" },
        { label: "Terminated", value: "terminated" },
      ],
    },
    {
      key: "employmentType",
      label: "Employment Type",
      options: [
        { label: "Full Time", value: "full_time" },
        { label: "Part Time", value: "part_time" },
        { label: "Contract", value: "contract" },
        { label: "Internship", value: "internship" },
      ],
    },
    {
      key: "gender",
      label: "Gender",
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
    },
  ],
  lms: [
    {
      key: "status",
      label: "Lead Status",
      options: [
        { label: "New Lead", value: "new" },
        { label: "In Progress", value: "in_progress" },
        { label: "Completed / Won", value: "completed" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      key: "category",
      label: "Lead Category",
      options: [
        { label: "Industrial Training", value: "industrial-training" },
        { label: "Internship", value: "internship" },
        { label: "Corporate Training", value: "corporate-training" },
        { label: "Software Development", value: "software-development" },
        { label: "Consulting", value: "consulting" },
      ],
    },
    {
      key: "source",
      label: "Lead Source",
      options: [
        { label: "Website", value: "website" },
        { label: "Referral", value: "referral" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Google Search", value: "google" },
        { label: "Direct Outreach", value: "direct" },
      ],
    },
  ],
  messenger: [
    {
      key: "channelType",
      label: "Channel Type",
      options: [
        { label: "Project Channels", value: "project" },
        { label: "Department Channels", value: "department" },
        { label: "General Workspace", value: "general" },
        { label: "Direct Messages", value: "direct" },
      ],
    },
  ],
  pms: [
    {
      key: "status",
      label: "Project Status",
      options: [
        { label: "Planning", value: "planning" },
        { label: "In Progress", value: "in_progress" },
        { label: "On Hold", value: "on_hold" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
  ],
  portal: [
    {
      key: "role",
      label: "User Role",
      options: [
        { label: "Client Portal", value: "client" },
        { label: "Job Applicant", value: "job_applicant" },
        { label: "Intern", value: "intern" },
        { label: "Trainee Student", value: "trainee" },
      ],
    },
    {
      key: "status",
      label: "Account Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Suspended", value: "suspended" },
      ],
    },
  ],
  prms: [
    {
      key: "expenseType",
      label: "Expense Type",
      options: [
        { label: "Operational Expense", value: "operating" },
        { label: "Capital Expenditure", value: "capital" },
        { label: "Software SaaS", value: "software" },
        { label: "Hardware & Assets", value: "hardware" },
        { label: "Utilities & Office", value: "utility" },
      ],
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      options: [
        { label: "Paid", value: "paid" },
        { label: "Pending Payment", value: "pending" },
        { label: "Overdue", value: "overdue" },
      ],
    },
  ],
  tms: [
    {
      key: "mode",
      label: "Training Mode",
      options: [
        { label: "Industrial Training", value: "industrial" },
        { label: "Internship Program", value: "internship" },
      ],
    },
  ],
  workspace: [
    {
      key: "role",
      label: "Staff Role",
      options: [
        { label: "Super Admin", value: "super_admin" },
        { label: "Admin", value: "admin" },
        { label: "Finance Admin", value: "finance_admin" },
        { label: "HR Admin", value: "hr_admin" },
        { label: "PMS Admin", value: "pms_admin" },
        { label: "TMS Admin", value: "tms_admin" },
      ],
    },
    {
      key: "status",
      label: "Account Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ],
};

/* ─── Icon map ─────────────────────────────────────────── */
const PANEL_ICONS: Record<PanelKey, React.ReactNode> = {
  fms: <Landmark className="size-5" />,
  hrms: <Users className="size-5" />,
  lms: <LayoutGrid className="size-5" />,
  messenger: <MessagesSquare className="size-5" />,
  pms: <FolderKanban className="size-5" />,
  portal: <Globe className="size-5" />,
  prms: <ShoppingCart className="size-5" />,
  tms: <GraduationCap className="size-5" />,
  workspace: <LayoutDashboard className="size-5" />,
};

/* ─── Shared UI helpers ─────────────────────────────────── */

function AlertBanner({ alerts }: { alerts: { type: "warning" | "danger"; message: string }[] }) {
  if (alerts.length === 0) return null;
  return (
    <div className="space-y-2">
      {alerts.map((a, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
            a.type === "danger"
              ? "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          }`}
        >
          {a.type === "danger" ? <AlertTriangle className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
          {a.message}
        </div>
      ))}
    </div>
  );
}

function AccessDeniedView({ panelName, userRoles }: { panelName: string; userRoles: string[] }) {
  return (
    <GlassCard interactive={false}>
      <CardContent className="py-12 px-6 text-center space-y-4">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
          <Lock className="size-7" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-xl font-bold text-foreground">Workspace Access Control Notice</h3>
          <p className="text-xs text-muted-foreground">
            Your workspace account currently does not have active role privileges assigned for <span className="font-semibold text-foreground">{panelName}</span>.
          </p>
        </div>
        <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
          <span className="text-muted-foreground">Active Account Roles:</span>
          {userRoles.map((r) => (
            <span key={r} className="rounded-full bg-background border border-border/50 px-2.5 py-0.5 font-medium text-foreground">
              {r.replace(/_/g, " ")}
            </span>
          ))}
          {userRoles.length === 0 && <span className="text-muted-foreground italic">Standard Employee</span>}
        </div>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            href="/workspace"
            className="rounded-xl border border-border/60 bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted/40 transition-colors"
          >
            Back to Workspace Hub
          </Link>
          <Link
            href="/hrms/me"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            My Employee Portal
          </Link>
        </div>
      </CardContent>
    </GlassCard>
  );
}

function DataTable({ columns, rows, emptyMsg = "No data available yet." }: {
  columns: { label: string; align?: "left" | "right" | "center" }[];
  rows: (string | number | React.ReactNode)[][];
  emptyMsg?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40 bg-muted/30">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground ${
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                {emptyMsg}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b border-border/20 transition-colors hover:bg-muted/20 last:border-0">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`px-4 py-2.5 text-foreground ${
                      columns[j]?.align === "right" ? "text-right tabular-nums" : columns[j]?.align === "center" ? "text-center" : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function BarList({
  data,
  format,
  title,
}: {
  data: { label: string; value: number }[];
  format?: "currency" | "percent" | "number";
  title?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {title && <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>}
      {data.slice(0, 12).map((d, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-36 shrink-0 truncate text-xs text-muted-foreground" title={d.label}>{d.label}</span>
          <div className="flex-1 h-2 rounded-full bg-muted/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--color-yashorbit-coral)] transition-all"
              style={{ width: `${Math.max((Math.abs(d.value) / max) * 100, 2)}%` }}
            />
          </div>
          <span className="w-24 shrink-0 text-right text-xs font-bold tabular-nums text-foreground">
            {format === "currency"
              ? formatCurrency(d.value)
              : format === "percent"
              ? `${d.value}%`
              : d.value.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
      {data.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">No data yet.</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    completed: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    hired: "bg-emerald-500/15 text-emerald-600",
    new: "bg-primary/15 text-primary",
    in_progress: "bg-amber-500/15 text-amber-600",
    rejected: "bg-rose-500/15 text-rose-600",
    on_hold: "bg-orange-500/15 text-orange-600",
    cancelled: "bg-muted text-muted-foreground",
    running: "bg-emerald-500/15 text-emerald-600",
    upcoming: "bg-violet-500/15 text-violet-600",
    overdue: "bg-rose-500/15 text-rose-600",
  };
  const cls = map[status] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   FMS View
──────────────────────────────────────────────────────── */
async function FmsView({ filters }: { filters?: PanelAnalyticsFilters }) {
  const d = await getFmsAnalytics(filters);
  return (
    <>
      <AlertBanner alerts={d.alerts} />
      <ExecutiveSection title="Finance KPIs">
        <KpiGrid>
          <KpiCard label="Total Revenue" value={d.kpis.totalRevenue} format="currency" accent icon={<IndianRupee className="size-4" />} />
          <KpiCard label="Total Expenses" value={d.kpis.totalExpenses} format="currency" icon={<ReceiptText className="size-4" />} />
          <KpiCard label="Net Profit" value={d.kpis.netProfit} format="currency" tone={d.kpis.netProfit >= 0 ? "up" : "down"} icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Profit Margin" value={d.kpis.profitMargin} suffix="%" tone={d.kpis.profitMargin >= 0 ? "up" : "down"} icon={<Percent className="size-4" />} />
          <KpiCard label="Cash Balance" value={d.kpis.totalCash} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Bank Balance" value={d.kpis.totalBankBalance} format="currency" icon={<Landmark className="size-4" />} />
          <KpiCard label="Accounts Receivable" value={d.kpis.accountsReceivable} format="currency" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Accounts Payable" value={d.kpis.accountsPayable} format="currency" icon={<TrendingDown className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Revenue Over Time</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={d.charts.revenueVsExpenses.map((p) => ({ date: p.date, count: Math.round(p.revenue) }))} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Expenses Over Time</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={d.charts.revenueVsExpenses.map((p) => ({ date: p.date, count: Math.round(p.expense) }))} /></CardContent>
        </GlassCard>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   HRMS View
──────────────────────────────────────────────────────── */
async function HrmsView({ filters, userId }: { filters?: PanelAnalyticsFilters; userId: string }) {
  const d = await getHrmsAnalytics({ ...filters, restrictToEmployeeId: userId });
  return (
    <>
      <AlertBanner alerts={d.alerts} />
      <ExecutiveSection title="Workforce KPIs">
        <KpiGrid>
          <KpiCard label="Total Employees" value={d.kpis.totalEmployees} accent icon={<Users className="size-4" />} />
          <KpiCard label="Active Employees" value={d.kpis.activeEmployees} tone="up" icon={<UserCheck className="size-4" />} />
          <KpiCard label="Departments" value={d.kpis.departments} icon={<Building2 className="size-4" />} />
          <KpiCard label="New Joiners" value={d.kpis.newJoinees} trend={d.kpis.newJoineesGrowth} icon={<TrendingUp className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Headcount Growth</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={d.charts.headcountTimeSeries} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Department Distribution</CardTitle></CardHeader>
          <CardContent><BarList data={d.charts.departmentDistribution} /></CardContent>
        </GlassCard>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   LMS View
──────────────────────────────────────────────────────── */
async function LmsView({ filters }: { filters?: PanelAnalyticsFilters }) {
  const [d, career] = await Promise.all([
    getLmsAnalytics(filters),
    getCareerDashboardStats({
      granularity: (filters?.granularity as any) ?? "month",
      dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
    }).catch(() => null),
  ]);

  return (
    <>
      <AlertBanner alerts={d.alerts} />
      <ExecutiveSection title="Lead Pipeline KPIs">
        <KpiGrid>
          <KpiCard label="Total Leads" value={d.kpis.totalLeads} accent trend={d.kpis.growthPercent} icon={<Target className="size-4" />} />
          <KpiCard label="New Leads" value={d.kpis.newLeads} icon={<Target className="size-4" />} />
          <KpiCard label="In Progress" value={d.kpis.inProgress} icon={<Activity className="size-4" />} />
          <KpiCard label="Completed" value={d.kpis.completed} tone="up" icon={<CheckCircle2 className="size-4" />} />
          <KpiCard label="Conversion Rate" value={d.kpis.conversionRate} suffix="%" icon={<Percent className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Leads Over Time</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={d.charts.timeSeries} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Leads by Source</CardTitle></CardHeader>
          <CardContent><BarList data={d.charts.bySource} /></CardContent>
        </GlassCard>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Messenger View
──────────────────────────────────────────────────────── */
async function MessengerView({ filters }: { filters?: PanelAnalyticsFilters }) {
  const [d, chatbot] = await Promise.all([
    getMessengerAnalytics(filters),
    getChatbotDashboardStats({
      granularity: (filters?.granularity as any) ?? "month",
      dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
    }).catch(() => null),
  ]);

  return (
    <>
      <AlertBanner alerts={d.alerts} />
      <ExecutiveSection title="Communication KPIs">
        <KpiGrid>
          <KpiCard label="Active Users" value={d.kpis.activeUsers} accent icon={<Users className="size-4" />} />
          <KpiCard label="Online Members" value={d.kpis.onlineMembers} tone="up" icon={<Activity className="size-4" />} />
          <KpiCard label="Total Channels" value={d.kpis.totalChannels} icon={<MessagesSquare className="size-4" />} />
          <KpiCard label="Messages Sent Today" value={d.kpis.messagesSentToday} icon={<MessageSquare className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Daily Messaging Volume</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={d.charts.dailyMessagingTrend} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Active Channels</CardTitle></CardHeader>
          <CardContent><BarList data={d.charts.channelActivity} /></CardContent>
        </GlassCard>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   PMS View
──────────────────────────────────────────────────────── */
async function PmsView({ filters, userId }: { filters?: PanelAnalyticsFilters; userId: string }) {
  const [d, costing] = await Promise.all([
    getPmsAnalytics({ ...filters, restrictToEmployeeId: userId }),
    getPortfolioCosting().catch(() => null),
  ]);

  return (
    <>
      <AlertBanner alerts={d.alerts} />
      <ExecutiveSection title="Project KPIs">
        <KpiGrid>
          <KpiCard label="Total Projects" value={d.kpis.totalProjects} accent icon={<FolderKanban className="size-4" />} />
          <KpiCard label="Active Projects" value={d.kpis.activeProjects} tone="up" icon={<Activity className="size-4" />} />
          <KpiCard label="Completed" value={d.kpis.completedProjects} icon={<CheckCircle2 className="size-4" />} />
          <KpiCard label="Team Utilization" value={d.kpis.teamUtilization} suffix="%" icon={<Gauge className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Monthly Growth</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={d.charts.monthlyGrowth} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
          <CardContent><CategoryBarChart data={d.charts.statusDistribution} /></CardContent>
        </GlassCard>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Portal View
──────────────────────────────────────────────────────── */
async function PortalView({ filters }: { filters?: PanelAnalyticsFilters }) {
  const d = await getPortalAnalytics(filters);
  return (
    <>
      <AlertBanner alerts={d.alerts} />
      <ExecutiveSection title="Portal Users">
        <KpiGrid>
          <KpiCard label="Total External Users" value={d.kpis.total} accent icon={<Globe className="size-4" />} />
          <KpiCard label="Clients" value={d.kpis.clients} icon={<Users className="size-4" />} />
          <KpiCard label="Job Applicants" value={d.kpis.jobApplicants} icon={<Briefcase className="size-4" />} />
          <KpiCard label="Trainees" value={d.kpis.trainees} icon={<GraduationCap className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   PRMS View
──────────────────────────────────────────────────────── */
async function PrmsView({ filters }: { filters?: PanelAnalyticsFilters }) {
  const d = await getPrmsAnalytics(filters);
  return (
    <>
      <AlertBanner alerts={d.alerts} />
      <ExecutiveSection title="Procurement KPIs">
        <KpiGrid>
          <KpiCard label="Procurement Spend" value={d.kpis.totalProcurementSpend} format="currency" accent icon={<ShoppingCart className="size-4" />} />
          <KpiCard label="Approved Budget" value={d.kpis.approvedBudget} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Budget Utilization" value={d.kpis.budgetUtilization} suffix="%" icon={<Percent className="size-4" />} />
          <KpiCard label="Active Vendors" value={d.kpis.activeVendors} icon={<Users className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   TMS View
──────────────────────────────────────────────────────── */
async function TmsView({ filters }: { filters?: PanelAnalyticsFilters }) {
  const d = await getTmsAnalytics(filters);
  return (
    <>
      <AlertBanner alerts={d.alerts} />
      <ExecutiveSection title="Training KPIs">
        <KpiGrid>
          <KpiCard label="Total Students" value={d.kpis.totalStudents} accent icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Active Batches" value={d.kpis.activeBatches} tone="up" icon={<Activity className="size-4" />} />
          <KpiCard label="Placement Rate" value={d.kpis.placementSuccessRate} suffix="%" icon={<Award className="size-4" />} />
          <KpiCard label="Certificates Issued" value={d.kpis.certificatesIssued} icon={<CheckCircle2 className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Workspace View
──────────────────────────────────────────────────────── */
async function WorkspaceView({ filters }: { filters?: PanelAnalyticsFilters }) {
  const d = await getWorkspaceAnalytics(filters);
  return (
    <>
      <AlertBanner alerts={d.alerts} />
      <ExecutiveSection title="Workspace Platform KPIs">
        <KpiGrid>
          <KpiCard label="Total Accounts" value={d.kpis.totalUsers} accent icon={<Users className="size-4" />} />
          <KpiCard label="Active Staff" value={d.kpis.activeUsers} tone="up" icon={<UserCheck className="size-4" />} />
          <KpiCard label="Inactive Accounts" value={d.kpis.inactiveUsers} icon={<AlertTriangle className="size-4" />} />
          <KpiCard label="Roles Configured" value={d.kpis.totalRoles} icon={<ShieldCheck className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Page Root
──────────────────────────────────────────────────────── */
export default async function WorkspacePanelAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ panel: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");

  const { panel } = await params;
  const sp = await searchParams;
  if (!isPanelKey(panel)) notFound();

  const config = PANEL_CONFIGS[panel];
  const icon = PANEL_ICONS[panel];

  const roles = user.roles;
  const isSuperAdmin = normalizeAdminRoles(roles).length > 0;

  // Access validation per panel
  let isAuthorized = true;
  if (panel === "fms") isAuthorized = isSuperAdmin || normalizeFmsRoles(roles).length > 0;
  if (panel === "hrms") isAuthorized = isSuperAdmin || normalizeRoles(roles).length > 0;
  if (panel === "pms") isAuthorized = isSuperAdmin || normalizePmsRoles(roles).length > 0;
  if (panel === "prms") isAuthorized = isSuperAdmin || normalizePrmsRoles(roles).length > 0;
  if (panel === "tms") isAuthorized = isSuperAdmin || normalizeTmsRoles(roles).length > 0;
  if (panel === "messenger") isAuthorized = isSuperAdmin || normalizeChatRoles(roles).length > 0;

  const filters: PanelAnalyticsFilters = {
    dateFrom: typeof sp.dateFrom === "string" ? sp.dateFrom : undefined,
    dateTo: typeof sp.dateTo === "string" ? sp.dateTo : undefined,
    granularity: typeof sp.granularity === "string" ? (sp.granularity as any) : undefined,
    status: typeof sp.status === "string" ? sp.status : undefined,
    category: typeof sp.category === "string" ? sp.category : undefined,
    departmentId: typeof sp.departmentId === "string" ? sp.departmentId : undefined,
    role: typeof sp.role === "string" ? sp.role : undefined,
    source: typeof sp.source === "string" ? sp.source : undefined,
    employmentType: typeof sp.employmentType === "string" ? sp.employmentType : undefined,
    gender: typeof sp.gender === "string" ? sp.gender : undefined,
    expenseType: typeof sp.expenseType === "string" ? sp.expenseType : undefined,
    paymentStatus: typeof sp.paymentStatus === "string" ? sp.paymentStatus : undefined,
    mode: typeof sp.mode === "string" ? sp.mode : undefined,
    programId: typeof sp.programId === "string" ? sp.programId : undefined,
  };

  return (
    <div className="relative space-y-6 p-6">
      {/* Header with CTA to open specific operational panel in new tab */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: "Workspace", href: "/workspace" },
              { label: "Analytics" },
              { label: config.label },
            ]}
          />
          <div className="mt-3 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[var(--color-yashorbit-coral)] text-white shadow-md">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{config.label}</h1>
              <p className="text-sm text-muted-foreground max-w-2xl">{config.description}</p>
            </div>
          </div>
        </div>
        <Link
          href={config.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[var(--color-yashorbit-coral)] px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          {config.ctaLabel}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {/* Advanced Filter Bar */}
      <AnalyticsFilterBar fields={PANEL_FILTER_FIELDS[panel]} title={`${config.label} Horizon Filters`} />

      {/* Access Gate & View Renderer */}
      {!isAuthorized ? (
        <AccessDeniedView panelName={config.label} userRoles={roles} />
      ) : (
        <>
          {panel === "fms"       && <FmsView filters={filters} />}
          {panel === "hrms"      && <HrmsView filters={filters} userId={user.id} />}
          {panel === "lms"       && <LmsView filters={filters} />}
          {panel === "messenger" && <MessengerView filters={filters} />}
          {panel === "pms"       && <PmsView filters={filters} userId={user.id} />}
          {panel === "portal"    && <PortalView filters={filters} />}
          {panel === "prms"      && <PrmsView filters={filters} />}
          {panel === "tms"       && <TmsView filters={filters} />}
          {panel === "workspace" && <WorkspaceView filters={filters} />}
        </>
      )}
    </div>
  );
}
