/** Client-safe rules for the email-verification strip (see `email-verification.ts`). */

/** The one rule: only an explicit `false` is unverified; a missing field (legacy, invited, seeded users) is verified. */
export function isEmailVerified(user: { emailVerified?: unknown; [k: string]: unknown }): boolean {
  return user.emailVerified !== false;
}

/** Whether the Workspace shows the "Verify email" strip. */
export function showVerifyStrip(f: { emailVerified: boolean; isPlatformOwnerCompany: boolean }): boolean {
  return !f.emailVerified && !f.isPlatformOwnerCompany;
}

/** The strip is hidden on the verification page itself. */
export function verifyStripHiddenOn(pathname: string): boolean {
  return pathname.startsWith("/workspace/verify-email");
}
