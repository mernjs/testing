"use client";

import SmmsMobileSidebar from "@/components/smms/SmmsMobileSidebar";
import SmmsNotificationsBell from "@/components/smms/SmmsNotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { primarySmmsRoleLabel } from "@/lib/smms-roles";
import type { SmmsNavFlags } from "@/components/smms/SmmsSidebar";
import type { SmmsBellItem } from "@/lib/smms/notifications";

export default function SmmsTopbar({ roles, flags, notifications, unread }: { roles: string[]; flags: SmmsNavFlags; notifications: SmmsBellItem[]; unread: number }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <SmmsMobileSidebar flags={flags} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Social Media Marketing</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primarySmmsRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <SmmsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
