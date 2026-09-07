"use client";

import Link from "next/link";
import { LayoutGrid, FolderKanban } from "lucide-react";
import HrmsMobileSidebar from "@/components/hrms/HrmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import HrmsNotificationsBell, { type BellItem } from "@/components/hrms/HrmsNotificationsBell";
import { buttonVariants } from "@/components/ui/button";
import type { HrmsRole } from "@/lib/hrms-roles";
import { primaryRoleLabel, hasStaffRole } from "@/lib/hrms-roles";

export default function HrmsTopbar({
  roles,
  employeeId,
  notifications,
  unread,
}: {
  roles: HrmsRole[];
  employeeId: string | null;
  notifications: BellItem[];
  unread: number;
}) {
  const isStaff = hasStaffRole(roles);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <HrmsMobileSidebar roles={roles} employeeId={employeeId} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Human Resources</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        {isStaff && (
          <>
            <Link
              href="/pms"
              className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
              aria-label="Open PMS"
            >
              <FolderKanban className="size-3.5" data-icon="inline-start" />
              <span className="hidden sm:inline">PMS</span>
            </Link>
            <Link
              href="/lms"
              className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
              aria-label="Open LMS"
            >
              <LayoutGrid className="size-3.5" data-icon="inline-start" />
              <span className="hidden sm:inline">LMS</span>
            </Link>
          </>
        )}
        <ThemeToggle />
        <HrmsNotificationsBell items={notifications} unread={unread} basePath="/hrms/notifications" />
      </div>
    </header>
  );
}
