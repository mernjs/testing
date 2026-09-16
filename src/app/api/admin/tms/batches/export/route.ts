import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { hasAdminAccess } from "@/lib/admin-roles";
import { exportBatches } from "@/lib/tms/batches";
import { isValidBatchStatus, getBatchStatusMeta } from "@/lib/tms/constants";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasAdminAccess(admin.roles)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sp = req.nextUrl.searchParams;
  const status = sp.get("status");
  const idsParam = sp.get("ids");
  const ids = idsParam ? idsParam.split(",").filter(Boolean) : undefined;

  const rows = await exportBatches({
    search: sp.get("search") ?? undefined,
    status: status && isValidBatchStatus(status) ? status : undefined,
    ids,
  });

  const csv = toCsv(rows, [
    { header: "Batch Code", value: (r) => r.batchCode },
    { header: "Name", value: (r) => r.name },
    { header: "Program", value: (r) => r.programName },
    { header: "Status", value: (r) => getBatchStatusMeta(r.status).label },
    { header: "Start Date", value: (r) => r.startDate ?? "" },
    { header: "End Date", value: (r) => r.endDate ?? "" },
    { header: "Capacity", value: (r) => String(r.capacity) },
    { header: "Enrolled", value: (r) => String(r.enrolled) },
    { header: "Available Seats", value: (r) => String(r.availableSeats) },
  ]);

  const filename = `admin-tms-batches-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
