import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchActivityLog, getActivityActions, ACTIVITY_LOG_MODULES, type ActivityLogModule } from "@/lib/admin/activity-log";
import ActivityLogFilterBar from "./ActivityLogFilterBar";
import ActivityLogGrid from "./ActivityLogGrid";

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function AdminActivityLogPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    module?: string;
    action?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const moduleFilter = (ACTIVITY_LOG_MODULES as readonly string[]).includes(sp.module ?? "")
    ? (sp.module as ActivityLogModule)
    : undefined;

  const [{ items, total, totalPages }, actions] = await Promise.all([
    searchActivityLog({
      page,
      pageSize: 25,
      search: sp.search,
      module: moduleFilter,
      action: sp.action,
      dateFrom: parseDateParam(sp.dateFrom),
      dateTo: parseDateParam(sp.dateTo, true),
    }),
    getActivityActions(),
  ]);

  const hasActiveFilters = Boolean(sp.search || moduleFilter || sp.action || sp.dateFrom || sp.dateTo);

  const exportParams = new URLSearchParams();
  if (sp.search) exportParams.set("search", sp.search);
  if (moduleFilter) exportParams.set("module", moduleFilter);
  if (sp.action) exportParams.set("action", sp.action);
  if (sp.dateFrom) exportParams.set("dateFrom", sp.dateFrom);
  if (sp.dateTo) exportParams.set("dateTo", sp.dateTo);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Activity Log" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Activity Log</h1>
        <p className="text-sm text-muted-foreground">
          {total} event{total === 1 ? "" : "s"} across Procurement, Projects, YashChat, Training, HRMS, and the External Portal.
        </p>
      </div>

      <ActivityLogGrid
        rows={items}
        total={total}
        page={page}
        totalPages={totalPages}
        hasActiveFilters={hasActiveFilters}
        exportHref={`/api/admin/activity-log/export?${exportParams.toString()}`}
        filters={
          <ActivityLogFilterBar
            initialSearch={sp.search ?? ""}
            initialModule={moduleFilter ?? ""}
            initialAction={sp.action ?? ""}
            actions={actions}
            initialDateFrom={sp.dateFrom ?? ""}
            initialDateTo={sp.dateTo ?? ""}
          />
        }
      />
    </div>
  );
}
