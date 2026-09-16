import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { hasAdminAccess } from "@/lib/admin-roles";
import { exportPortalUsers } from "@/lib/admin/portal-users";
import { isPortalRole, PORTAL_ROLE_META } from "@/lib/portal-roles";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasAdminAccess(admin.roles)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sp = req.nextUrl.searchParams;
  const search = sp.get("search") ?? undefined;
  const role = sp.get("role");
  const status = sp.get("status");
  const idsParam = sp.get("ids");
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : undefined;

  const rows = await exportPortalUsers({
    search,
    role: role && isPortalRole(role) ? role : undefined,
    status: status === "active" || status === "suspended" ? status : undefined,
    ids,
  });

  const csv = toCsv(rows, [
    { header: "Name", value: (r) => r.displayName },
    { header: "Email", value: (r) => r.email },
    { header: "Phone", value: (r) => r.phone },
    { header: "Role", value: (r) => PORTAL_ROLE_META[r.role].label },
    { header: "Status", value: (r) => r.status },
    { header: "Last Login", value: (r) => (r.lastLoginAt ? r.lastLoginAt.toISOString() : "") },
    { header: "Created At", value: (r) => r.createdAt.toISOString() },
  ]);

  const filename = `admin-portal-users-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
