import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { requireWorkspaceAccess } from "@/lib/workspace/access";
import { listCompanyIntegrations } from "@/lib/workspace/company";

export const metadata: Metadata = { title: "Integrations", robots: { index: false, follow: false } };

/** What this workspace is connected to. A list only: each integration is managed on its own page. */
export default async function IntegrationsPage() {
  await requireWorkspaceAccess("company.integrations");
  const integrations = await listCompanyIntegrations();

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/workspace/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Company settings
        </Link>
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-xl">
              <h1>Integrations</h1>
            </CardTitle>
            <CardDescription>The outside services your workspace is connected to.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul id="integrations-list" className="divide-y divide-border/60">
              {integrations.map((i) => (
                <li key={i.key} data-integration={i.key} data-connected={i.connected ? "true" : "false"} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div className="min-w-0 flex-1 basis-64">
                    <p className="text-sm font-semibold">{i.name}</p>
                    <p className="text-sm text-muted-foreground">{i.description}</p>
                    <p className={`mt-1 text-xs font-medium ${i.connected ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{i.status}</p>
                  </div>
                  <Link href={i.href} className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:border-primary/40 hover:text-primary">
                    {i.connected ? "Manage" : "Set up"}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
