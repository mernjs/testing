"use client";

import DlmsMobileSidebar from "@/components/dlms/DlmsMobileSidebar";
import DlmsNotificationsBell from "@/components/dlms/DlmsNotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { primaryDlmsRoleLabel } from "@/lib/dlms-roles";
import type { DlmsNavFlags } from "@/components/dlms/DlmsSidebar";
import type { DlmsBellItem } from "@/lib/dlms/notifications";

export default function DlmsTopbar({
  roles,
  flags,
  notifications,
  unread,
}: {
  roles: string[];
  flags: DlmsNavFlags;
  notifications: DlmsBellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <DlmsMobileSidebar flags={flags} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Digi Locker</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryDlmsRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <DlmsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
