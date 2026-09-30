import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { getOnboarding } from "@/lib/platform/onboarding/state";
import { getCompanyDetails } from "@/lib/hrms/company";
import { listDepartments } from "@/lib/hrms/departments";
import { listPendingInvitations } from "@/lib/platform/invitations";
import OnboardingWizard from "./OnboardingWizard";
import { getCompanyBrand, getStoredBranding } from "@/lib/platform/branding";

export const metadata: Metadata = { title: "Set up your workspace", robots: { index: false, follow: false } };

export default async function OnboardingPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");

  const [{ company, state }, details, departments, invitations, stored, brand] = await Promise.all([getOnboarding(), getCompanyDetails(), listDepartments(), listPendingInvitations(), getStoredBranding(), getCompanyBrand()]);

  return (
    <OnboardingWizard
      companyName={company.name}
      completedSteps={state.completedSteps}
      profile={{
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
      existingDepartments={departments.map((d) => ({ id: d._id, name: d.name }))}
      invitations={invitations.map((i) => ({ id: i._id, email: i.email, name: i.name, preset: i.preset }))}
      enabledModules={company.enabledModules ?? null}
      timezones={Intl.supportedValuesOf("timeZone")}
      branding={{ ...stored, namePrimary: stored.namePrimary ?? brand.namePrimary, nameAccent: stored.nameAccent ?? brand.nameAccent }}
    />
  );
}
