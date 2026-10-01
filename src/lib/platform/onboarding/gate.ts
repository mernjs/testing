/**
 * Where a signed-in person goes first. Pure (no server imports) so the rule is
 * testable and the same everywhere it is applied.
 *
 *  - The company OWNER (a Super Admin of a customer company) whose setup is
 *    neither finished nor skipped is sent to the wizard (`/workspace/onboarding`)
 *    when they open the Workspace home (`/workspace`) — the first Workspace
 *    experience after sign-up, approval or sign-in.
 *  - Nobody else is ever sent there: an invited employee goes straight to the
 *    dashboard; the platform owner's own company has no setup.
 *  - Only the exact home path is gated. A deep link (`/workspace/crm/leads`,
 *    `/workspace/settings/billing`, …) is never intercepted — the Workspace
 *    shows a "finish setting up" banner there instead — and the wizard itself
 *    (`/workspace/onboarding`) never redirects an owner anywhere, so no loop is
 *    possible: Skip / Finish write `dismissedAt` / `completedAt`, which this
 *    rule reads.
 */
export const ONBOARDING_PATH = "/workspace/onboarding";
export const WORKSPACE_HOME = "/workspace";

export interface OnboardingGateInput {
  /** Path being opened (no query string). */
  pathname: string;
  /** `super_admin` of the company. */
  isOwner: boolean;
  isPlatformOwnerCompany: boolean;
  state: { completedAt: Date | null; dismissedAt: Date | null };
}

/** Whether setup is still open for this company (neither completed nor skipped). */
export function setupIsOpen(input: Pick<OnboardingGateInput, "isOwner" | "isPlatformOwnerCompany" | "state">): boolean {
  return input.isOwner && !input.isPlatformOwnerCompany && !input.state.completedAt && !input.state.dismissedAt;
}

/** The redirect target for this request, or `null` to render the page. */
export function onboardingGateTarget(input: OnboardingGateInput): string | null {
  const path = input.pathname.length > 1 ? input.pathname.replace(/\/+$/, "") : input.pathname;
  if (path !== WORKSPACE_HOME) return null;
  return setupIsOpen(input) ? ONBOARDING_PATH : null;
}

/** Who counts as the company's owner for setup purposes: a Super Admin (invited teammates with other roles never do). */
export function isOnboardingOwner(roles: readonly string[]): boolean {
  return roles.includes("super_admin");
}
