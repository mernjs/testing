import { Readable } from "node:stream";
import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/api-auth";
import { getApplication, openResumeDownloadStream } from "@/lib/career-applications";

type Context = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Context) {
  if (!(await isAuthorizedAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const application = await getApplication(id);
  if (!application || !application.resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  const downloadStream = openResumeDownloadStream(application.resume.storageKey);
  const webStream = Readable.toWeb(downloadStream) as ReadableStream<Uint8Array>;

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": application.resume.contentType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(application.resume.filename)}"`,
      "Content-Length": String(application.resume.size),
    },
  });
}
