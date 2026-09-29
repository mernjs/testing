import "server-only";
import { getPlatformDb } from "@/lib/platform/tenancy/platform-db";

/**
 * Platform-wide settings (not per company), stored in `platform_settings`.
 * Only the platform owner's Super Admins can change them.
 */

export type SignupMode = "open" | "approval" | "closed";

interface SignupSettingsDoc {
  _id: "signup";
  mode: SignupMode;
  updatedAt: Date;
  updatedBy: string | null;
}

export async function getSignupMode(): Promise<SignupMode> {
  const db = await getPlatformDb();
  const doc = await db.collection<SignupSettingsDoc>("platform_settings").findOne({ _id: "signup" });
  return doc?.mode ?? "open";
}

export async function setSignupMode(mode: SignupMode, actorId: string): Promise<void> {
  const db = await getPlatformDb();
  await db.collection<SignupSettingsDoc>("platform_settings").updateOne({ _id: "signup" }, { $set: { mode, updatedAt: new Date(), updatedBy: actorId } }, { upsert: true });
}
