import {
  Coins,
  Wallet,
  TrendingUp,
  Landmark,
  Building2,
  FileWarning,
  Clock,
  CheckSquare,
  Receipt,
  PiggyBank,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import TimeSeriesChart from "@/components/lms/TimeSeriesChart";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import GranularityToggle from "@/components/lms/GranularityToggle";
import { getCurrentFmsUser } from "@/lib/fms-auth";
import { getFmsDashboardStats } from "@/lib/fms/dashboard";
import { isValidDateRangePreset, resolveDateRangePreset, type DateRangePreset } from "@/lib/date-ranges";
import { sourceModuleLabel } from "@/lib/fms/constants";
import type { DashboardGranularity } from "@/lib/granularity";

const VALID_GRANULARITIES: DashboardGranularity[] = ["day", "week", "month", "year"];

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function FmsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const user = await getCurrentFmsUser();

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

  const stats = await getFmsDashboardStats({ dateFrom, dateTo, granularity });

  const revenueTrend = stats.revenueVsExpenses.map((p) => ({ date: p.date, count: p.revenue }));
  const expenseTrend = stats.revenueVsExpenses.map((p) => ({ date: p.date, count: p.expense }));
  const monthlyRevenueTrend = stats.monthlyProfitLoss.map((p) => ({ date: p.date, count: p.revenue }));
  const monthlyExpenseTrend = stats.monthlyProfitLoss.map((p) => ({ date: p.date, count: p.expense }));

  return (
    <div className="relative space-y-4">
      <Breadcrumbs items={[{ label: "FMS" }, { label: "Dashboard" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Finance Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back{user ? `, ${user.email.split("@")[0]}` : ""}. Company-wide financial overview.
          </p>
        </div>
        <GranularityToggle value={granularity} />
      </div>

      {/* Profitability */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Profitability</h2>
        <KpiGrid>
          <KpiCard label="Total Revenue" value={stats.totalRevenue} format="currency" accent icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Total Expenses" value={stats.totalExpenses} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Net Profit" value={stats.netProfit} format="currency" accent icon={<Coins className="size-4" />} />
          <KpiCard label="This Month's Profit" value={stats.currentMonthProfit} format="currency" icon={<Coins className="size-4" />} />
        </KpiGrid>
      </div>

      {/* This Month */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">This Month</h2>
        <KpiGrid>
          <KpiCard label="Revenue This Month" value={stats.currentMonthRevenue} format="currency" icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Expenses This Month" value={stats.currentMonthExpenses} format="currency" icon={<Wallet className="size-4" />} />
        </KpiGrid>
      </div>

      {/* Receivables & Payables */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Receivables &amp; Payables</h2>
        <KpiGrid>
          <KpiCard label="Accounts Receivable" value={stats.accountsReceivable} format="currency" icon={<Receipt className="size-4" />} />
          <KpiCard label="Accounts Payable" value={stats.accountsPayable} format="currency" icon={<Building2 className="size-4" />} />
          <KpiCard label="Pending Receivables" value={stats.pendingReceivables} format="currency" icon={<Clock className="size-4" />} />
          <KpiCard label="Pending Payables" value={stats.pendingPayables} format="currency" icon={<Clock className="size-4" />} />
        </KpiGrid>
      </div>

      {/* Cash, Banking, Payroll & Tax — Phase 4/3/7, shown at 0 until those modules ship */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Cash, Banking, Payroll &amp; Tax</h2>
        <KpiGrid>
          <KpiCard label="Total Cash" value={stats.totalCash} format="currency" icon={<Coins className="size-4" />} />
          <KpiCard label="Total Bank Balance" value={stats.totalBankBalance} format="currency" icon={<Landmark className="size-4" />} />
          <KpiCard label="Payroll Payable" value={stats.payrollPayable} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Tax Payable" value={stats.taxPayable} format="currency" icon={<PiggyBank className="size-4" />} />
        </KpiGrid>
      </div>

      {/* Operations */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Operations</h2>
        <KpiGrid>
          <KpiCard label="Outstanding Invoices" value={stats.outstandingInvoices} icon={<FileWarning className="size-4" />} />
          <KpiCard label="Overdue Invoices" value={stats.overdueInvoices} icon={<FileWarning className="size-4" />} />
          <KpiCard label="Upcoming Payments" value={stats.upcomingPayments} icon={<Clock className="size-4" />} />
          <KpiCard
            label="Pending Approvals"
            value={stats.pendingApprovals}
            tone={stats.pendingApprovals > 0 ? "down" : undefined}
            icon={<CheckSquare className="size-4" />}
          />
        </KpiGrid>
      </div>

      {/* Distribution */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Distribution</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Revenue by Source</CardTitle></CardHeader>
            <CardContent>
              <CategoryBarChart data={stats.revenueBySource.map((r) => ({ label: sourceModuleLabel(r.label), value: r.value }))} />
            </CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Expenses by Category</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.expensesByCategory} /></CardContent>
          </GlassCard>
        </div>
      </div>

      {/* Trends */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Trends</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={revenueTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Expense Trend</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={expenseTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Monthly Revenue (Profit &amp; Loss)</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={monthlyRevenueTrend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Monthly Expenses (Profit &amp; Loss)</CardTitle></CardHeader>
            <CardContent><TimeSeriesChart data={monthlyExpenseTrend} /></CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
