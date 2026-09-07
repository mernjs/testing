import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import TmsSettingsForm from "@/components/tms/TmsSettingsForm";
import { getCurrentTmsUser } from "@/lib/tms-auth";
import { canManageSettings } from "@/lib/tms-roles";
import { getTmsSettings } from "@/lib/tms/settings";

export default async function TmsSettingsPage() {
  const user = await getCurrentTmsUser();
  if (!user || !canManageSettings(user.roles)) redirect("/tms");

  const settings = await getTmsSettings();

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "TMS", href: "/tms" }, { label: "Settings" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Track suggestions, currency, certificate numbering and institute identity.</p>
      </div>
      <TmsSettingsForm settings={settings} />
    </div>
  );
}
