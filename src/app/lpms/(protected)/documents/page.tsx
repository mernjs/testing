import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Clock, CheckCircle, Archive, AlertCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewer } from "@/lib/lpms/viewer";
import { lpmsCan } from "@/lib/lpms-roles";
import { listDocuments } from "@/lib/lpms/documents";
import { LPMS_STATUSES } from "@/lib/lpms/constants";

const statusIcon: Record<string, React.ReactNode> = {
  draft: <Clock className="size-3.5 text-muted-foreground" />,
  review: <AlertCircle className="size-3.5 text-amber-500" />,
  pending_approval: <AlertCircle className="size-3.5 text-orange-500" />,
  approved: <CheckCircle className="size-3.5 text-blue-500" />,
  published: <CheckCircle className="size-3.5 text-green-500" />,
  active: <CheckCircle className="size-3.5 text-emerald-500" />,
  archived: <Archive className="size-3.5 text-muted-foreground" />,
};

export default async function LpmsDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/lpms/login");

  const sp = await searchParams;
  const ctx = { roles: viewer.roles, permissionOverrides: viewer.overrides };
  const canCreate = lpmsCan(ctx, "CREATE");

  const { items, total } = await listDocuments(
    {
      status: sp.status,
      search: sp.search,
      page: sp.page ? parseInt(sp.page) : 1,
      pageSize: 25,
    },
    viewer
  );

  const statusMeta = Object.fromEntries(LPMS_STATUSES.map((s) => [s.value, s]));

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "LPMS", href: "/lpms" }, { label: "Document Library" }]} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Document Library
          </h1>
          <p className="text-sm text-muted-foreground">
            {total} document{total !== 1 ? "s" : ""} in your workspace
          </p>
        </div>
        {canCreate && (
          <Link href="/lpms/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-3.5" />
            New Document
          </Link>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/lpms/documents"
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !sp.status ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </Link>
        {LPMS_STATUSES.map((s) => (
          <Link
            key={s.value}
            href={`/lpms/documents?status=${s.value}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              sp.status === s.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <GlassCard interactive={false}>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <FileText className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No documents found.</p>
              {canCreate && (
                <Link href="/lpms/new" className={buttonVariants({ size: "sm", variant: "outline" })}>
                  <Plus className="size-3.5" />
                  Create your first document
                </Link>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {items.map((doc: any) => {
                const meta = statusMeta[doc.status];
                return (
                  <li key={doc.id}>
                    <Link
                      href={`/lpms/documents/${doc.id}`}
                      className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-primary/5"
                    >
                      <FileText className="size-5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{doc.documentNumber}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {statusIcon[doc.status]}
                        <span className={`text-xs font-medium ${meta?.dotClass ?? "text-muted-foreground"}`}>
                          {meta?.label ?? doc.status}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}
