"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { saveBillingSettings, type PlatformBillingSettings, type SettingsResult } from "@/lib/platform/billing/settings";

export async function saveBillingSettingsAction(input: Omit<PlatformBillingSettings, "updatedAt" | "updatedBy">): Promise<SettingsResult> {
  const user = await requirePlatformAdmin();
  const str = (v: unknown) => String(v ?? "");
  const res = await saveBillingSettings(
    {
      seller: {
        legalName: str(input?.seller?.legalName),
        tradeName: str(input?.seller?.tradeName),
        gstin: str(input?.seller?.gstin),
        stateCode: str(input?.seller?.stateCode),
        address: str(input?.seller?.address),
        email: str(input?.seller?.email),
        phone: str(input?.seller?.phone),
        pan: str(input?.seller?.pan),
      },
      tax: { gstRatePercent: Number(input?.tax?.gstRatePercent), sacCode: str(input?.tax?.sacCode), pricesIncludeTax: Boolean(input?.tax?.pricesIncludeTax) },
      invoice: { prefix: str(input?.invoice?.prefix), footerNote: str(input?.invoice?.footerNote), terms: str(input?.invoice?.terms) },
      billing: {
        currency: str(input?.billing?.currency),
        defaultTrialDays: Number(input?.billing?.defaultTrialDays),
        graceDays: Number(input?.billing?.graceDays),
        trialReminderDays: Array.isArray(input?.billing?.trialReminderDays) ? input.billing.trialReminderDays.map(Number) : [],
      },
    },
    user.id,
  );
  if (res.ok) revalidatePath("/platform", "layout");
  return res;
}
