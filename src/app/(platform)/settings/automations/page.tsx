import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { getDb } from "@/lib/mongodb";
import { ROLE_GROUPS } from "@/lib/admin/role-catalog";
import { listWorkflows } from "@/lib/platform/workflows";
import { MAX_WORKFLOWS_PER_COMPANY } from "@/lib/platform/workflows/shared";
import AutomationsManager from "@/components/platform/automations/AutomationsManager";

export const metadata: Metadata = { title: "Automations", robots: { index: false, follow: false } };

export default async function AutomationsSettingsPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");

  const [workflows, people] = await Promise.all([
    listWorkflows(),
    (await getDb()).collection<{ email: string }>("admin_users").find({}, { projection: { email: 1 } }).sort({ email: 1 }).limit(500).toArray(),
  ]);
  const roles = [{ value: "super_admin", label: "Super Admin" }, ...ROLE_GROUPS.flatMap((g) => g.roles.map((r) => ({ value: r.value, label: `${r.label} · ${g.module}` })))];

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Company settings
        </Link>
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-xl">Automations</CardTitle>
            <CardDescription>When something happens in your workspace, notify people, send an email or call a webhook — automatically.</CardDescription>
          </CardHeader>
          <CardContent>
            <AutomationsManager initial={workflows} roles={roles} people={people.map((p) => ({ id: String(p._id), email: p.email }))} max={MAX_WORKFLOWS_PER_COMPANY} />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
