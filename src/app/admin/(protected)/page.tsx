import {
  IndianRupee,
  Wallet,
  TrendingUp,
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
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import TimeSeriesChart from "@/components/lms/TimeSeriesChart";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import ExecutiveSection from "@/components/admin/ExecutiveSection";
import ModuleOverviewCard from "@/components/admin/ModuleOverviewCard";
import { getCommandCenterStats } from "@/lib/admin/command-center";

const MODULE_ICONS: Record<string, React.ReactNode> = {
  crm: <LayoutGrid className="size-4" />,
  pms: <FolderKanban className="size-4" />,
  tms: <GraduationCap className="size-4" />,
  prms: <ShoppingCart className="size-4" />,
  careers: <Briefcase className="size-4" />,
  portal: <Globe className="size-4" />,
};

export default async function AdminCommandCenterPage() {
  const stats = await getCommandCenterStats();

  return (
    <div className="relative space-y-6">
      <Breadcrumbs items={[{ label: "Admin" }, { label: "Command Center" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Super Admin Command Center</h1>
        <p className="text-sm text-muted-foreground">
          Real-time executive overview, aggregated live across every YashOrbit system.
        </p>
      </div>

      <ExecutiveSection title="Business">
        <KpiGrid>
          <KpiCard label="Total Revenue" value={stats.business.totalRevenue} format="currency" icon={<IndianRupee className="size-4" />} />
          <KpiCard label="Monthly Revenue" value={stats.business.monthlyRevenue} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Annual Revenue" value={stats.business.annualRevenue} format="currency" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Total Turnover" value={stats.business.totalTurnover} format="currency" accent icon={<IndianRupee className="size-4" />} />
          <KpiCard label="Gross Profit" value={stats.business.grossProfit} format="currency" tone={stats.business.grossProfit >= 0 ? "up" : "down"} icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Net Profit" value={stats.business.netProfit} format="currency" tone={stats.business.netProfit >= 0 ? "up" : "down"} icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Profit Margin" value={stats.business.profitMarginPercent} suffix="%" tone={stats.business.profitMarginPercent >= 0 ? "up" : "down"} icon={<Percent className="size-4" />} />
          <KpiCard label="Total Expenses" value={stats.business.totalExpenses} format="currency" icon={<ReceiptText className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

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

      <ExecutiveSection title="Training">
        <KpiGrid>
          <KpiCard label="Active Students" value={stats.training.activeStudents} accent icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Industrial Training" value={stats.training.industrialStudents} icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Internship Students" value={stats.training.internshipStudents} icon={<GraduationCap className="size-4" />} />
          <KpiCard label="Placement Rate" value={stats.training.placementRate} suffix="%" icon={<Award className="size-4" />} />
          <KpiCard label="Training Revenue" value={stats.training.trainingRevenue} format="currency" icon={<IndianRupee className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Procurement">
        <KpiGrid>
          <KpiCard label="Total Procurement Spend" value={stats.procurement.totalProcurementSpend} format="currency" accent icon={<ShoppingCart className="size-4" />} />
          <KpiCard label="Infrastructure Cost" value={stats.procurement.infrastructureCost} format="currency" icon={<Server className="size-4" />} />
          <KpiCard label="SaaS Cost" value={stats.procurement.saasCost} format="currency" icon={<CreditCard className="size-4" />} />
          <KpiCard label="Asset Value" value={stats.procurement.assetValue} format="currency" icon={<Boxes className="size-4" />} />
          <KpiCard label="Pending Purchase Orders" value={stats.procurement.pendingPurchaseOrders} icon={<ReceiptText className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="AI & Communication">
        <KpiGrid>
          <KpiCard label="AI Chat Sessions" value={stats.aiComms.aiChatSessions} accent icon={<Bot className="size-4" />} />
          <KpiCard label="Voice AI Usage" value={stats.aiComms.voiceAiUsage} icon={<Mic className="size-4" />} />
          <KpiCard label="Internal Messages Today" value={stats.aiComms.internalMessages} icon={<MessageSquare className="size-4" />} />
          <KpiCard label="Active Meetings" value={stats.aiComms.activeMeetings} icon={<Video className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Financial Intelligence" description="Company-wide revenue, expense and profit trend — all-time, by month.">
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

      <ExecutiveSection title="Centralized Module Overview" description="Live status from every module — open any of them for the full picture.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.modules.map((m) => (
            <ModuleOverviewCard key={m.key} label={m.label} href={m.href} stats={m.stats} icon={MODULE_ICONS[m.key]} />
          ))}
        </div>
      </ExecutiveSection>
    </div>
  );
}
