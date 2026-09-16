import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { hasAdminAccess } from "@/lib/admin-roles";
import { exportRfqs } from "@/lib/prms/rfqs";
import { getRfqStatusMeta, isValidRfqStatus } from "@/lib/prms/constants";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasAdminAccess(admin.roles)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const idsParam = sp.get("ids");
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : undefined;

  const rows = await exportRfqs({
    search: sp.get("search") ?? undefined,
    status: status && isValidRfqStatus(status) ? status : undefined,
    ids,
  });

  const csv = toCsv(rows, [
    { header: "RFQ Code", value: (r) => r.rfqCode },
    { header: "Title", value: (r) => r.title },
    { header: "Department", value: (r) => r.departmentName ?? "" },
    { header: "Status", value: (r) => getRfqStatusMeta(r.status).label },
    { header: "Vendors Invited", value: (r) => String(r.vendorIds.length) },
    { header: "Quotes Received", value: (r) => String(r.quotations.length) },
    { header: "Awarded Vendor", value: (r) => r.awardedVendorId ?? "" },
    { header: "Created", value: (r) => new Date(r.createdAt).toISOString() },
  ]);

  const filename = `admin-prms-rfqs-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
