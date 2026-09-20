import { FileText, Download } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { guardPortalPage } from "@/lib/portal/guard";
import { listPortalDocuments } from "@/lib/portal/documents";
import { PortalPageHeader } from "@/components/portal/widgets";

import { brandify } from "@/lib/brand";
export const dynamic = "force-dynamic";
export const metadata = { title: "Documents · YashOrbit Portal" };

function size(n: number | null) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

const SOURCE_LABEL: Record<string, string> = {
  staff: "Shared by YashOrbit",
  resume: "Your submission",
  project: "Project document",
};

export default async function DocumentsPage() {
  const user = await guardPortalPage();
  const docs = await listPortalDocuments(user);

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "Documents" }]} />
      <PortalPageHeader title="Documents" subtitle={`${docs.length} file${docs.length === 1 ? "" : "s"} available to you`} />

      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Your documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {docs.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No documents yet. Anything {brandify("YashOrbit")} shares with you appears here.
            </p>
          )}
          {docs.map((d) => (
            <a
              key={d.id}
              href={d.downloadHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-border/50 px-3 py-2.5 transition-colors hover:border-primary/40"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-foreground">{d.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {d.category} · {SOURCE_LABEL[d.source] ?? d.source}
                  {d.context ? ` · ${d.context}` : ""}
                  {d.size ? ` · ${size(d.size)}` : ""}
                </span>
              </span>
              <Download className="size-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </CardContent>
      </GlassCard>
    </div>
  );
}
