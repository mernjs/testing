import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import PrmsSettingsForm from "@/components/prms/PrmsSettingsForm";
import { getCurrentPrmsUser } from "@/lib/prms-auth";
import { canManageSettings } from "@/lib/prms-roles";
import { getPrmsSettings } from "@/lib/prms/settings";

export default async function PrmsSettingsPage() {
  const user = await getCurrentPrmsUser();
  if (!user || !canManageSettings(user.roles)) redirect("/prms");

  const settings = await getPrmsSettings();

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "PRMS", href: "/prms" }, { label: "Settings" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Company identity for purchase orders and invoices, requisition approval thresholds and default currency.
        </p>
      </div>
      <PrmsSettingsForm settings={JSON.parse(JSON.stringify(settings))} />
    </div>
  );
}
