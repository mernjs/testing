"use server";

import { notFound, redirect } from "next/navigation";
import { isPlatformOwnerContext } from "@/lib/platform/tenancy/context";
import { slugFormatError } from "@/lib/platform/tenancy/provisioning";
import { reservedSlugError } from "@/lib/platform/settings";
import { confirmSignup, isSlugAvailable, startSignup, type SignupFieldErrors } from "@/lib/platform/signup";
import { clientKey, requestOrigin } from "@/lib/platform/request";

/** Sign-up lives on the platform's own site only — never on a company's workspace domain. */
async function requirePlatformSite() {
  if (!(await isPlatformOwnerContext())) notFound();
}

export async function checkSlugAction(slug: string): Promise<{ available: boolean; message: string | null }> {
  await requirePlatformSite();
  const s = slug.trim().toLowerCase();
  const formatError = slugFormatError(s) ?? (await reservedSlugError(s));
  if (formatError) return { available: false, message: formatError };
  return (await isSlugAvailable(s)) ? { available: true, message: null } : { available: false, message: "That address is taken." };
}

export interface SignupState {
  errors?: SignupFieldErrors;
  sentTo?: string;
  /** What was submitted (never the password), so a rejected form keeps the user's typing. */
  values?: { name: string; email: string };
}

export async function startSignupAction(_prev: SignupState, formData: FormData): Promise<SignupState> {
  await requirePlatformSite();
  const field = (k: string) => String(formData.get(k) ?? "");
  const { origin } = await requestOrigin();
  const result = await startSignup(
    {
      companyName: field("companyName"),
      slug: field("slug").trim().toLowerCase(),
      name: field("name"),
      email: field("email"),
      password: field("password"),
      acceptTerms: formData.get("acceptTerms") === "on",
    },
    { origin, clientKey: await clientKey() },
  );
  return result.ok ? { sentTo: result.email } : { errors: result.errors, values: { name: field("name"), email: field("email") } };
}

export interface ConfirmState {
  error?: string;
  awaitingApproval?: boolean;
}

export async function confirmSignupAction(_prev: ConfirmState, formData: FormData): Promise<ConfirmState> {
  await requirePlatformSite();
  const { host } = await requestOrigin();
  const result = await confirmSignup(String(formData.get("token") ?? ""), { hostHint: host });
  if (!result.ok) return { error: result.error };
  if ("awaitingApproval" in result) return { awaitingApproval: true };
  redirect(result.redirectTo);
}
