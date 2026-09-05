import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { isOpenAIConfigured } from "@/lib/openai";
import { addPdf, replacePdf, validateKbFile } from "@/lib/kb-pdf";

// Uploading + indexing a document can take a while.
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isOpenAIConfigured()) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Request must be multipart form data." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "A file is required." }, { status: 422 });
  }
  const fileError = validateKbFile(file);
  if (fileError) return NextResponse.json({ error: fileError }, { status: 422 });

  const replaceId = formData.get("replaceId");
  const title = typeof formData.get("title") === "string" ? String(formData.get("title")).trim() : "";

  try {
    if (typeof replaceId === "string" && replaceId) {
      const ok = await replacePdf(replaceId, file, admin.email);
      if (!ok) return NextResponse.json({ error: "Document to replace was not found." }, { status: 404 });
      return NextResponse.json({ ok: true, id: replaceId });
    }
    const id = await addPdf(file, title || file.name, admin.email);
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error("KB pdf upload failed", err);
    return NextResponse.json({ error: "Failed to index the document. Please try again." }, { status: 500 });
  }
}
