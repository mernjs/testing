import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { listCompanyDomains, MAX_CUSTOM_DOMAINS } from "@/lib/platform/domains/custom";
import DomainsManager from "@/components/platform/DomainsManager";
import { addDomainAction, removeDomainAction, setPrimaryDomainAction, verifyDomainAction } from "./actions";

export const metadata: Metadata = { title: "Domains", robots: { index: false, follow: false } };

export default async function DomainsSettingsPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");
  const domains = await listCompanyDomains();

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Company settings
        </Link>
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-xl">Domains</CardTitle>
            <CardDescription>Serve your workspace and website on your own domain. SSL certificates are issued automatically once DNS is in place.</CardDescription>
          </CardHeader>
          <CardContent>
            <DomainsManager
              initial={domains}
              maxCustom={MAX_CUSTOM_DOMAINS}
              actions={{ add: addDomainAction, verify: verifyDomainAction, makePrimary: setPrimaryDomainAction, remove: removeDomainAction }}
            />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
