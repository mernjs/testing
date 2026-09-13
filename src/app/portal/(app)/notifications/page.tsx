import Link from "next/link";
import { Bell } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { guardPortalPage } from "@/lib/portal/guard";
import { listPortalNotifications } from "@/lib/portal/notifications";
import { PortalPageHeader } from "@/components/portal/widgets";
import MarkAllReadButton from "@/components/portal/MarkAllReadButton";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications · YashOrbit Portal" };

function ago(d: Date) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return d.toLocaleDateString();
}

export default async function NotificationsPage() {
  const user = await guardPortalPage();
  const items = await listPortalNotifications(user.id, 60);
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "Notifications" }]} />
      <PortalPageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : "You're all caught up"}
        action={<MarkAllReadButton disabled={unread === 0} />}
      />

      <GlassCard>
        <CardContent className="space-y-1.5 py-4">
          {items.length === 0 && (
            <p className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
              <Bell className="size-6 text-muted-foreground/50" />
              No notifications yet.
            </p>
          )}
          {items.map((n) => {
            const body = (
              <div className={cn("flex gap-3 rounded-xl border px-3 py-2.5", n.read ? "border-transparent" : "border-primary/30 bg-primary/[0.04]")}>
                <span className={cn("mt-1 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                  <p className="mt-0.5 text-[11px] text-muted-foreground/70">{ago(n.createdAt)}</p>
                </div>
              </div>
            );
            return n.link ? (
              <Link key={n._id} href={n.link} className="block">
                {body}
              </Link>
            ) : (
              <div key={n._id}>{body}</div>
            );
          })}
        </CardContent>
      </GlassCard>
    </div>
  );
}
