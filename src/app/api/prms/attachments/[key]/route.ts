import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentPrmsUser } from "@/lib/prms-auth";
import { readAttachmentStream } from "@/lib/prms/attachment-storage";
import { getDb } from "@/lib/mongodb";

type Context = { params: Promise<{ key: string }> };

/**
 * Authed streamer for PRMS attachments in `uploads/prms-attachments/`. Any
 * signed-in PRMS user may fetch a file that is referenced by a requisition they
 * can see (their own, or any if they hold a staff role).
 */
export async function GET(_req: NextRequest, { params }: Context) {
  const user = await getCurrentPrmsUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { key } = await params;

  const db = await getDb();
  const req = await db
    .collection<{ requestedBy?: { userId?: string }; attachments?: { storageKey: string; filename: string; contentType: string }[] }>(
      "prms_requisitions"
    )
    .findOne({ "attachments.storageKey": key, deletedAt: null });

  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isStaff = ["super_admin", "prms_admin", "procurement_manager", "finance", "dept_manager"].some((r) =>
    user.roles.includes(r as (typeof user.roles)[number])
  );
  if (!isStaff && req.requestedBy?.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const meta = req.attachments?.find((a) => a.storageKey === key);
  const nodeStream = readAttachmentStream(key);
  if (!nodeStream) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": meta?.contentType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${encodeURIComponent(meta?.filename ?? key)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
