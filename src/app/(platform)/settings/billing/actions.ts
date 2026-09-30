"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { currentCompanyId } from "@/lib/platform/tenancy/context";
import {
  cancelSubscription,
  changePlan,
  confirmCheckout,
  resumeSubscription,
  saveBillingDetails,
  startCheckout,
  type BillingActionResult,
  type CheckoutResponse,
  type StartCheckoutResult,
} from "@/lib/platform/billing/subscriptions";
import type { BillingDetails, BillingDetailsErrors } from "@/lib/platform/billing/billing-details";
import type { BillingInterval } from "@/lib/platform/billing/types";

/** Super Admins of this company only — re-checked in every action. */
async function requireOwner(): Promise<string> {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");
  return currentCompanyId();
}

function done<T extends { ok: boolean }>(res: T): T {
  if (res.ok) revalidatePath("/settings/billing");
  return res;
}

export async function saveBillingDetailsAction(input: Partial<BillingDetails>): Promise<{ ok: true; details: BillingDetails } | { ok: false; errors: BillingDetailsErrors }> {
  const companyId = await requireOwner();
  return done(
    await saveBillingDetails(companyId, {
      legalName: input?.legalName,
      gstin: input?.gstin,
      address: input?.address,
      state: input?.state,
      email: input?.email,
    }),
  );
}

export async function startCheckoutAction(planId: string, interval: BillingInterval): Promise<StartCheckoutResult> {
  const companyId = await requireOwner();
  return startCheckout(companyId, { planId: String(planId ?? ""), interval });
}

export async function confirmCheckoutAction(response: CheckoutResponse): Promise<BillingActionResult> {
  const companyId = await requireOwner();
  return done(await confirmCheckout(companyId, response));
}

export async function changePlanAction(planId: string, interval: BillingInterval): Promise<BillingActionResult> {
  const companyId = await requireOwner();
  return done(await changePlan(companyId, { planId: String(planId ?? ""), interval }));
}

export async function cancelSubscriptionAction(when: "period_end" | "now"): Promise<BillingActionResult> {
  const companyId = await requireOwner();
  return done(await cancelSubscription(companyId, { when: when === "now" ? "now" : "period_end" }));
}

export async function resumeSubscriptionAction(): Promise<StartCheckoutResult> {
  const companyId = await requireOwner();
  return resumeSubscription(companyId);
}
