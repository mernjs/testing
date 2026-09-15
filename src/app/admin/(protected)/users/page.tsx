import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { requireAdminUser } from "@/lib/admin-auth";
import { searchAdminUsers } from "@/lib/admin/admin-users";
import { ALL_KNOWN_ROLES } from "@/lib/admin/role-catalog";
import UsersFilterBar from "./UsersFilterBar";
import UsersGrid, { type AdminUserRow } from "./UsersGrid";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; role?: string; sortBy?: string; sortDir?: string }>;
}) {
  const admin = await requireAdminUser();
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const role = sp.role && ALL_KNOWN_ROLES.includes(sp.role) ? sp.role : undefined;
  const sortBy = sp.sortBy === "email" || sp.sortBy === "lastLoginAt" ? sp.sortBy : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await searchAdminUsers({
    page,
    pageSize: 20,
    search: sp.search,
    role,
    sortBy,
    sortDir,
  });

  const rows: AdminUserRow[] = items;
  const hasActiveFilters = Boolean(sp.search || role);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "User & Role Management" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">User &amp; Role Management</h1>
        <p className="text-sm text-muted-foreground">{total} account{total === 1 ? "" : "s"} across every module.</p>
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
        filters={<UsersFilterBar initialSearch={sp.search ?? ""} initialRole={role ?? ""} />}
      />
    </div>
  );
}
