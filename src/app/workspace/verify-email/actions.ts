"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { consumeVerification } from "@/lib/platform/email-verification";

export interface VerifyState {
  error?: string;
}

/** Works signed in or out, and only ever affects the token's own user. */
export async function verifyEmailAction(_prev: VerifyState, formData: FormData): Promise<VerifyState> {
  const result = await consumeVerification(String(formData.get("token") ?? ""));
  if (!result.ok) return { error: result.error };
  // The strip is rendered by the Workspace layout: drop its cached output.
  revalidatePath("/workspace", "layout");
  redirect("/workspace?emailVerified=1");
}
