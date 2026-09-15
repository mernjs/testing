import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { searchDocuments, documentModuleLabel, DOCUMENT_MODULES, type DocumentModule } from "@/lib/admin/documents";
import { toCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  const admin = await getCurrentAdminUser();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = req.nextUrl.searchParams;
  const moduleParam = sp.get("module");
  const moduleFilter = (DOCUMENT_MODULES as readonly string[]).includes(moduleParam ?? "")
    ? (moduleParam as DocumentModule)
    : undefined;

  // No dedicated export cap here — pull a large single page instead of adding
  // a second code path, matching this listing's real scale (documents, not
  // high-volume transactional rows).
  const { items } = await searchDocuments({ search: sp.get("search") ?? undefined, module: moduleFilter, page: 1, pageSize: 5000 });

  const csv = toCsv(items, [
    { header: "Module", value: (r) => documentModuleLabel(r.module) },
    { header: "Title", value: (r) => r.title },
    { header: "Filename", value: (r) => r.filename },
    { header: "Category", value: (r) => r.category },
    { header: "Size (bytes)", value: (r) => String(r.size) },
    { header: "Owner", value: (r) => r.ownerLabel },
    { header: "Uploaded", value: (r) => r.createdAt },
  ]);

  const filename = `admin-documents-${new Date().toISOString().slice(0, 10)}.csv`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
