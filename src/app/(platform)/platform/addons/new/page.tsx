import type { Metadata } from "next";
import PlatformPageHeader from "@/components/platform/panel/PlatformPageHeader";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { listPlans } from "@/lib/platform/billing/plans";
import { getBillingSettings } from "@/lib/platform/billing/settings";
import { MODULES } from "@/lib/platform/onboarding/catalog";
import AddonForm from "../AddonForm";

export const metadata: Metadata = { title: "New add-on" };

export default async function NewAddonPage() {
  await requirePlatformAdmin();
  const [plans, settings] = await Promise.all([listPlans(), getBillingSettings()]);
  return (
    <div className="space-y-6 p-1">
      <PlatformPageHeader title="New add-on" crumbs={[{ label: "Billing" }, { label: "Add-ons", href: "/platform/addons" }]} />
      <AddonForm
        addon={null}
        plans={plans.map((p) => ({ id: p._id, name: p.name }))}
        modules={MODULES.filter((m) => !m.core).map((m) => ({ key: m.key, label: m.label }))}
        currency={settings.billing.currency}
      />
    </div>
  );
}
