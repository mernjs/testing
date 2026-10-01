import { redirect } from "next/navigation";
import WorkspaceShell from "@/components/hub/WorkspaceShell";
import { getWorkspaceNav } from "@/lib/workspace/access";

/**
 * Layout body for the company pages that live outside `/workspace`
 * (`/settings/*`, `/onboarding`, `/upgrade`): puts them inside the Workspace
 * frame. It adds no access rule — each page keeps its own check; signed out,
 * the page is rendered bare and its own check redirects to sign-in.
 */
export default async function CompanyPagesLayout({ children }: { children: React.ReactNode }) {
  const session = await getWorkspaceNav();
  if (!session) return <>{children}</>;
  // Same as the Staff Hub: a forced password change comes first.
  if (session.user.mustChangePassword) redirect("/workspace/change-password");
  return (
    <WorkspaceShell user={session.user} nav={session.nav} embedded>
      {children}
    </WorkspaceShell>
  );
}
