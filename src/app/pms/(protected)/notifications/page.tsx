import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import MarkAllReadButton from "@/components/pms/MarkAllReadButton";
import { getCurrentPmsUser } from "@/lib/pms-auth";
import { listNotifications, unreadCount } from "@/lib/pms/notifications";
import { cn, formatDateTime } from "@/lib/utils";

export default async function PmsNotificationsPage() {
  const user = await getCurrentPmsUser();
  if (!user) return null;

  const [items, unread] = await Promise.all([listNotifications(user.id, 100), unreadCount(user.id)]);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "PMS", href: "/pms" }, { label: "Notifications" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unread} unread of {items.length} recent.</p>
        </div>
        {unread > 0 && <MarkAllReadButton />}
      </div>

      <GlassCard interactive={false}>
        <CardContent className="space-y-1.5 py-4">
          {items.length === 0 && <p className="text-sm text-muted-foreground">Nothing here yet.</p>}
          {items.map((n) => {
            const inner = (
              <div
                className={cn(
                  "flex items-start gap-3 rounded-lg border border-border/60 p-3 text-sm",
                  !n.read && "bg-primary/5"
                )}
              >
                <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{n.title}</p>
                  {n.body && <p className="text-muted-foreground">{n.body}</p>}
                  <p className="text-xs text-muted-foreground/80">{formatDateTime(n.createdAt)}</p>
                </div>
              </div>
            );
            return n.link ? (
              <Link key={n._id} href={n.link} className="block transition-opacity hover:opacity-90">{inner}</Link>
            ) : (
              <div key={n._id}>{inner}</div>
            );
          })}
        </CardContent>
      </GlassCard>
    </div>
  );
}
