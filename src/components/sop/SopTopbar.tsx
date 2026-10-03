"use client";

import SopMobileSidebar from "@/components/sop/SopMobileSidebar";
import SopNotificationsBell from "@/components/sop/SopNotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PanelSearch from "@/components/platform/PanelSearch";
import { primarySopRoleLabel } from "@/lib/sop-roles";
import type { SopNavFlags } from "@/components/sop/SopSidebar";
import type { SopBellItem } from "@/lib/sop/notifications";

export default function SopTopbar({
  roles,
  flags,
  notifications,
  unread,
}: {
  roles: string[];
  flags: SopNavFlags;
  notifications: SopBellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <SopMobileSidebar flags={flags} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Standard Operating Procedures</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primarySopRoleLabel(roles)}</p>
      </div>
      <div className="flex min-w-0 flex-1 justify-center">
        <PanelSearch />
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <SopNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
