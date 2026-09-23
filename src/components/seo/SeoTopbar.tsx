"use client";

import SeoMobileSidebar from "@/components/seo/SeoMobileSidebar";
import SeoNotificationsBell from "@/components/seo/SeoNotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { primarySeoRoleLabel } from "@/lib/seo-roles";
import type { SeoNavFlags } from "@/components/seo/SeoSidebar";
import type { SeoBellItem } from "@/lib/seo-panel/notifications";

export default function SeoTopbar({
  roles,
  flags,
  notifications,
  unread,
}: {
  roles: string[];
  flags: SeoNavFlags;
  notifications: SeoBellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <SeoMobileSidebar flags={flags} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Search Engine Optimization</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primarySeoRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
        <SeoNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
