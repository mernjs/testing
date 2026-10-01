import { redirect } from "next/navigation";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { listWorkspaceNotifications } from "@/lib/workspace/notifications";
import NotificationsList from "@/components/platform/hub/NotificationsList";

/** The signed-in person's notifications from every source — see `lib/workspace/notifications.ts` (lives under the Staff Hub layout so it keeps the hub's sidebar and header). */
export default async function HubNotificationsPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  const items = await listWorkspaceNotifications(user, 100, { sweep: true });

  return (
    <div className="mx-auto max-w-3xl">
      <GlassCard interactive={false}>
        <CardHeader>
          <CardTitle className="text-xl">Notifications</CardTitle>
          <CardDescription>Updates sent to you by your workspace&apos;s automations and, for company managers, by every panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsList initial={items} />
        </CardContent>
      </GlassCard>
    </div>
  );
}
