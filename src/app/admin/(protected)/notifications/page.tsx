import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import MarkAllReadButton from "@/components/admin/MarkAllReadButton";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { getAdminNotifications, type NotificationPriority } from "@/lib/admin/notifications";
import { cn, formatDateTime } from "@/lib/utils";

const PRIORITY_BADGE: Record<NotificationPriority, string> = {
  high: "bg-destructive/15 text-destructive",
  medium: "bg-primary/15 text-primary",
  low: "bg-muted text-muted-foreground",
};

export default async function AdminNotificationsPage() {
  const user = await getCurrentAdminUser();
  if (!user) return null;

  const { items, unreadTotal } = await getAdminNotifications(user, 100);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Notifications" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Executive Notifications</h1>
          <p className="text-sm text-muted-foreground">
            {unreadTotal} unread of {items.length} recent, across every module.
          </p>
        </div>
        {unreadTotal > 0 && <MarkAllReadButton />}
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
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="font-medium text-foreground">{n.title}</p>
                    <Badge className={cn("h-5 px-1.5 text-[10px] font-semibold uppercase", PRIORITY_BADGE[n.priority])}>
                      {n.priority}
                    </Badge>
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-medium">
                      {n.moduleLabel}
                    </Badge>
                  </div>
                  {n.body && <p className="text-muted-foreground">{n.body}</p>}
                  <p className="text-xs text-muted-foreground/80">{formatDateTime(n.createdAt)}</p>
                </div>
              </div>
            );
            return n.link ? (
              <Link key={`${n.module}-${n.id}`} href={n.link} className="block transition-opacity hover:opacity-90">{inner}</Link>
            ) : (
              <div key={`${n.module}-${n.id}`}>{inner}</div>
            );
          })}
        </CardContent>
      </GlassCard>
    </div>
  );
}
