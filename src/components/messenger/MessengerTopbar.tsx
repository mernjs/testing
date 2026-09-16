"use client";

import MessengerMobileSidebar from "@/components/messenger/MessengerMobileSidebar";
import MessengerNotificationsBell, { type BellItem } from "@/components/messenger/MessengerNotificationsBell";
import { ConnectionPill } from "@/components/messenger/ConnectionPill";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { primaryChatRoleLabel, type ChatRole } from "@/lib/messenger-roles";

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
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryChatRoleLabel(roles)}</p>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ConnectionPill />
        <MessengerNotificationsBell items={notifications} unread={unread} />
        <ThemeToggle />
      </div>
    </header>
  );
}
