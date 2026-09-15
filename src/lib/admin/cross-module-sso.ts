import "server-only";
import type { ObjectId } from "mongodb";
import { createHrmsSession, setHrmsSessionCookie } from "@/lib/hrms-auth";
import { createPmsSession, setPmsSessionCookie } from "@/lib/pms-auth";
import { createPrmsSession, setPrmsSessionCookie } from "@/lib/prms-auth";
import { createTmsSession, setTmsSessionCookie } from "@/lib/tms-auth";
import { createMessengerSession, setMessengerSessionCookie } from "@/lib/messenger-auth";
import { createLmsSession, setSessionCookie as setLmsSessionCookie } from "@/lib/lms-auth";

/**
 * Mints a REAL session — and sets that module's own cookie — in every
 * internal panel for a just-authenticated super_admin, so an "Open in X" deep
 * link or direct navigation to any panel works without a second login.
 *
 * Only ever call this after `admin-auth.ts` has already confirmed the account
 * holds `super_admin` (the only role `/admin` accepts at all — see
 * `admin-roles.ts`). `super_admin` is a universal literal every module's own
 * role file already treats as full access, so a session minted here behaves
 * exactly like signing into that module directly — same session collection,
 * same TTL, same per-request revalidation. This is NOT a shared cookie or a
 * synthetic user — every module keeps deciding access from its own session
 * store, independently, exactly as before.
 *
 * All 6 panels sharing the `admin_users` identity store are included. The
 * External Portal is deliberately excluded — it's a separate identity store
 * (`external_users`, not `admin_users`) keyed to individual client/student/
 * applicant records; there's no single "become the super_admin" account to
 * sign into there.
 */
export async function provisionCrossModuleSessions(adminId: ObjectId): Promise<void> {
  await Promise.all([
    createHrmsSession(adminId).then(setHrmsSessionCookie),
    createPmsSession(adminId).then(setPmsSessionCookie),
    createPrmsSession(adminId).then(setPrmsSessionCookie),
    createTmsSession(adminId).then(setTmsSessionCookie),
    createMessengerSession(adminId).then(setMessengerSessionCookie),
    createLmsSession(adminId).then(setLmsSessionCookie),
  ]);
}
