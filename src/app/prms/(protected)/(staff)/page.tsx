import Link from "next/link";
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
  Plus,
  ShoppingCart,
  Receipt,
  Download,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import TimeSeriesChart from "@/components/lms/TimeSeriesChart";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import GranularityToggle from "@/components/lms/GranularityToggle";
import PrmsDashboardFilters from "@/components/prms/PrmsDashboardFilters";
import PrmsDataTable from "@/components/prms/PrmsDataTable";
import ItemPdfDownloadButtons from "@/components/prms/ItemPdfDownloadButtons";

import { getCurrentPrmsUser } from "@/lib/prms-auth";
import { getPrmsDashboardStats } from "@/lib/prms/dashboard";
import { listDepartments, listProjectOptions } from "@/lib/prms/pickers";
import { listVendorOptions } from "@/lib/prms/vendors";
import { searchRequisitions, serializeRequisition } from "@/lib/prms/requisitions";
import { searchPurchaseOrders, serializePurchaseOrder } from "@/lib/prms/purchase-orders";
import { searchExpenses, serializeExpense } from "@/lib/prms/expenses";

import { isValidDateRangePreset, resolveDateRangePreset, type DateRangePreset } from "@/lib/date-ranges";
import type { DashboardGranularity } from "@/lib/granularity";
import { formatMoney } from "@/lib/prms/constants";
import { formatDate } from "@/lib/utils";

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

  const [stats, departments, projects, vendors, recentReqs, recentPos, recentExps] = await Promise.all([
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
    searchRequisitions({ pageSize: 5 }),
    searchPurchaseOrders({ pageSize: 5 }),
    searchExpenses({ pageSize: 5 }),
  ]);

  const hasActiveFilters = Boolean(
    sp.range || sp.dateFrom || sp.dateTo || sp.departmentId || sp.projectId || sp.vendorId || sp.category
  );

  return (
    <div className="relative space-y-6">
      <Breadcrumbs items={[{ label: "PRMS" }, { label: "Executive Dashboard" }]} />

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-secondary/10 p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Executive Dashboard</h1>
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">Live Operations</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back{user ? `, ${user.email.split("@")[0]}` : ""}. Company financial control, procurement hub, and instant PDF receipts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/prms/procurement">
            <Button size="sm" className="gap-1.5 shadow-xs">
              <ShoppingCart className="size-4" />
              <span>Procurement Hub</span>
            </Button>
          </Link>
          <Link href="/prms/expenses">
            <Button size="sm" variant="outline" className="gap-1.5 shadow-xs">
              <Receipt className="size-4" />
              <span>Log Expense</span>
            </Button>
          </Link>
          <Link href="/prms/subscriptions">
            <Button size="sm" variant="outline" className="gap-1.5 shadow-xs">
              <Cloud className="size-4" />
              <span>SaaS Subscriptions</span>
            </Button>
          </Link>
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

      {/* 1. Core Financial Overview */}
      <div>
        <h2 className="mb-3 text-base font-bold uppercase tracking-wider text-muted-foreground">Company Financial Overview</h2>
        <KpiGrid>
          <KpiCard label="Total Procurement Spend" value={stats.totalProcurementSpend} format="currency" accent icon={<Coins className="size-4" />} />
          <KpiCard label="Remaining Budget" value={stats.remainingBudget} format="currency" accent icon={<PiggyBank className="size-4" />} />
          <KpiCard label="Monthly Expenses" value={stats.monthlyExpenses} format="currency" icon={<Wallet className="size-4" />} />
          <KpiCard label="Active SaaS & Servers" value={stats.activeSubscriptions} icon={<Cloud className="size-4" />} />
        </KpiGrid>
      </div>

      {/* 2. Instant PDF Downloads & Recent Transactions Widget */}
      <GlassCard className="p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">Recent Transactions &amp; Instant PDF Downloads</h3>
            <p className="text-xs text-muted-foreground">1-click Invoice PDF and Payment Receipt PDF downloads for recent startup activity.</p>
          </div>
          <Link href="/prms/procurement">
            <Button size="xs" variant="ghost" className="gap-1 text-xs text-primary">
              <span>View All Items</span>
              <ArrowRight className="size-3" />
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          {recentPos.items.length > 0 ? (
            <div className="divide-y divide-border/40 rounded-lg border border-border/50 bg-background/50">
              {recentPos.items.map(serializePurchaseOrder).slice(0, 4).map((po) => (
                <div key={po._id} className="flex flex-wrap items-center justify-between gap-3 p-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      PO
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{po.poNumber} · {po.vendorName}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(po.createdAt)} · Status: <span className="uppercase font-semibold text-primary">{po.status}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-foreground">{formatMoney(po.totalAmount, po.currency)}</span>
                    <ItemPdfDownloadButtons itemId={po._id} code={po.poNumber} variant="compact" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentExps.items.length > 0 ? (
            <div className="divide-y divide-border/40 rounded-lg border border-border/50 bg-background/50">
              {recentExps.items.map(serializeExpense).slice(0, 4).map((exp) => (
                <div key={exp._id} className="flex flex-wrap items-center justify-between gap-3 p-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 font-bold">
                      EXP
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{exp.expenseCode} · {exp.vendorName || exp.description || "Expense Claim"}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDate(exp.expenseDate)} · Category: {exp.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-foreground">{formatMoney(exp.totalAmount, exp.currency)}</span>
                    <ItemPdfDownloadButtons itemId={exp._id} code={exp.expenseCode} variant="compact" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-4 text-center text-xs text-muted-foreground">No recent transactions logged yet.</p>
          )}
        </div>
      </GlassCard>

      {/* 3. Operational Counters */}
      <div>
        <h2 className="mb-3 text-base font-bold uppercase tracking-wider text-muted-foreground">Operational Assets &amp; Vendors</h2>
        <KpiGrid>
          <KpiCard label="Active Vendors" value={stats.activeVendors} icon={<Building2 className="size-4" />} />
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

      {/* 4. Distribution Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-bold uppercase tracking-wider text-muted-foreground">Spend Distribution &amp; Analysis</h2>
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
        </div>
      </div>

      {/* 5. Historical Trends & Timelines */}
      <div className="space-y-4">
        <h2 className="text-base font-bold uppercase tracking-wider text-muted-foreground">Operational Trends &amp; Outflow</h2>
        <GlassCard>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Monthly Expense Trend</CardTitle>
            <GranularityToggle value={granularity} />
          </CardHeader>
          <CardContent><TimeSeriesChart data={stats.monthlyExpenseTrend} /></CardContent>
        </GlassCard>
        <GlassCard>
          <CardHeader><CardTitle>Cash Outflow Timeline</CardTitle></CardHeader>
          <CardContent><TimeSeriesChart data={stats.cashOutflowTimeline} /></CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
