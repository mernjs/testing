import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import PmsSettingsForm from "@/components/pms/PmsSettingsForm";
import { getCurrentPmsUser } from "@/lib/pms-auth";
import { canManageSettings } from "@/lib/pms-roles";
import { getPmsSettings } from "@/lib/pms/settings";

export default async function PmsSettingsPage() {
  const user = await getCurrentPmsUser();
  if (!user || !canManageSettings(user.roles)) redirect("/pms");

  const settings = await getPmsSettings();

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "PMS", href: "/pms" }, { label: "Settings" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure project categories, technology suggestions and defaults.</p>
      </div>
      <PmsSettingsForm
        categories={settings.categories}
        technologySuggestions={settings.technologySuggestions}
        defaultCurrency={settings.defaultCurrency}
      />
    </div>
  );
}
