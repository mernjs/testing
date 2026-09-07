import Link from "next/link";
import { Bell } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import MarkAllReadButton from "@/components/tms/MarkAllReadButton";
import { getCurrentTmsUser } from "@/lib/tms-auth";
import { listNotifications, unreadCount } from "@/lib/tms/notifications";
import { formatDateTime } from "@/lib/utils";

export default async function NotificationsPage() {
  const user = await getCurrentTmsUser();
  if (!user) return null;

  const [items, unread] = await Promise.all([listNotifications(user.id, 100), unreadCount(user.id)]);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "TMS", href: "/tms" }, { label: "Notifications" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread of {items.length}.</p>
        </div>
        {unread > 0 && <MarkAllReadButton />}
      </div>

      <GlassCard interactive={false}>
        <CardContent className="divide-y divide-border/60 p-0">
          {items.length === 0 && (
            <p className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">
              <Bell className="size-6" />
              Nothing yet.
            </p>
          )}
          {items.map((n) => {
            const inner = (
              <div className={`flex items-start gap-3 px-4 py-3 text-sm ${n.read ? "" : "bg-primary/5"}`}>
                <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-primary"}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                  <p className="mt-0.5 text-[11px] text-muted-foreground/80">{formatDateTime(n.createdAt)}</p>
                </div>
              </div>
            );
            return n.link ? (
              <Link key={n._id} href={n.link} className="block transition-colors hover:bg-muted/40">{inner}</Link>
            ) : (
              <div key={n._id}>{inner}</div>
            );
          })}
        </CardContent>
      </GlassCard>
    </div>
  );
}
