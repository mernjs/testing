import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { hasAdminAccess } from "@/lib/admin-roles";
import { exportAssets } from "@/lib/prms/assets";
import { getAssetStatusMeta, isValidAssetStatus } from "@/lib/prms/constants";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasAdminAccess(admin.roles)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const idsParam = sp.get("ids");
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : undefined;

  const rows = await exportAssets({
    search: sp.get("search") ?? undefined,
    status: status && isValidAssetStatus(status) ? status : undefined,
    ids,
  });

  const csv = toCsv(rows, [
    { header: "Asset Code", value: (r) => r.assetCode },
    { header: "Name", value: (r) => r.name },
    { header: "Category", value: (r) => r.category },
    { header: "Status", value: (r) => getAssetStatusMeta(r.status).label },
    { header: "Assigned To", value: (r) => r.assignedEmployeeName ?? "" },
    { header: "Purchase Cost", value: (r) => String(r.purchaseCost) },
    { header: "Current Value", value: (r) => String(r.currentValue) },
    { header: "Currency", value: (r) => r.currency },
    { header: "Purchase Date", value: (r) => new Date(r.purchaseDate).toISOString().slice(0, 10) },
  ]);

  const filename = `admin-prms-assets-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
