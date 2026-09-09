"use client";

import Link from "next/link";
import { Users, LayoutGrid, FolderKanban, Globe, MessagesSquare } from "lucide-react";
import TmsMobileSidebar from "@/components/tms/TmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import TmsNotificationsBell, { type BellItem } from "@/components/tms/TmsNotificationsBell";
import { buttonVariants } from "@/components/ui/button";
import { primaryTmsRoleLabel, hasTmsStaffRole, type TmsRole } from "@/lib/tms-roles";

export default function TmsTopbar({
  roles,
  studentId,
  notifications,
  unread,
}: {
  roles: TmsRole[];
  studentId: string | null;
  notifications: BellItem[];
  unread: number;
}) {
  const isStaff = hasTmsStaffRole(roles);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <TmsMobileSidebar roles={roles} studentId={studentId} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Training Management</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryTmsRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Link
          href="/messenger"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Open Messenger"
        >
          <MessagesSquare className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">Messenger</span>
        </Link>
        {isStaff && (
          <>
            <Link
              href="/hrms"
              className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
              aria-label="Open HRMS"
            >
              <Users className="size-3.5" data-icon="inline-start" />
              <span className="hidden sm:inline">HRMS</span>
            </Link>
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
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
          aria-label="Visit website"
        >
          <Globe className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">Website</span>
        </a>
        <ThemeToggle />
        <TmsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
