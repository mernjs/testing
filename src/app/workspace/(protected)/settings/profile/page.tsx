import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getOnboarding } from "@/lib/platform/onboarding/state";
import { getCompanyDetails } from "@/lib/hrms/company";
import { requireWorkspaceAccess } from "@/lib/workspace/access";
import ProfileSettings from "./ProfileSettings";

export const metadata: Metadata = { title: "Organization profile", robots: { index: false, follow: false } };

/**
 * The company's profile, editable after setup. Same data and save function as
 * step 1 of the setup wizard (`onboarding/state.ts` → `saveProfile`).
 */
export default async function OrganizationProfilePage() {
  await requireWorkspaceAccess("company.profile");
  const [{ company }, details] = await Promise.all([getOnboarding(), getCompanyDetails()]);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/workspace/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Company settings
        </Link>
        <h1 className="text-2xl font-black tracking-tight">Organization profile</h1>
        <ProfileSettings
          initial={{
            name: details.name || company.name,
            legalName: details.legalName,
            industry: company.profile?.industry ?? "",
            size: company.profile?.size ?? "",
            country: company.profile?.country ?? details.country ?? "",
            currency: company.profile?.currency ?? "INR",
            timezone: company.profile?.timezone ?? company.timezone ?? "",
            website: details.website,
            email: details.email,
            phone: details.phone,
          }}
          timezones={Intl.supportedValuesOf("timeZone")}
        />
      </div>
    </div>
  );
}
