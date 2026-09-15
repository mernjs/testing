import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { exportDirectConversations } from "@/lib/admin/yashchat";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const rows = await exportDirectConversations({ search: sp.get("search") ?? undefined });

  const csv = toCsv(rows, [
    { header: "Participant A", value: (r) => r.participantA },
    { header: "Participant B", value: (r) => r.participantB },
    { header: "Last Message Preview", value: (r) => r.lastMessagePreview ?? "" },
    { header: "Last Message At", value: (r) => r.lastMessageAt },
    { header: "Started", value: (r) => r.createdAt },
  ]);

  const filename = `admin-yashchat-dms-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
