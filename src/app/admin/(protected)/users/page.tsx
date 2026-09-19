import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { requireAdminUser } from "@/lib/admin-auth";
import { searchAdminUsers, type AdminUserRow } from "@/lib/admin/admin-users";
import { ALL_KNOWN_ROLES } from "@/lib/admin/role-catalog";
import { Badge } from "@/components/ui/badge";
import UsersFilterBar from "./UsersFilterBar";
import UsersGrid from "./UsersGrid";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    panel?: string;
    status?: "active" | "deactivated";
    userType?: "employee" | "contractor" | "partner" | "system";
    sortBy?: string;
    sortDir?: string;
  }>;
}) {
  const admin = await requireAdminUser();
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const role = sp.role && ALL_KNOWN_ROLES.includes(sp.role) ? sp.role : undefined;
  const panel = sp.panel ?? undefined;
  const status = sp.status === "active" || sp.status === "deactivated" ? sp.status : undefined;
  const userType = sp.userType;
  const sortBy = sp.sortBy === "email" || sp.sortBy === "lastLoginAt" ? sp.sortBy : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, activeCount, deactivatedCount, totalPages } = await searchAdminUsers({
    page,
    pageSize: 20,
    search: sp.search,
    role,
    panel,
    status,
    userType,
    sortBy,
    sortDir,
  });

  const rows: AdminUserRow[] = items;
  const hasActiveFilters = Boolean(sp.search || role || panel || status || userType);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Centralized User & Access Management" }]} />
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Centralized User &amp; Role Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete identity control &amp; panel-wise user roster across all 10 platform panels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-xs gap-1.5 bg-card">
            <span className="font-semibold text-foreground">{total}</span> accounts shown
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-xs gap-1.5 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <span className="font-semibold">{activeCount}</span> Active
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-xs gap-1.5 bg-rose-500/10 text-rose-600 border-rose-500/20">
            <span className="font-semibold">{deactivatedCount}</span> Deactivated
          </Badge>
        </div>
      </div>

      <UsersGrid
        rows={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        currentAdminId={admin.id}
        filters={
          <UsersFilterBar
            initialSearch={sp.search ?? ""}
            initialRole={role ?? ""}
            initialPanel={panel ?? ""}
            initialStatus={status ?? ""}
            initialUserType={userType ?? ""}
          />
        }
      />
    </div>
  );
}
