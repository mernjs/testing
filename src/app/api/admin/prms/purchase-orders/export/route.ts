import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { hasAdminAccess } from "@/lib/admin-roles";
import { exportPurchaseOrders } from "@/lib/prms/purchase-orders";
import { getPoStatusMeta, isValidPoStatus } from "@/lib/prms/constants";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasAdminAccess(admin.roles)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const idsParam = sp.get("ids");
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : undefined;

  const rows = await exportPurchaseOrders({
    search: sp.get("search") ?? undefined,
    status: status && isValidPoStatus(status) ? status : undefined,
    ids,
  });

  const csv = toCsv(rows, [
    { header: "PO Number", value: (r) => r.poNumber },
    { header: "Vendor", value: (r) => r.vendorName },
    { header: "Status", value: (r) => getPoStatusMeta(r.status).label },
    { header: "Total Amount", value: (r) => String(r.totalAmount) },
    { header: "Currency", value: (r) => r.currency },
    { header: "Delivery Date", value: (r) => r.deliveryDate ?? "" },
    { header: "Created At", value: (r) => new Date(r.createdAt).toISOString() },
  ]);

  const filename = `admin-prms-purchase-orders-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
