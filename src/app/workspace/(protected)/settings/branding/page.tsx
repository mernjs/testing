import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { getCompanyBrand, getStoredBranding } from "@/lib/platform/branding";
import BrandingThemeForm from "@/components/platform/BrandingThemeForm";
import { listThemeOptions } from "@/lib/platform/branding/theme-options";

export const metadata: Metadata = { title: "Branding", robots: { index: false, follow: false } };

export default async function BrandingSettingsPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");
  const [stored, brand, { options: themes, activeKey, appliedKey }] = await Promise.all([getStoredBranding(), getCompanyBrand(), listThemeOptions()]);

  return (
    <div className="min-h-screen bg-muted/70 px-4 py-10 dark:bg-background">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/workspace/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Company settings
        </Link>
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-xl">Branding</CardTitle>
            <CardDescription>Your logo, name and theme — applied to your website and every panel.</CardDescription>
          </CardHeader>
          <CardContent>
            <BrandingThemeForm
              initial={{ ...stored, namePrimary: stored.namePrimary ?? brand.namePrimary, nameAccent: stored.nameAccent ?? brand.nameAccent }}
              companyName={brand.name}
              themes={themes}
              activeKey={activeKey}
              appliedKey={appliedKey}
              submitLabel="Save branding"
            />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
