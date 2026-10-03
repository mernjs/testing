"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import HrmsMobileSidebar from "@/components/hrms/HrmsMobileSidebar";
import HrmsNotificationsBell, { type BellItem } from "@/components/hrms/HrmsNotificationsBell";
import PanelSearch from "@/components/platform/PanelSearch";
import ThemeToggle from "@/components/lms/ThemeToggle";
import type { HrmsRole } from "@/lib/hrms-roles";

export default function HrmsTopbar({
  roles,
  permissionOverrides,
  employeeId,
  notifications,
  unread = 0,
}: {
  roles: HrmsRole[];
  allRoles: string[];
  permissionOverrides?: Record<string, boolean>;
  employeeId: string | null;
  notifications: BellItem[];
  unread: number;
}) {
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <HrmsMobileSidebar roles={roles} permissionOverrides={permissionOverrides} employeeId={employeeId} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Human Resources</p>
        <p className="truncate text-[11px] text-muted-foreground">Manage employees, attendance &amp; payroll</p>
      </div>
      <div className="flex min-w-0 flex-1 justify-center">
        <PanelSearch />
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setAiOpen(!aiOpen)}
          title="Ask AI Assistant"
          aria-label="Ask AI Assistant"
          className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
        >
          <Sparkles className="size-4" />
        </button>
        <HrmsNotificationsBell items={notifications} unread={unread} basePath="/hrms" />
        <ThemeToggle />
      </div>
    </header>
  );
}
