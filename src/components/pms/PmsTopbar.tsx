"use client";

import Link from "next/link";
import { Users, LayoutGrid, Globe } from "lucide-react";
import PmsMobileSidebar from "@/components/pms/PmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { primaryPmsRoleLabel, type PmsRole } from "@/lib/pms-roles";

export default function PmsTopbar({ roles }: { roles: PmsRole[] }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <PmsMobileSidebar roles={roles} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Project Management</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryPmsRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <Link
          href="/hrms"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Open HRMS"
        >
          <Users className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">HRMS</span>
        </Link>
        <Link
          href="/lms"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Open LMS"
        >
          <LayoutGrid className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">LMS</span>
        </Link>
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
      </div>
    </header>
  );
}
