import type { Metadata } from "next";
import PlatformPageHeader from "@/components/platform/panel/PlatformPageHeader";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { getBillingSettings } from "@/lib/platform/billing/settings";
import PlanForm from "../PlanForm";
import { emptyPlanForm } from "../planForm";

export const metadata: Metadata = { title: "New plan" };

export default async function NewPlanPage() {
  await requirePlatformAdmin();
  const { billing } = await getBillingSettings();
  return (
    <div className="space-y-6 p-1">
      <PlatformPageHeader title="New plan" description="Add a plan companies can subscribe to." crumbs={[{ label: "Plans & pricing", href: "/platform/plans" }]} />
      <div className="max-w-4xl">
        <PlanForm mode="create" initial={emptyPlanForm(billing.currency)} platformTrialDays={billing.defaultTrialDays} />
      </div>
    </div>
  );
}
