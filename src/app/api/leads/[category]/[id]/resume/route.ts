import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/api-auth";
import { getLead, isValidCategory, openResumeDownloadStream } from "@/lib/leads";

type Context = { params: Promise<{ category: string; id: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  if (!isAuthorizedAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { category, id } = await params;
  if (!isValidCategory(category)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }

  const lead = await getLead(category, id);
  if (!lead || !lead.resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  const downloadStream = openResumeDownloadStream(lead.resume.storageKey);
  const webStream = Readable.toWeb(downloadStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": lead.resume.contentType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(lead.resume.filename)}"`,
      "Content-Length": String(lead.resume.size),
    },
  });
}
