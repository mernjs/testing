"use server";

import { getCurrentLmsUser } from "@/lib/lms-auth";
import { createPortalSession, setPortalSessionCookie, externalUsers } from "@/lib/portal-auth";
import { setActivePortalLead } from "@/lib/portal/lead";

/**
 * Impersonation server action — mints a real portal_session for the given
 * external user and drops the portal_session cookie in the current browser,
 * so the LMS admin is immediately signed in as that portal user.
 *
 * Security:
 *  - Requires a valid LMS session (`getCurrentLmsUser`). Unauthenticated
 *    callers get { ok: false, error: "Unauthorized" }.
 *  - Only active accounts can be impersonated. Suspended accounts are blocked.
 *  - If leadId is passed, sets activeLeadId and account role to match that lead.
 *  - The minted session is a normal 12-hour portal session (no "remember me"),
 *    identical in shape to what the portal login page creates.
 *  - No existing portal session is invalidated — the new cookie simply
 *    overwrites any prior portal_session cookie in the browser.
 */
export async function loginAsPortalUserAction(
  externalUserId: string,
  leadId?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  // 1. Guard — must be a signed-in LMS user.
  const lmsUser = await getCurrentLmsUser();
  if (!lmsUser) return { ok: false, error: "Unauthorized" };

  // 2. Resolve the external user.
  const col = await externalUsers();
  const user = await col.findOne({ _id: externalUserId });

  if (!user) return { ok: false, error: "Portal account not found." };
  if (user.status === "suspended") {
    return { ok: false, error: "This portal account is suspended and cannot be accessed." };
  }

  // 3. If a target lead is specified, set it as active lead & align user role to match.
  if (leadId) {
    await setActivePortalLead(user._id, leadId);
  }

  // 4. Mint a real portal session (12 h, no remember-me) and set the cookie.
  const { token } = await createPortalSession(user._id, false);
  await setPortalSessionCookie(token, false);

  return { ok: true };
}
