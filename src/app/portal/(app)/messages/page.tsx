import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { guardPortalPage } from "@/lib/portal/guard";
import { getActivePortalLead } from "@/lib/portal/lead";
import { PortalPageHeader } from "@/components/portal/widgets";
import EmptyPortalState from "@/components/portal/EmptyPortalState";
import PortalMessagesThread from "./PortalMessagesThread";

export const dynamic = "force-dynamic";
export const metadata = { title: "Messages · YashOrbit Portal" };

export default async function MessagesPage() {
  const user = await guardPortalPage();
  const view = await getActivePortalLead(user);
  if (!view) return <EmptyPortalState title="No messages" body="Messages from the YashOrbit team appear here." />;

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6 lg:max-w-3xl">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "Messages" }]} />
      <PortalPageHeader title="Messages" subtitle="Chat directly with your YashOrbit team" />
      <PortalMessagesThread initialMessages={view.messages} />
    </div>
  );
}
