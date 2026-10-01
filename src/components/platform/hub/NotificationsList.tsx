"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BellOff, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDateTime } from "@/lib/utils";
import type { NotificationView } from "@/lib/platform/notifications";
import { hubMarkAllReadAction, hubMarkReadAction } from "@/app/(platform)/workspace/hub-actions";
import { UNREAD_EVENT } from "@/components/platform/hub/NotificationBell";

const announce = (unread: number) => window.dispatchEvent(new CustomEvent(UNREAD_EVENT, { detail: unread }));

export default function NotificationsList({ initial }: { initial: NotificationView[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [pending, start] = useTransition();
  const unread = items.filter((n) => !n.read).length;

  function open(n: NotificationView) {
    start(async () => {
      if (!n.read) {
        setItems((list) => list.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
        try {
          announce((await hubMarkReadAction(n.id)).unread);
        } catch {
          // Still navigate; it'll show as unread next time.
        }
      }
      if (n.url) router.push(n.url);
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p id="notifications-unread" className="text-sm text-muted-foreground">
          {unread === 0 ? "You're all caught up." : `${unread} unread`}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          id="notifications-mark-all"
          disabled={pending || unread === 0}
          onClick={() =>
            start(async () => {
              try {
                const res = await hubMarkAllReadAction();
                setItems(res.items);
                announce(res.unread);
              } catch {
                // Leave the list as it is.
              }
            })
          }
        >
          <CheckCheck className="size-3.5" /> Mark all as read
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="flex flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          <BellOff className="size-5" /> No notifications yet.
        </p>
      ) : (
        <ul id="notifications-list" className="divide-y rounded-xl border">
          {items.map((n) => (
            <li key={n.id} data-read={n.read}>
              <button type="button" onClick={() => open(n)} className={cn("flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/60", !n.read && "bg-primary/5")}>
                <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-sm break-words", !n.read && "font-semibold")}>{n.title}</span>
                  {n.body && <span className="block text-xs break-words text-muted-foreground">{n.body}</span>}
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">{formatDateTime(n.createdAt)}</span>
                </span>
                <span className="sr-only">{n.read ? "Read" : "Unread"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
