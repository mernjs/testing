import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { PORTAL_ROLES, PORTAL_ROLE_META } from "@/lib/portal-roles";
import ImportWizard from "@/components/platform/ImportWizard";

export const metadata: Metadata = { title: "Import data", robots: { index: false, follow: false } };

export default async function ImportSettingsPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");

  return (
    <div className="min-h-screen bg-muted/70 px-4 py-10 dark:bg-background">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/workspace/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Company settings
        </Link>
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-xl"><h1>Import data</h1></CardTitle>
            <CardDescription>Bring leads, clients or employees in from a CSV file. You&apos;ll see a preview before anything is saved.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImportWizard leadTypes={PORTAL_ROLES.map((r) => ({ value: r, label: PORTAL_ROLE_META[r].label }))} />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
