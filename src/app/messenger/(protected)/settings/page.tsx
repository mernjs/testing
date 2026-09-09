import Breadcrumbs from "@/components/lms/Breadcrumbs";
import SettingsForm from "@/components/messenger/SettingsForm";
import { getCurrentChatUser } from "@/lib/messenger-auth";
import { getChatUser } from "@/lib/messenger/users";

export const dynamic = "force-dynamic";

export default async function MessengerSettingsPage() {
  const user = await getCurrentChatUser();
  if (!user) return null;
  const profile = await getChatUser(user.id);

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-xl space-y-4">
        <Breadcrumbs items={[{ label: "Messenger", href: "/messenger" }, { label: "Settings" }]} />
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Settings</h1>
        <SettingsForm
          displayName={profile?.displayName ?? user.displayName}
          email={user.email}
          soundEnabled={profile?.soundEnabled ?? true}
          presenceDefault={profile?.presenceDefault ?? "online"}
        />
      </div>
    </div>
  );
}
