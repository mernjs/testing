import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import StatusBadge from "@/components/admin/StatusBadge";
import CategoryBarChart from "@/components/admin/CategoryBarChart";
import SubmissionsTimeChart from "@/components/admin/SubmissionsTimeChart";
import { getDashboardStats, CATEGORIES, isValidCategory, getCategoryLabel } from "@/lib/leads";
import { LEAD_STATUSES, isValidLeadStatus } from "@/lib/lead-status";

function toDateInputValue(d: Date) {
  return d.toISOString().slice(0, 10);
}

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of form submissions across all categories.</p>
      </div>

      <Card>
        <CardContent>
          <form className="flex flex-wrap items-end gap-4" method="GET">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className="text-xs font-medium text-muted-foreground">Category</label>
              <select id="category" name="category" defaultValue={category ?? ""} className="h-8 rounded-lg border border-input bg-background px-2 text-sm">
                <option value="">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-xs font-medium text-muted-foreground">Status</label>
              <select id="status" name="status" defaultValue={status ?? ""} className="h-8 rounded-lg border border-input bg-background px-2 text-sm">
                <option value="">All statuses</option>
                {LEAD_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dateFrom" className="text-xs font-medium text-muted-foreground">From</label>
              <input id="dateFrom" name="dateFrom" type="date" defaultValue={toDateInputValue(dateFrom)} className="h-8 rounded-lg border border-input bg-background px-2 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="dateTo" className="text-xs font-medium text-muted-foreground">To</label>
              <input id="dateTo" name="dateTo" type="date" defaultValue={toDateInputValue(dateTo)} className="h-8 rounded-lg border border-input bg-background px-2 text-sm" />
            </div>
            <Button type="submit" size="sm">Apply</Button>
            {hasActiveFilters && (
              <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>Reset</Link>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent><p className="text-2xl font-bold">{stats.totalOverall}</p></CardContent>
        </Card>
        {LEAD_STATUSES.map((s) => (
          <Card key={s.value}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-2xl font-bold">{stats.byStatus[s.value] ?? 0}</p></CardContent>
          </Card>
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
              className="flex items-center justify-between gap-4 rounded-lg border border-border/60 p-3 text-sm hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{lead.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {getCategoryLabel(lead.category)} · {new Date(lead.createdAt).toLocaleString()}
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
