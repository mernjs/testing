import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { hasAdminAccess } from "@/lib/admin-roles";
import { exportRequisitions } from "@/lib/prms/requisitions";
import { getRequisitionStatusMeta, isValidRequisitionStatus } from "@/lib/prms/constants";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasAdminAccess(admin.roles)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const idsParam = sp.get("ids");
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : undefined;

  const rows = await exportRequisitions({
    search: sp.get("search") ?? undefined,
    status: status && isValidRequisitionStatus(status) ? status : undefined,
    ids,
  });

  const csv = toCsv(rows, [
    { header: "PR Code", value: (r) => r.prCode },
    { header: "Item", value: (r) => r.itemName },
    { header: "Department", value: (r) => r.departmentName ?? "" },
    { header: "Project", value: (r) => r.projectName ?? "" },
    { header: "Requested By", value: (r) => r.requestedBy.name },
    { header: "Status", value: (r) => getRequisitionStatusMeta(r.status).label },
    { header: "Priority", value: (r) => r.priority },
    { header: "Quantity", value: (r) => String(r.quantity) },
    { header: "Estimated Cost", value: (r) => String(r.estimatedCost) },
    { header: "Currency", value: (r) => r.currency },
    { header: "Required Date", value: (r) => r.requiredDate ?? "" },
    { header: "Created At", value: (r) => new Date(r.createdAt).toISOString() },
  ]);

  const filename = `admin-prms-requisitions-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
