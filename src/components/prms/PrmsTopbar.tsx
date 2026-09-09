"use client";

import Link from "next/link";
import { Users, LayoutGrid, FolderKanban, GraduationCap, Globe, MessagesSquare } from "lucide-react";
import PrmsMobileSidebar from "@/components/prms/PrmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PrmsNotificationsBell, { type BellItem } from "@/components/prms/PrmsNotificationsBell";
import { buttonVariants } from "@/components/ui/button";
import { primaryPrmsRoleLabel, hasPrmsStaffRole, type PrmsRole } from "@/lib/prms-roles";

export default function PrmsTopbar({
  roles,
  notifications,
  unread,
}: {
  roles: PrmsRole[];
  notifications: BellItem[];
  unread: number;
}) {
  const isStaff = hasPrmsStaffRole(roles);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <PrmsMobileSidebar roles={roles} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Procurement &amp; Expense</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryPrmsRoleLabel(roles)}</p>
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
              href="/tms"
              className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
              aria-label="Open TMS"
            >
              <GraduationCap className="size-3.5" data-icon="inline-start" />
              <span className="hidden sm:inline">TMS</span>
            </Link>
            <Link
              href="/lms"
              className={buttonVariants({ variant: "outline", size: "sm", className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex" })}
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
        <PrmsNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
