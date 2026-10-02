import { getCurrentHubUser } from "@/lib/hub-auth";
import PanelBackLink from "@/components/hub/PanelBackLink";

/**
 * "Back to Workspace" bar under a panel's header. Panels open in the same tab from the Workspace, so this is the
 * way home. Shown only to people signed in to the Workspace (panels also serve people who never see it).
 */
export default async function PanelBackBar() {
  let user = null;
  try {
    user = await getCurrentHubUser();
  } catch {
    return null;
  }
  if (!user) return null;
  return <PanelBackLink />;
}
