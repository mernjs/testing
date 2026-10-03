"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import MessengerMobileSidebar from "@/components/messenger/MessengerMobileSidebar";
import MessengerNotificationsBell, { type BellItem } from "@/components/messenger/MessengerNotificationsBell";
import { ConnectionPill } from "@/components/messenger/ConnectionPill";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PanelSearch from "@/components/platform/PanelSearch";
import type { ChatRole } from "@/lib/messenger-roles";

export default function MessengerTopbar({
  roles,
  notifications,
  unread,
  unreadDms,
  unreadChannels,
}: {
  roles: ChatRole[];
  allRoles: string[];
  notifications: BellItem[];
  unread: number;
  unreadDms: number;
  unreadChannels: number;
}) {
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <MessengerMobileSidebar
        roles={roles}
        unreadDms={unreadDms}
        unreadChannels={unreadChannels}
        unreadNotifications={unread}
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Team Communication</p>
        <p className="truncate text-[11px] text-muted-foreground">Messages, channels &amp; team collaboration</p>
      </div>
      <div className="flex min-w-0 flex-1 justify-center">
        <PanelSearch />
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setAiOpen(!aiOpen)}
          title="Ask AI Assistant"
          aria-label="Ask AI Assistant"
          className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
        >
          <Sparkles className="size-4" />
        </button>
        <ConnectionPill />
        <MessengerNotificationsBell items={notifications} unread={unread} />
        <ThemeToggle />
      </div>
    </header>
  );
}
