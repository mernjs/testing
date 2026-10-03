"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import PortalMobileSidebar from "@/components/portal/PortalMobileSidebar";
import PortalNotificationsBell, { type BellItem } from "@/components/portal/PortalNotificationsBell";
import LeadSwitcher, { type LeadSummary } from "@/components/portal/LeadSwitcher";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { PORTAL_ROLE_META, type PortalRole } from "@/lib/portal-roles";

export default function PortalTopbar({
  role,
  displayName,
  notifications,
  unread,
  leads = [],
}: {
  role: PortalRole;
  displayName: string;
  notifications: BellItem[];
  unread: number;
  leads?: LeadSummary[];
}) {
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <PortalMobileSidebar role={role} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{PORTAL_ROLE_META[role].portalName}</p>
        <p className="truncate text-[11px] text-muted-foreground">Welcome, {displayName}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <LeadSwitcher leads={leads} />
        <button
          type="button"
          onClick={() => setAiOpen(!aiOpen)}
          title="Ask AI Assistant"
          aria-label="Ask AI Assistant"
          className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
        >
          <Sparkles className="size-4" />
        </button>
        <PortalNotificationsBell items={notifications} unread={unread} />
        <ThemeToggle />
      </div>
    </header>
  );
}
