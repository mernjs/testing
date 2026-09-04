import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/admin/StatusBadge";
import KpiCard from "@/components/admin/KpiCard";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import DashboardFilters from "@/components/admin/DashboardFilters";
import CategoryBarChart from "@/components/admin/CategoryBarChart";
import SubmissionsTimeChart from "@/components/admin/SubmissionsTimeChart";
import { getDashboardStats, CATEGORIES, isValidCategory, getCategoryLabel } from "@/lib/leads";
import { LEAD_STATUSES, isValidLeadStatus } from "@/lib/lead-status";
import { formatDateTime } from "@/lib/utils";

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; dateFrom?: string; dateTo?: string }>;
}) {
  const sp = await searchParams;

  const category = sp.category && isValidCategory(sp.category) ? sp.category : undefined;
  const status = sp.status && isValidLeadStatus(sp.status) ? sp.status : undefined;

  const defaultTo = new Date();
  const defaultFrom = new Date();
  defaultFrom.setDate(defaultFrom.getDate() - 29);

  const dateFrom = parseDateParam(sp.dateFrom) ?? defaultFrom;
  const dateTo = parseDateParam(sp.dateTo, true) ?? defaultTo;

  const stats = await getDashboardStats({ category, status, dateFrom, dateTo });
  const categoryChartData = CATEGORIES.map((c) => ({ label: c.label, value: stats.byCategory[c.slug] ?? 0 }));
  const hasActiveFilters = Boolean(sp.category || sp.status || sp.dateFrom || sp.dateTo);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of form submissions across all categories.</p>
      </div>

      <DashboardFilters
        category={category ?? ""}
        status={status ?? ""}
        dateFrom={dateFrom.toISOString().slice(0, 10)}
        dateTo={dateTo.toISOString().slice(0, 10)}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <KpiCard label="Total" value={stats.totalOverall} accent />
        {LEAD_STATUSES.map((s) => (
          <KpiCard key={s.value} label={s.label} value={stats.byStatus[s.value] ?? 0} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Submissions by Category</CardTitle></CardHeader>
          <CardContent><CategoryBarChart data={categoryChartData} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Submissions Over Time</CardTitle></CardHeader>
          <CardContent><SubmissionsTimeChart data={stats.timeSeries} /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Submissions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {stats.recent.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
          {stats.recent.map((lead) => (
            <Link
              key={String(lead._id)}
              href={`/admin/submissions/${lead.category}/${lead._id}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3 text-sm transition-colors hover:border-primary/30 hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{lead.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {getCategoryLabel(lead.category)} · {formatDateTime(lead.createdAt)}
                </p>
              </div>
              <StatusBadge status={lead.status} />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
