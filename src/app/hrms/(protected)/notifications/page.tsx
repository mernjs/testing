import Breadcrumbs from "@/components/admin/Breadcrumbs";
import NotificationList from "@/components/hrms/NotificationList";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { listNotifications } from "@/lib/hrms/notifications";

export default async function NotificationsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = (await getCurrentHrmsUser())!;
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const { items, totalPages } = await listNotifications(user, { page, pageSize: 30 });

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "HRMS", href: "/hrms" }, { label: "Notifications" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Notifications</h1>
        <p className="text-sm text-muted-foreground">Leave requests, new joiners, document expiry, birthdays and probation reminders.</p>
      </div>

      <NotificationList
        items={items.map((n) => ({ _id: n._id, title: n.title, body: n.body, link: n.link, createdAt: n.createdAt, read: n.read }))}
        page={page}
        totalPages={totalPages}
        basePath="/hrms/notifications"
      />
    </div>
  );
}
