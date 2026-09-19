import { notFound } from "next/navigation";
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
  Boxes,
  Server,
  CreditCard,
  Bot,
  MessageSquare,
  Building2,
  UserCheck,
  ShieldCheck,
  Activity,
  Briefcase,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import TimeSeriesChart from "@/components/lms/TimeSeriesChart";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import ExecutiveSection from "@/components/admin/ExecutiveSection";
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
} from "@/lib/admin/panel-analytics";
import { formatCurrency } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Icon map
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────────────────────────

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

function SimpleTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | number | React.ReactNode)[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40 bg-muted/30">
            {columns.map((col) => (
              <th key={col} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                No data available yet.
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr key={i} className="border-b border-border/20 transition-colors hover:bg-muted/20 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-foreground">
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

function BarList({ data, format }: { data: { label: string; value: number }[]; format?: "currency" | "percent" | "number" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.slice(0, 10).map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-36 shrink-0 truncate text-xs text-muted-foreground">{d.label}</span>
          <div className="flex-1 rounded-full bg-muted/40 h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--color-yashorbit-coral)]"
              style={{ width: `${Math.max((d.value / max) * 100, 2)}%` }}
            />
          </div>
          <span className="w-20 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
            {format === "currency"
              ? formatCurrency(d.value)
              : format === "percent"
              ? `${d.value}%`
              : d.value.toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel-specific view components
// ─────────────────────────────────────────────────────────────────────────────

async function FmsView() {
  const d = await getFmsAnalytics();
  return (
    <>
      <AlertBanner alerts={d.alerts} />

      <ExecutiveSection title="Financial KPIs">
        <KpiGrid>
          <KpiCard label="Total Revenue" value={d.kpis.totalRevenue} format="currency" accent icon={<IndianRupee className="size-4" />} />
          <KpiCard label="Total Expenses" value={d.kpis.totalExpenses} format="currency" icon={<ReceiptText className="size-4" />} />
          <KpiCard label="Net Profit" value={d.kpis.netProfit} format="currency" tone={d.kpis.netProfit >= 0 ? "up" : "down"} icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Profit Margin" value={d.kpis.profitMargin} suffix="%" tone={d.kpis.profitMargin >= 0 ? "up" : "down"} icon={<Percent className="size-4" />} />
          <KpiCard label="Cash Balance" value={d.kpis.totalCash} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Bank Balance" value={d.kpis.totalBankBalance} format="currency" icon={<Landmark className="size-4" />} />
          <KpiCard label="Accounts Receivable" value={d.kpis.accountsReceivable} format="currency" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Accounts Payable" value={d.kpis.accountsPayable} format="currency" icon={<TrendingDown className="size-4" />} />
          <KpiCard label="Outstanding Invoices" value={d.kpis.outstandingInvoices} icon={<ReceiptText className="size-4" />} />
          <KpiCard label="Overdue Invoices" value={d.kpis.overdueInvoices} tone={d.kpis.overdueInvoices > 0 ? "down" : undefined} icon={<AlertTriangle className="size-4" />} />
          <KpiCard label="Pending Approvals" value={d.kpis.pendingApprovals} tone={d.kpis.pendingApprovals > 0 ? "down" : undefined} icon={<Clock className="size-4" />} />
          <KpiCard label="This Month Profit" value={d.kpis.currentMonthProfit} format="currency" tone={d.kpis.currentMonthProfit >= 0 ? "up" : "down"} icon={<PiggyBank className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Financial Trends" description="Monthly revenue, expense, and profit/loss over time.">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Revenue vs Expenses</CardTitle></CardHeader>
            <CardContent>
              <TimeSeriesChart data={d.charts.revenueVsExpenses.map((p) => ({ date: p.date, count: p.revenue }))} />
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Monthly Profit / Loss</CardTitle></CardHeader>
            <CardContent>
              <TimeSeriesChart data={d.charts.monthlyProfitLoss.map((p) => ({ date: p.date, count: p.revenue - p.expense }))} />
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Revenue by Source</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.revenueBySource} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.expensesByCategory} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="Aging Analysis" description="Receivables and payables aging buckets.">
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Receivables Aging</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.receivablesAging} format="currency" /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Payables Aging</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.payablesAging} format="currency" /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="Project Profitability" description="Net profit per project from booked ledger transactions.">
        <GlassCard interactive={false}>
          <CardContent className="pt-6">
            <BarList data={d.charts.projectProfitability} format="currency" />
          </CardContent>
        </GlassCard>
      </ExecutiveSection>
    </>
  );
}

async function HrmsView() {
  const d = await getHrmsAnalytics();
  return (
    <>
      <AlertBanner alerts={d.alerts} />

      <ExecutiveSection title="Workforce KPIs">
        <KpiGrid>
          <KpiCard label="Total Employees" value={d.kpis.totalEmployees} accent icon={<Users className="size-4" />} />
          <KpiCard label="Active Employees" value={d.kpis.activeEmployees} tone="up" icon={<UserCheck className="size-4" />} />
          <KpiCard label="New Joiners" value={d.kpis.newJoinees} trend={d.kpis.newJoineesGrowth} icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Departments" value={d.kpis.departments} icon={<Building2 className="size-4" />} />
          <KpiCard label="Attrition Rate" value={d.kpis.attritionRate} suffix="%" tone={d.kpis.attritionRate > 10 ? "down" : "up"} icon={<TrendingDown className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Headcount & Hiring Trends">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Headcount Over Time</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.headcountTimeSeries} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Hiring Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.hiringTimeSeries} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Department Distribution</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.departmentDistribution} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Employment Type Breakdown</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.employmentTypeDistribution} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="Status & Demographics">
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Employee Status Distribution</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.statusDistribution} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Gender Distribution</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.genderDistribution} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="Recent Joiners">
        <GlassCard interactive={false}>
          <CardContent className="pt-4">
            <SimpleTable
              columns={["Name", "Code", "Joining Date", "Added"]}
              rows={d.recentJoinees.map((e) => [
                e.name,
                e.code,
                e.joiningDate ? new Date(e.joiningDate).toLocaleDateString("en-IN") : "—",
                new Date(e.createdAt).toLocaleDateString("en-IN"),
              ])}
            />
          </CardContent>
        </GlassCard>
      </ExecutiveSection>
    </>
  );
}

async function LmsView() {
  const d = await getLmsAnalytics();
  return (
    <>
      <AlertBanner alerts={d.alerts} />

      <ExecutiveSection title="Lead Pipeline KPIs">
        <KpiGrid>
          <KpiCard label="Total Leads" value={d.kpis.totalLeads} accent trend={d.kpis.growthPercent} icon={<Target className="size-4" />} />
          <KpiCard label="New" value={d.kpis.newLeads} icon={<Target className="size-4" />} />
          <KpiCard label="In Progress" value={d.kpis.inProgress} icon={<Activity className="size-4" />} />
          <KpiCard label="Completed" value={d.kpis.completed} tone="up" icon={<CheckCircle2 className="size-4" />} />
          <KpiCard label="Rejected" value={d.kpis.rejected} icon={<AlertTriangle className="size-4" />} />
          <KpiCard label="Conversion Rate" value={d.kpis.conversionRate} suffix="%" tone={d.kpis.conversionRate > 20 ? "up" : "down"} icon={<Percent className="size-4" />} />
          <KpiCard label="Stale Leads" value={d.kpis.staleCount} tone={d.kpis.staleCount > 0 ? "down" : undefined} icon={<Clock className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Lead Trends & Sources">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Leads Over Time</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.timeSeries} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Conversion Funnel</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.funnel.map((f) => ({ label: f.stage, value: f.count }))} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Leads by Source</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.bySource} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>By Day of Week</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.byWeekday.map((w) => ({ label: w.day, value: w.count }))} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="Category Performance">
        <GlassCard interactive={false}>
          <CardContent className="pt-4">
            <SimpleTable
              columns={["Category", "Total", "Completed", "Conversion Rate", "Growth"]}
              rows={d.charts.topCategories.map((c) => [
                c.label,
                c.total.toLocaleString("en-IN"),
                c.completed.toLocaleString("en-IN"),
                `${c.completionRate}%`,
                c.growthPercent !== null ? `${c.growthPercent > 0 ? "+" : ""}${c.growthPercent}%` : "—",
              ])}
            />
          </CardContent>
        </GlassCard>
      </ExecutiveSection>

      <ExecutiveSection title="Recent Leads">
        <GlassCard interactive={false}>
          <CardContent className="pt-4">
            <SimpleTable
              columns={["Name", "Category", "Status", "Source", "Date"]}
              rows={d.recentLeads.map((l) => [
                l.name,
                l.category,
                l.status,
                l.source,
                new Date(l.createdAt).toLocaleDateString("en-IN"),
              ])}
            />
          </CardContent>
        </GlassCard>
      </ExecutiveSection>

      {d.staleLeads.length > 0 && (
        <ExecutiveSection title="Stale Leads — Needs Follow-Up">
          <GlassCard interactive={false}>
            <CardContent className="pt-4">
              <SimpleTable
                columns={["Name", "Category", "Status", "Created"]}
                rows={d.staleLeads.map((l) => [
                  l.name,
                  l.category,
                  l.status,
                  new Date(l.createdAt).toLocaleDateString("en-IN"),
                ])}
              />
            </CardContent>
          </GlassCard>
        </ExecutiveSection>
      )}
    </>
  );
}

async function MessengerView() {
  const d = await getMessengerAnalytics();
  return (
    <>
      <AlertBanner alerts={d.alerts} />

      <ExecutiveSection title="Communication KPIs">
        <KpiGrid>
          <KpiCard label="Active Users" value={d.kpis.activeUsers} accent icon={<Users className="size-4" />} />
          <KpiCard label="Online Now" value={d.kpis.onlineMembers} tone="up" icon={<Activity className="size-4" />} />
          <KpiCard label="Total Channels" value={d.kpis.totalChannels} icon={<MessagesSquare className="size-4" />} />
          <KpiCard label="Project Channels" value={d.kpis.activeProjectChannels} icon={<FolderKanban className="size-4" />} />
          <KpiCard label="Messages Today" value={d.kpis.messagesSentToday} icon={<MessageSquare className="size-4" />} />
          <KpiCard label="DMs Today" value={d.kpis.directMessagesToday} icon={<MessageSquare className="size-4" />} />
          <KpiCard label="Shared Files (30d)" value={d.kpis.sharedFiles} icon={<Briefcase className="size-4" />} />
          <KpiCard label="Engagement Rate" value={d.kpis.engagementRate} suffix="%" icon={<Gauge className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Message Volume & Channels">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Daily Message Volume (30d)</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.dailyMessagingTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Channel Activity</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.channelActivity} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Most Active Members</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.mostActiveMembers} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Peak Message Hours</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.peakHours} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="Online vs Offline & File Sharing">
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Online vs Offline</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.onlineVsOffline} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>File Sharing Breakdown</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.fileSharing} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>
    </>
  );
}

async function PmsView() {
  const d = await getPmsAnalytics();
  return (
    <>
      <AlertBanner alerts={d.alerts} />

      <ExecutiveSection title="Project KPIs">
        <KpiGrid>
          <KpiCard label="Total Projects" value={d.kpis.totalProjects} accent icon={<FolderKanban className="size-4" />} />
          <KpiCard label="Active Projects" value={d.kpis.activeProjects} tone="up" icon={<Activity className="size-4" />} />
          <KpiCard label="Completed" value={d.kpis.completedProjects} icon={<CheckCircle2 className="size-4" />} />
          <KpiCard label="On Hold" value={d.kpis.onHoldProjects} icon={<Clock className="size-4" />} />
          <KpiCard label="Overdue" value={d.kpis.overdueProjects} tone={d.kpis.overdueProjects > 0 ? "down" : undefined} icon={<AlertTriangle className="size-4" />} />
          <KpiCard label="Total Clients" value={d.kpis.totalClients} icon={<Briefcase className="size-4" />} />
          <KpiCard label="Team Utilization" value={d.kpis.teamUtilization} suffix="%" tone={d.kpis.teamUtilization > 90 ? "down" : "up"} icon={<Gauge className="size-4" />} />
          <KpiCard label="Overall Completion" value={d.kpis.overallCompletion} suffix="%" icon={<Percent className="size-4" />} />
          <KpiCard label="New Projects" value={d.kpis.newProjects} trend={d.kpis.newProjectsGrowth} icon={<TrendingUp className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Project Trends & Distribution">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Monthly Project Growth</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.monthlyGrowth} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Progress Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.progressTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.statusDistribution} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Priority Distribution</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.priorityDistribution} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="Team & Deadlines">
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Team Workload</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.teamWorkload} format="percent" /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Deadline Risk Buckets</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.deadlineBuckets} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="Recent Projects">
        <GlassCard interactive={false}>
          <CardContent className="pt-4">
            <SimpleTable
              columns={["Name", "Code", "Status", "Progress", "End Date"]}
              rows={d.recentProjects.map((p) => [
                p.name,
                p.code,
                p.status.replace(/_/g, " "),
                `${p.progressPercent}%`,
                p.endDate ?? "—",
              ])}
            />
          </CardContent>
        </GlassCard>
      </ExecutiveSection>
    </>
  );
}

async function PortalView() {
  const d = await getPortalAnalytics();
  return (
    <>
      <AlertBanner alerts={d.alerts} />

      <ExecutiveSection title="External User KPIs">
        <KpiGrid>
          <KpiCard label="Total Active Users" value={d.kpis.total} accent icon={<Globe className="size-4" />} />
          <KpiCard label="Clients" value={d.kpis.clients} icon={<Briefcase className="size-4" />} />
          <KpiCard label="Job Applicants" value={d.kpis.jobApplicants} icon={<UserCheck className="size-4" />} />
          <KpiCard label="Interns" value={d.kpis.interns} icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Trainees" value={d.kpis.trainees} icon={<GraduationCap className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Role Breakdown">
        <GlassCard interactive={false}>
          <CardHeader><CardTitle>Users by Role</CardTitle></CardHeader>
          <CardContent>
            <CategoryBarChart data={d.charts.byRole} />
          </CardContent>
        </GlassCard>
      </ExecutiveSection>

      <ExecutiveSection title="Recent External Users">
        <GlassCard interactive={false}>
          <CardContent className="pt-4">
            <SimpleTable
              columns={["Name", "Email", "Role", "Joined"]}
              rows={d.recentUsers.map((u) => [
                u.name,
                u.email,
                u.role.replace("_", " "),
                new Date(u.createdAt).toLocaleDateString("en-IN"),
              ])}
            />
          </CardContent>
        </GlassCard>
      </ExecutiveSection>
    </>
  );
}

async function PrmsView() {
  const d = await getPrmsAnalytics();
  return (
    <>
      <AlertBanner alerts={d.alerts} />

      <ExecutiveSection title="Procurement KPIs">
        <KpiGrid>
          <KpiCard label="Total Spend" value={d.kpis.totalProcurementSpend} format="currency" accent icon={<ShoppingCart className="size-4" />} />
          <KpiCard label="Monthly Expenses" value={d.kpis.monthlyExpenses} format="currency" icon={<ReceiptText className="size-4" />} />
          <KpiCard label="Approved Budget" value={d.kpis.approvedBudget} format="currency" icon={<IndianRupee className="size-4" />} />
          <KpiCard label="Remaining Budget" value={d.kpis.remainingBudget} format="currency" tone="up" icon={<Wallet className="size-4" />} />
          <KpiCard label="Budget Utilization" value={d.kpis.budgetUtilization} suffix="%" tone={d.kpis.budgetUtilization > 90 ? "down" : "up"} icon={<Percent className="size-4" />} />
          <KpiCard label="Asset Value" value={d.kpis.totalAssetsValue} format="currency" icon={<Boxes className="size-4" />} />
          <KpiCard label="Total Assets" value={d.kpis.totalOfficeAssets} icon={<Boxes className="size-4" />} />
          <KpiCard label="Active Vendors" value={d.kpis.activeVendors} icon={<Briefcase className="size-4" />} />
          <KpiCard label="Active Subscriptions" value={d.kpis.activeSubscriptions} icon={<CreditCard className="size-4" />} />
          <KpiCard label="Infra Cost" value={d.kpis.infrastructureCost} format="currency" icon={<Server className="size-4" />} />
          <KpiCard label="Pending PRs" value={d.kpis.pendingPurchaseRequests} tone={d.kpis.pendingPurchaseRequests > 0 ? "down" : undefined} icon={<Clock className="size-4" />} />
          <KpiCard label="Pending Invoice Payments" value={d.kpis.pendingInvoicePayments} tone={d.kpis.pendingInvoicePayments > 0 ? "down" : undefined} icon={<AlertTriangle className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Spend Trends">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Monthly Expense Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.monthlyExpenseTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Cash Outflow Timeline</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.cashOutflowTimeline} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Category Expenses</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.categoryExpenses} format="currency" /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Top Vendor Spend</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.vendorSpend} format="currency" /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="SaaS & Infrastructure">
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>SaaS Subscription Cost</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.saasSubscriptionCost} format="currency" /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Department Expenses</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.departmentExpenses} format="currency" /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>
    </>
  );
}

async function TmsView() {
  const d = await getTmsAnalytics();
  return (
    <>
      <AlertBanner alerts={d.alerts} />

      <ExecutiveSection title="Training KPIs">
        <KpiGrid>
          <KpiCard label="Total Students" value={d.kpis.totalStudents} accent icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Industrial" value={d.kpis.industrialStudents} icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Internship" value={d.kpis.internshipStudents} icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Active Batches" value={d.kpis.activeBatches} icon={<Activity className="size-4" />} />
          <KpiCard label="Running Programs" value={d.kpis.runningPrograms} icon={<Activity className="size-4" />} />
          <KpiCard label="Completed Programs" value={d.kpis.completedPrograms} icon={<CheckCircle2 className="size-4" />} />
          <KpiCard label="Pending Applications" value={d.kpis.pendingApplications} tone={d.kpis.pendingApplications > 0 ? "down" : undefined} icon={<Clock className="size-4" />} />
          <KpiCard label="Placement Rate" value={d.kpis.placementSuccessRate} suffix="%" tone={d.kpis.placementSuccessRate >= 50 ? "up" : "down"} icon={<Award className="size-4" />} />
          <KpiCard label="Total Revenue" value={d.kpis.totalRevenue} format="currency" icon={<IndianRupee className="size-4" />} />
          <KpiCard label="Certificates Issued" value={d.kpis.certificatesIssued} icon={<Award className="size-4" />} />
          <KpiCard label="New Students" value={d.kpis.newStudents} trend={d.kpis.newStudentsGrowth} icon={<TrendingUp className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Enrollment & Revenue Trends">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Enrollment Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.enrollmentTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.revenueTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Program Enrollment</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.programEnrollment} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Placement Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={d.charts.placementTrend} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      <ExecutiveSection title="Batch & Completion">
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Batch Occupancy</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.batchOccupancy} format="percent" /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Completion Status</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.completionRate} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>
    </>
  );
}

async function WorkspaceView() {
  const d = await getWorkspaceAnalytics();
  return (
    <>
      <AlertBanner alerts={d.alerts} />

      <ExecutiveSection title="Platform User KPIs">
        <KpiGrid>
          <KpiCard label="Total Users" value={d.kpis.totalUsers} accent icon={<Users className="size-4" />} />
          <KpiCard label="Active Users" value={d.kpis.activeUsers} tone="up" icon={<UserCheck className="size-4" />} />
          <KpiCard label="Inactive Users" value={d.kpis.inactiveUsers} tone={d.kpis.inactiveUsers > 0 ? "down" : undefined} icon={<AlertTriangle className="size-4" />} />
          <KpiCard label="Super Admins" value={d.kpis.superAdminCount} icon={<ShieldCheck className="size-4" />} />
          <KpiCard label="Distinct Roles" value={d.kpis.totalRoles} icon={<LayoutGrid className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="User Distribution">
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Role Distribution</CardTitle></CardHeader>
            <CardContent><BarList data={d.charts.roleDistribution} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Active vs Inactive</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={d.charts.activeVsInactive} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default async function PanelAnalyticsPage({ params }: { params: Promise<{ panel: string }> }) {
  const { panel } = await params;
  if (!isPanelKey(panel)) notFound();

  const config = PANEL_CONFIGS[panel];
  const icon = PANEL_ICONS[panel];

  return (
    <div className="relative space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Breadcrumbs
            items={[{ label: "Admin", href: "/admin" }, { label: "Analytics" }, { label: config.label }]}
          />
          <div className="mt-3 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[var(--color-yashorbit-coral)] text-white shadow-md">
              {icon}
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{config.label}</h1>
              <p className="text-sm text-muted-foreground">{config.description}</p>
            </div>
          </div>
        </div>
        <Link
          href={config.href}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[var(--color-yashorbit-coral)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          {config.ctaLabel}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      {/* Panel-specific content */}
      {panel === "fms" && <FmsView />}
      {panel === "hrms" && <HrmsView />}
      {panel === "lms" && <LmsView />}
      {panel === "messenger" && <MessengerView />}
      {panel === "pms" && <PmsView />}
      {panel === "portal" && <PortalView />}
      {panel === "prms" && <PrmsView />}
      {panel === "tms" && <TmsView />}
      {panel === "workspace" && <WorkspaceView />}
    </div>
  );
}
