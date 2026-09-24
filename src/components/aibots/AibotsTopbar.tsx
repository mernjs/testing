"use client";

import AibotsMobileSidebar from "@/components/aibots/AibotsMobileSidebar";
import AibotsNotificationsBell from "@/components/aibots/AibotsNotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { primaryAibotsRoleLabel } from "@/lib/aibots-roles";
import type { AibotsNavFlags, SidebarBot } from "@/components/aibots/AibotsSidebar";
import type { AibotsBellItem } from "@/lib/aibots/notifications";

export default function AibotsTopbar({
  roles,
  flags,
  bots,
  notifications,
  unread,
}: {
  roles: string[];
  flags: AibotsNavFlags;
  bots: SidebarBot[];
  notifications: AibotsBellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <AibotsMobileSidebar flags={flags} bots={bots} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">AI Bots</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryAibotsRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <AibotsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
