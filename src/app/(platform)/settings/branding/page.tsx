import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { getCompanyBrand, getStoredBranding } from "@/lib/platform/branding";
import BrandingForm from "@/components/platform/BrandingForm";
import { saveBrandingAction, uploadLogoAction } from "./actions";

export const metadata: Metadata = { title: "Branding", robots: { index: false, follow: false } };

export default async function BrandingSettingsPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");
  const [stored, brand] = await Promise.all([getStoredBranding(), getCompanyBrand()]);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Company settings
        </Link>
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-xl">Branding</CardTitle>
            <CardDescription>Your logo, name and colour across every panel, sign-in page, email and PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <BrandingForm
              initial={{ ...stored, namePrimary: stored.namePrimary ?? brand.namePrimary, nameAccent: stored.nameAccent ?? brand.nameAccent }}
              companyName={brand.name}
              actions={{ save: saveBrandingAction, uploadLogo: uploadLogoAction }}
              submitLabel="Save branding"
            />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
