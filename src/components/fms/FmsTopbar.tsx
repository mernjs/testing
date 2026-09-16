"use client";

import FmsMobileSidebar from "@/components/fms/FmsMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { primaryFmsRoleLabel, type FmsRole } from "@/lib/fms-roles";

export default function FmsTopbar({
  roles,
  permissionOverrides,
}: {
  roles: FmsRole[];
  permissionOverrides?: Record<string, boolean>;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <FmsMobileSidebar roles={roles} permissionOverrides={permissionOverrides} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Finance Management</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryFmsRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
