"use client";

import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import HrmsMobileSidebar from "@/components/hrms/HrmsMobileSidebar";
import ThemeToggle from "@/components/admin/ThemeToggle";
import HrmsNotificationsBell, { type BellItem } from "@/components/hrms/HrmsNotificationsBell";
import { buttonVariants } from "@/components/ui/button";
import type { HrmsRole } from "@/lib/hrms-roles";
import { primaryRoleLabel } from "@/lib/hrms-roles";

export default function HrmsTopbar({
  roles,
  notifications,
  unread,
}: {
  roles: HrmsRole[];
  notifications: BellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <HrmsMobileSidebar roles={roles} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Human Resources</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Link
          href="/admin"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Open Admin Panel"
        >
          <LayoutGrid className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">Admin Panel</span>
        </Link>
        <ThemeToggle />
        <HrmsNotificationsBell items={notifications} unread={unread} basePath="/hrms/notifications" />
      </div>
    </header>
  );
}
