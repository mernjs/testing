import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchPortalUsers } from "@/lib/admin/portal-users";
import { isPortalRole } from "@/lib/portal-roles";
import PortalUsersFilterBar from "./PortalUsersFilterBar";
import PortalUsersGrid, { type AdminPortalUserRow } from "./PortalUsersGrid";

function linkedRecordHref(row: { role: string; applicationId: string | null; studentId: string | null; clientId: string | null }): string | null {
  if (row.role === "job_applicant" && row.applicationId) return `/lms/careers/applicants/${row.applicationId}`;
  if ((row.role === "intern" || row.role === "trainee") && row.studentId) return `/tms/students/${row.studentId}`;
  if (row.role === "client" && row.clientId) return `/pms/clients/${row.clientId}`;
  return null;
}

export default async function AdminPortalUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const role = sp.role && isPortalRole(sp.role) ? sp.role : undefined;
  const status = sp.status === "active" || sp.status === "suspended" ? sp.status : undefined;
  const sortBy =
    sp.sortBy === "displayName" || sp.sortBy === "lastLoginAt" || sp.sortBy === "role" || sp.sortBy === "status"
      ? sp.sortBy
      : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await searchPortalUsers({
    page,
    pageSize: 20,
    search: sp.search,
    role,
    status,
    sortBy,
    sortDir,
  });

  const rows: AdminPortalUserRow[] = items.map((u) => ({ ...u, linkedRecordHref: linkedRecordHref(u) }));

  const hasActiveFilters = Boolean(sp.search || sp.role || sp.status);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Portal" }, { label: "Users" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">External Portal Users</h1>
        <p className="text-sm text-muted-foreground">
          {total} account{total === 1 ? "" : "s"}. Active Sessions counts real, unexpired logins; Notifications
          counts real unread portal notifications. No delete here — an external login is tied to a real
          applicant/student/client record, so Suspend is the control, not removal.
        </p>
      </div>

      <PortalUsersGrid
        rows={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        filters={
          <PortalUsersFilterBar
            initialSearch={sp.search ?? ""}
            initialRole={role ?? ""}
            initialStatus={status ?? ""}
          />
        }
      />
    </div>
  );
}
