import {
  Wallet,
  CalendarClock,
  PiggyBank,
  Coins,
  Boxes,
  Building2,
  Cloud,
  Server,
  FileText,
  FileCheck2,
  Package,
  Activity,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import TimeSeriesChart from "@/components/lms/TimeSeriesChart";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import GranularityToggle from "@/components/lms/GranularityToggle";
import PrmsDashboardFilters from "@/components/prms/PrmsDashboardFilters";
import { getCurrentPrmsUser } from "@/lib/prms-auth";
import { getPrmsDashboardStats } from "@/lib/prms/dashboard";
import { listDepartments, listProjectOptions } from "@/lib/prms/pickers";
import { listVendorOptions } from "@/lib/prms/vendors";
import { isValidDateRangePreset, resolveDateRangePreset, type DateRangePreset } from "@/lib/date-ranges";
import type { DashboardGranularity } from "@/lib/granularity";

const VALID_GRANULARITIES: DashboardGranularity[] = ["day", "week", "month", "year"];

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function PrmsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const user = await getCurrentPrmsUser();

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

  const [stats, departments, projects, vendors] = await Promise.all([
    getPrmsDashboardStats({
      dateFrom,
      dateTo,
      granularity,
      departmentId: sp.departmentId || undefined,
      projectId: sp.projectId || undefined,
      vendorId: sp.vendorId || undefined,
      category: sp.category || undefined,
      paymentStatus: sp.paymentStatus || undefined,
      expenseType: sp.expenseType || undefined,
    }),
    listDepartments(),
    listProjectOptions(),
    listVendorOptions({ activeOnly: true }),
  ]);

  const hasActiveFilters = Boolean(
    sp.range || sp.dateFrom || sp.dateTo || sp.departmentId || sp.projectId || sp.vendorId || sp.category
  );

  return (
    <div className="relative space-y-4">
      <Breadcrumbs items={[{ label: "PRMS" }, { label: "Dashboard" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Executive Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back{user ? `, ${user.email.split("@")[0]}` : ""}. Company-wide procurement and expense overview.
          </p>
        </div>
      </div>

      <PrmsDashboardFilters
        range={rangeParam}
        dateFrom={(dateFrom ?? new Date()).toISOString().slice(0, 10)}
        dateTo={(dateTo ?? new Date()).toISOString().slice(0, 10)}
        departmentId={sp.departmentId ?? ""}
        projectId={sp.projectId ?? ""}
        vendorId={sp.vendorId ?? ""}
        category={sp.category ?? ""}
        departments={departments.map((d) => ({ _id: d._id, name: d.name }))}
        projects={projects.map((p) => ({ _id: p._id, name: p.name }))}
        vendors={vendors.map((v) => ({ _id: v._id, companyName: v.companyName }))}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Spend */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Spend</h2>
        <KpiGrid>
          <KpiCard label="Total Procurement Spend" value={stats.totalProcurementSpend} format="currency" accent icon={<Coins className="size-4" />} />
          <KpiCard label="Monthly Expenses" value={stats.monthlyExpenses} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Spend This Period" value={stats.periodSpend} format="currency" trend={stats.periodSpendGrowth} icon={<Activity className="size-4" />} />
          <KpiCard label="Annual Operational Cost" value={stats.annualOperationalCost} format="currency" icon={<CalendarClock className="size-4" />} />
        </KpiGrid>
      </div>

      {/* Budget */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Budget</h2>
        <KpiGrid>
          <KpiCard label="Approved Budget" value={stats.approvedBudget} format="currency" icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Remaining Budget" value={stats.remainingBudget} format="currency" accent icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Infrastructure Cost / mo" value={stats.infrastructureCost} format="currency" icon={<Server className="size-4" />} />
          <KpiCard label="Total Assets Value" value={stats.totalAssetsValue} format="currency" icon={<Boxes className="size-4" />} />
        </KpiGrid>
      </div>

      {/* Operations */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Operations</h2>
        <KpiGrid>
          <KpiCard label="Active Vendors" value={stats.activeVendors} icon={<Building2 className="size-4" />} />
          <KpiCard label="Active SaaS Subscriptions" value={stats.activeSubscriptions} icon={<Cloud className="size-4" />} />
          <KpiCard
            label="Pending Purchase Requests"
            value={stats.pendingPurchaseRequests}
            tone={stats.pendingPurchaseRequests > 0 ? "down" : undefined}
            icon={<FileText className="size-4" />}
          />
          <KpiCard
            label="Pending Invoice Payments"
            value={stats.pendingInvoicePayments}
            tone={stats.pendingInvoicePayments > 0 ? "down" : undefined}
            icon={<FileCheck2 className="size-4" />}
          />
          <KpiCard label="Total Office Assets" value={stats.totalOfficeAssets} icon={<Package className="size-4" />} />
        </KpiGrid>
      </div>

      {/* Distribution */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Distribution</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <CardHeader><CardTitle>Department-wise Expenses</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.departmentExpenses} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Category-wise Expenses</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.categoryExpenses} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Vendor Spend Analysis</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.vendorSpend} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>SaaS Subscription Cost</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.saasSubscriptionCost} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Top 10 Expense Categories</CardTitle></CardHeader>
            <CardContent><CategoryBarChart data={stats.topExpenseCategories} /></CardContent>
          </GlassCard>
          <GlassCard>
            <CardHeader><CardTitle>Budget vs Actual Spend</CardTitle></CardHeader>
            <CardContent>
              <CategoryBarChart
                data={stats.budgetVsActual.flatMap((b) => [
                  { label: `${b.label} · Budget`, value: b.budget },
                  { label: `${b.label} · Actual`, value: b.actual },
                ])}
              />
            </CardContent>
          </GlassCard>
        </div>
      </div>

      {/* Trends */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Trends</h2>
        <GlassCard>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Monthly Expense Trend</CardTitle>
            <GranularityToggle value={granularity} />
          </CardHeader>
          <CardContent><TimeSeriesChart data={stats.monthlyExpenseTrend} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Infrastructure Cost Trend</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={stats.infrastructureCostTrend} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Asset Acquisition Trend</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={stats.assetAcquisitionTrend} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Cash Outflow Timeline</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={stats.cashOutflowTimeline} /></CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
