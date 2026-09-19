import Link from "next/link";
import {
  IndianRupee,
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Percent,
  ReceiptText,
  Target,
  Users,
  CheckCircle2,
  Handshake,
  Rocket,
  AlarmClock,
  Gauge,
  Clock,
  GraduationCap,
  Award,
  Boxes,
  Server,
  CreditCard,
  ShoppingCart,
  Bot,
  Mic,
  MessageSquare,
  Video,
  LayoutGrid,
  FolderKanban,
  Briefcase,
  Globe,
  Landmark,
  AlertTriangle,
  AlertCircle,
  Activity,
  ArrowUpRight,
  Building2,
  UserCheck,
  ShieldCheck,
  MessagesSquare,
  LayoutDashboard,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import TimeSeriesChart from "@/components/lms/TimeSeriesChart";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import ExecutiveSection from "@/components/admin/ExecutiveSection";
import { AnalyticsFilterBar } from "@/components/admin/AnalyticsFilterBar";
import { getCommandCenterStats } from "@/lib/admin/command-center";
import { formatCurrency } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Panel status grid config
// ─────────────────────────────────────────────────────────────────────────────

const PANEL_GRID = [
  {
    key: "fms",
    label: "Finance",
    icon: <Landmark className="size-5" />,
    analyticsHref: "/admin/analytics/fms",
    panelHref: "/fms",
    color: "from-emerald-500 to-teal-600",
  },
  {
    key: "hrms",
    label: "HR",
    icon: <Users className="size-5" />,
    analyticsHref: "/admin/analytics/hrms",
    panelHref: "/hrms",
    color: "from-blue-500 to-indigo-600",
  },
  {
    key: "lms",
    label: "Leads / CRM",
    icon: <LayoutGrid className="size-5" />,
    analyticsHref: "/admin/analytics/lms",
    panelHref: "/lms",
    color: "from-violet-500 to-purple-600",
  },
  {
    key: "messenger",
    label: "Messenger",
    icon: <MessagesSquare className="size-5" />,
    analyticsHref: "/admin/analytics/messenger",
    panelHref: "/messenger",
    color: "from-sky-500 to-cyan-600",
  },
  {
    key: "pms",
    label: "Projects",
    icon: <FolderKanban className="size-5" />,
    analyticsHref: "/admin/analytics/pms",
    panelHref: "/pms",
    color: "from-orange-500 to-amber-600",
  },
  {
    key: "portal",
    label: "Portal",
    icon: <Globe className="size-5" />,
    analyticsHref: "/admin/analytics/portal",
    panelHref: "/portal",
    color: "from-rose-500 to-pink-600",
  },
  {
    key: "prms",
    label: "Procurement",
    icon: <ShoppingCart className="size-5" />,
    analyticsHref: "/admin/analytics/prms",
    panelHref: "/prms",
    color: "from-yellow-500 to-orange-500",
  },
  {
    key: "tms",
    label: "Training",
    icon: <GraduationCap className="size-5" />,
    analyticsHref: "/admin/analytics/tms",
    panelHref: "/tms",
    color: "from-fuchsia-500 to-pink-500",
  },
  {
    key: "workspace",
    label: "Workspace",
    icon: <LayoutDashboard className="size-5" />,
    analyticsHref: "/admin/analytics/workspace",
    panelHref: "/workspace",
    color: "from-slate-500 to-gray-600",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Module stat map (from command-center `modules` array)
// ─────────────────────────────────────────────────────────────────────────────

export default async function AdminCommandCenterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const dateFrom = typeof sp.dateFrom === "string" ? sp.dateFrom : undefined;
  const dateTo = typeof sp.dateTo === "string" ? sp.dateTo : undefined;
  const granularity = typeof sp.granularity === "string" ? (sp.granularity as any) : undefined;

  const stats = await getCommandCenterStats({ dateFrom, dateTo, granularity });

  // Build quick stat lookup from module summaries
  const moduleStats = Object.fromEntries(stats.modules.map((m) => [m.key, m.stats]));

  return (
    <div className="relative space-y-6 p-6">
      <Breadcrumbs items={[{ label: "Admin" }, { label: "Dashboard" }]} />

      {/* Hero header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Company Command Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time executive overview aggregated live across every YashOrbit system.{" "}
          <span className="text-xs opacity-60">Updated {new Date(stats.generatedAt).toLocaleTimeString("en-IN")}</span>
        </p>
      </div>

      {/* Advanced Command Center Filters */}
      <AnalyticsFilterBar title="Command Center Global Filters" />

      {/* ── FMS Top-Line Financial KPIs ── */}
      <ExecutiveSection title="Financial Position (FMS Ledger)" description="Real ledger-backed figures from the Finance Management System.">
        <KpiGrid>
          <KpiCard label="Ledger Revenue" value={stats.finance.totalRevenue} format="currency" accent icon={<IndianRupee className="size-4" />} />
          <KpiCard label="Ledger Expenses" value={stats.finance.totalExpenses} format="currency" icon={<ReceiptText className="size-4" />} />
          <KpiCard label="Net Profit" value={stats.finance.netProfit} format="currency" tone={stats.finance.netProfit >= 0 ? "up" : "down"} icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Cash + Bank" value={stats.finance.totalCash + stats.finance.totalBankBalance} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Accounts Receivable" value={stats.finance.accountsReceivable} format="currency" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Accounts Payable" value={stats.finance.accountsPayable} format="currency" icon={<TrendingDown className="size-4" />} />
          <KpiCard label="Pending Approvals" value={stats.finance.pendingApprovals} tone={stats.finance.pendingApprovals > 0 ? "down" : undefined} icon={<AlarmClock className="size-4" />} />
          <KpiCard label="Overdue Invoices" value={stats.finance.overdueInvoices} tone={stats.finance.overdueInvoices > 0 ? "down" : undefined} icon={<AlertTriangle className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* ── Business Overview (derived) ── */}
      <ExecutiveSection title="Business Overview" description="Composite figures derived from PMS, TMS, and CRM activity.">
        <KpiGrid>
          <KpiCard label="Total Revenue" value={stats.business.totalRevenue} format="currency" accent icon={<IndianRupee className="size-4" />} />
          <KpiCard label="Monthly Revenue" value={stats.business.monthlyRevenue} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Annual Revenue" value={stats.business.annualRevenue} format="currency" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Gross Profit" value={stats.business.grossProfit} format="currency" tone={stats.business.grossProfit >= 0 ? "up" : "down"} icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Net Profit" value={stats.business.netProfit} format="currency" tone={stats.business.netProfit >= 0 ? "up" : "down"} icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Profit Margin" value={stats.business.profitMarginPercent} suffix="%" tone={stats.business.profitMarginPercent >= 0 ? "up" : "down"} icon={<Percent className="size-4" />} />
          <KpiCard label="Total Expenses" value={stats.business.totalExpenses} format="currency" icon={<ReceiptText className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* ── Financial Charts ── */}
      <ExecutiveSection title="Financial Intelligence" description="Company-wide revenue, expense, and profit trend — all-time, by month.">
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={stats.financial.revenueTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Expense Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={stats.financial.expenseTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Profit / Loss Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={stats.financial.profitTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Expense by Category</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.financial.expenseByCategory} /></CardContent>
          </GlassCard>
        </div>
      </ExecutiveSection>

      {/* ── Sales & CRM ── */}
      <ExecutiveSection title="Sales & CRM">
        <KpiGrid>
          <KpiCard label="Total Leads" value={stats.salesCrm.totalLeads} accent icon={<Target className="size-4" />} />
          <KpiCard label="New Leads Today" value={stats.salesCrm.newLeadsToday} icon={<Target className="size-4" />} />
          <KpiCard label="Conversion Rate" value={stats.salesCrm.conversionRate} suffix="%" icon={<Percent className="size-4" />} />
          <KpiCard label="Active Clients" value={stats.salesCrm.activeClients} icon={<Users className="size-4" />} />
          <KpiCard label="Closed Deals" value={stats.salesCrm.closedDeals} icon={<CheckCircle2 className="size-4" />} />
          <KpiCard label="Pipeline Value" value={stats.salesCrm.pipelineValue} format="currency" icon={<Handshake className="size-4" />} />
          <KpiCard label="Won Value" value={stats.salesCrm.wonValue} format="currency" icon={<Handshake className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* ── Operations ── */}
      <ExecutiveSection title="Operations">
        <KpiGrid>
          <KpiCard label="Active Projects" value={stats.operations.activeProjects} accent icon={<Rocket className="size-4" />} />
          <KpiCard label="Completed Projects" value={stats.operations.completedProjects} icon={<CheckCircle2 className="size-4" />} />
          <KpiCard label="Overdue Projects" value={stats.operations.overdueProjects} tone={stats.operations.overdueProjects > 0 ? "down" : undefined} icon={<AlarmClock className="size-4" />} />
          <KpiCard label="Team Utilization" value={stats.operations.teamUtilization} suffix="%" icon={<Gauge className="size-4" />} />
          <KpiCard label="Billable Hours" value={Math.round(stats.operations.billableHours)} suffix="h" icon={<Clock className="size-4" />} />
          <KpiCard label="Non-Billable Hours" value={Math.round(stats.operations.nonBillableHours)} suffix="h" icon={<Clock className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* ── Training ── */}
      <ExecutiveSection title="Training">
        <KpiGrid>
          <KpiCard label="Active Students" value={stats.training.activeStudents} accent icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Industrial Training" value={stats.training.industrialStudents} icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Internship Students" value={stats.training.internshipStudents} icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Placement Rate" value={stats.training.placementRate} suffix="%" icon={<Award className="size-4" />} />
          <KpiCard label="Training Revenue" value={stats.training.trainingRevenue} format="currency" icon={<IndianRupee className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* ── Procurement ── */}
      <ExecutiveSection title="Procurement">
        <KpiGrid>
          <KpiCard label="Total Spend" value={stats.procurement.totalProcurementSpend} format="currency" accent icon={<ShoppingCart className="size-4" />} />
          <KpiCard label="Infrastructure Cost" value={stats.procurement.infrastructureCost} format="currency" icon={<Server className="size-4" />} />
          <KpiCard label="SaaS Cost" value={stats.procurement.saasCost} format="currency" icon={<CreditCard className="size-4" />} />
          <KpiCard label="Asset Value" value={stats.procurement.assetValue} format="currency" icon={<Boxes className="size-4" />} />
          <KpiCard label="Pending Purchase Orders" value={stats.procurement.pendingPurchaseOrders} icon={<ReceiptText className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* ── AI & Communication ── */}
      <ExecutiveSection title="AI & Communication">
        <KpiGrid>
          <KpiCard label="AI Chat Sessions" value={stats.aiComms.aiChatSessions} accent icon={<Bot className="size-4" />} />
          <KpiCard label="Voice AI Usage" value={stats.aiComms.voiceAiUsage} icon={<Mic className="size-4" />} />
          <KpiCard label="Internal Messages Today" value={stats.aiComms.internalMessages} icon={<MessageSquare className="size-4" />} />
          <KpiCard label="Active Meetings" value={stats.aiComms.activeMeetings} icon={<Video className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* ── 9-Panel Status Grid ── */}
      <ExecutiveSection
        title="Panel Performance Matrix"
        description="Live status across all 9 panels. Click 'Analytics' for deep insights, 'Open' to access the live panel."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PANEL_GRID.map((panel) => {
            const mStats = moduleStats[panel.key] ?? [];
            return (
              <GlassCard key={panel.key}>
                <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${panel.color} text-white shadow-sm`}
                  >
                    {panel.icon}
                  </div>
                  <CardTitle className="text-base">{panel.label}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mStats.length > 0 && (
                    <dl className="grid grid-cols-3 gap-2">
                      {mStats.slice(0, 3).map((s) => (
                        <div key={s.label} className="rounded-lg border border-border/50 px-2 py-2 text-center">
                          <dd className="text-base font-bold tabular-nums text-foreground">
                            {typeof s.value === "number" && s.value > 999
                              ? formatCurrency(s.value)
                              : s.value.toLocaleString("en-IN")}
                          </dd>
                          <dt className="mt-0.5 truncate text-[10px] text-muted-foreground">{s.label}</dt>
                        </div>
                      ))}
                    </dl>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={panel.analyticsHref}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary/8 hover:border-primary/40 hover:text-primary"
                    >
                      <Activity className="size-3" />
                      Analytics
                    </Link>
                    <Link
                      href={panel.panelHref}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-primary/90 to-[var(--color-yashorbit-coral)] px-3 py-1.5 text-xs font-medium text-white transition-all hover:opacity-90"
                    >
                      Open
                      <ArrowUpRight className="size-3" />
                    </Link>
                  </div>
                </CardContent>
              </GlassCard>
            );
          })}
        </div>
      </ExecutiveSection>
    </div>
  );
}
