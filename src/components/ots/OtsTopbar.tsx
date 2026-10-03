"use client";

import OtsMobileSidebar from "@/components/ots/OtsMobileSidebar";
import OtsNotificationsBell from "@/components/ots/OtsNotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PanelSearch from "@/components/platform/PanelSearch";
import { primaryOtsRoleLabel } from "@/lib/ots-roles";
import type { OtsNavFlags } from "@/components/ots/OtsSidebar";
import type { OtsBellItem } from "@/lib/ots/notifications";

export default function OtsTopbar({ roles, flags, notifications, unread }: { roles: string[]; flags: OtsNavFlags; notifications: OtsBellItem[]; unread: number }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <OtsMobileSidebar flags={flags} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Online Test System</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryOtsRoleLabel(roles)}</p>
      </div>
      <div className="flex min-w-0 flex-1 justify-center">
        <PanelSearch />
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <OtsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
