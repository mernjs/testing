import Breadcrumbs from "@/components/lms/Breadcrumbs";
import FilesHub from "@/components/messenger/FilesHub";
import { getCurrentChatUser } from "@/lib/messenger-auth";

export const dynamic = "force-dynamic";

export default async function SharedFilesPage() {
  const user = await getCurrentChatUser();
  if (!user) return null;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <Breadcrumbs items={[{ label: "Messenger", href: "/messenger" }, { label: "Shared Files" }]} />
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Shared Files</h1>
          <p className="text-sm text-muted-foreground">
            Every file shared in a channel or DM you can see — searchable and filterable.
          </p>
        </div>
        <FilesHub />
      </div>
    </div>
  );
}
