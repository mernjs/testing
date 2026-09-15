import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchDocuments, DOCUMENT_MODULES, type DocumentModule } from "@/lib/admin/documents";
import DocumentsFilterBar from "./DocumentsFilterBar";
import DocumentsGrid from "./DocumentsGrid";

export default async function AdminDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; module?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const moduleFilter = (DOCUMENT_MODULES as readonly string[]).includes(sp.module ?? "")
    ? (sp.module as DocumentModule)
    : undefined;

  const { items, total, totalPages } = await searchDocuments({
    page,
    pageSize: 20,
    search: sp.search,
    module: moduleFilter,
  });

  const hasActiveFilters = Boolean(sp.search || moduleFilter);

  const exportParams = new URLSearchParams();
  if (sp.search) exportParams.set("search", sp.search);
  if (moduleFilter) exportParams.set("module", moduleFilter);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Documents" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Documents</h1>
        <p className="text-sm text-muted-foreground">
          {total} document{total === 1 ? "" : "s"} across Project Management, HRMS, and the External Portal.
        </p>
      </div>

      <DocumentsGrid
        rows={items}
        total={total}
        page={page}
        totalPages={totalPages}
        hasActiveFilters={hasActiveFilters}
        exportHref={`/api/admin/documents/export?${exportParams.toString()}`}
        filters={<DocumentsFilterBar initialSearch={sp.search ?? ""} initialModule={moduleFilter ?? ""} />}
      />
    </div>
  );
}
