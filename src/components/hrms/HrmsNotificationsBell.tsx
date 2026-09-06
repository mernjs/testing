"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { markNotificationsReadAction, markAllNotificationsReadAction } from "@/app/hrms/notifications-actions";

export interface BellItem {
  _id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  createdAt: string;
  read: boolean;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 7 ? `${d}d ago` : new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function HrmsNotificationsBell({
  items,
  unread,
  basePath,
}: {
  items: BellItem[];
  unread: number;
  basePath: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  function openItem(item: BellItem) {
    setOpen(false);
    if (!item.read) {
      startTransition(() => {
        void markNotificationsReadAction([item._id]);
      });
    }
    if (item.link) router.push(item.link);
    else router.refresh();
  }

  function markAll() {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      router.refresh();
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button type="button" variant="ghost" size="icon" aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`} className="relative">
            <Bell className="size-4.5" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </Button>
        }
      />
      <PopoverContent align="end" className="max-h-[30rem] w-80 overflow-y-auto p-0">
        <PopoverHeader className="flex-row items-center justify-between p-3">
          <PopoverTitle>Notifications</PopoverTitle>
          {unread > 0 && (
            <button type="button" onClick={markAll} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
              <CheckCheck className="size-3" />
              Mark all read
            </button>
          )}
        </PopoverHeader>

        {items.length === 0 ? (
          <p className="px-3 pb-3 text-xs text-muted-foreground">You&apos;re all caught up.</p>
        ) : (
          <ul className="pb-1">
            {items.map((item) => (
              <li key={item._id}>
                <button
                  type="button"
                  onClick={() => openItem(item)}
                  className={cn(
                    "flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-muted/60",
                    !item.read && "bg-primary/5"
                  )}
                >
                  <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", item.read ? "bg-transparent" : "bg-primary")} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">{item.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{item.body}</span>
                    <span className="block text-[11px] text-muted-foreground/80">{relativeTime(item.createdAt)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-border/60 p-2">
          <Link href={basePath} onClick={() => setOpen(false)} className="block rounded-md px-2 py-1.5 text-center text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            See all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
