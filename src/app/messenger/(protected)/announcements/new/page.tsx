import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import AnnouncementComposer from "@/components/messenger/AnnouncementComposer";
import { getCurrentChatUser } from "@/lib/messenger-auth";
import { canPostAnnouncements } from "@/lib/messenger-roles";
import { getAudienceOptions } from "@/lib/messenger/announcement-audience";

export const dynamic = "force-dynamic";

export default async function NewAnnouncementPage() {
  const user = await getCurrentChatUser();
  if (!user) return null;
  if (!canPostAnnouncements(user.roles)) redirect("/messenger/announcements");

  const opts = await getAudienceOptions(user.id);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <Breadcrumbs
          items={[
            { label: "Messenger", href: "/messenger" },
            { label: "Announcements", href: "/messenger/announcements" },
            { label: "New" },
          ]}
        />
        <AnnouncementComposer {...opts} />
      </div>
    </div>
  );
}
