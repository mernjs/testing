"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { setSignupMode } from "@/lib/platform/settings";
import { approveSignup, rejectSignup } from "@/lib/platform/signup";
import { requestOrigin } from "@/lib/platform/request";

export type ActionResult = { ok: true; message: string } | { ok: false; error: string };

export async function setSignupModeAction(mode: string): Promise<ActionResult> {
  const user = await requirePlatformAdmin();
  if (mode !== "open" && mode !== "approval" && mode !== "closed") return { ok: false, error: "Unknown sign-up mode." };
  await setSignupMode(mode, user.id);
  revalidatePath("/platform", "layout");
  return { ok: true, message: "Sign-up mode saved." };
}

export async function approveSignupAction(id: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  const { host } = await requestOrigin();
  const res = await approveSignup(String(id), { hostHint: host });
  revalidatePath("/platform", "layout");
  if (!res.ok) return res;
  return { ok: true, message: res.emailed ? `Approved — ${res.host} is live and the owner has been emailed a sign-in link.` : `Approved — ${res.host} is live, but the email to the owner failed. Send them the address yourself.` };
}

export async function rejectSignupAction(id: string): Promise<ActionResult> {
  await requirePlatformAdmin();
  const res = await rejectSignup(String(id));
  revalidatePath("/platform", "layout");
  if (!res.ok) return res;
  return { ok: true, message: res.emailed ? "Rejected — the person has been told by email." : "Rejected, but the email to the person failed." };
}
