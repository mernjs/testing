"use client";

import IntelligenceMobileSidebar from "@/components/intelligence/IntelligenceMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { primaryIntelligenceRoleLabel } from "@/lib/intelligence-roles";

export default function IntelligenceTopbar({ roles }: { roles: string[] }) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <IntelligenceMobileSidebar />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">AI Intelligence</p>
        <p className="truncate text-[11px] text-muted-foreground">AI Data Analyst · Signed in as {primaryIntelligenceRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
