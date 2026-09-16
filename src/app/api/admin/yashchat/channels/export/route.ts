import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { hasAdminAccess } from "@/lib/admin-roles";
import { exportChannels } from "@/lib/admin/yashchat";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasAdminAccess(admin.roles)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const sp = req.nextUrl.searchParams;
  const idsParam = sp.get("ids");
  const rows = await exportChannels({
    search: sp.get("search") ?? undefined,
    kind: sp.get("kind") ?? undefined,
    archived: sp.get("archived") === "true" ? true : sp.get("archived") === "false" ? false : undefined,
    ids: idsParam ? idsParam.split(",").filter(Boolean) : undefined,
  });

  const csv = toCsv(rows, [
    { header: "Name", value: (r) => r.name },
    { header: "Kind", value: (r) => r.kind },
    { header: "Visibility", value: (r) => r.visibility },
    { header: "Members", value: (r) => String(r.memberCount) },
    { header: "Archived", value: (r) => (r.archived ? "Yes" : "No") },
    { header: "Last Activity", value: (r) => r.lastActivityAt },
    { header: "Created", value: (r) => r.createdAt },
  ]);

  const filename = `admin-yashchat-channels-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
