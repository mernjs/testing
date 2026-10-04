"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import PrmsMobileSidebar from "@/components/prms/PrmsMobileSidebar";
import PrmsNotificationsBell, { type BellItem } from "@/components/prms/PrmsNotificationsBell";
import PanelSearch from "@/components/platform/PanelSearch";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { useAskAiOpen } from "@/lib/ai/use-ask-ai-open";
import AskAiDrawer from "@/components/platform/AskAiDrawer";
import type { PrmsRole } from "@/lib/prms-roles";

export default function PrmsTopbar({
  roles,
  permissionOverrides,
  notifications,
  unread,
}: {
  roles: PrmsRole[];
  allRoles: string[];
  permissionOverrides?: Record<string, boolean>;
  notifications: BellItem[];
  unread: number;
}) {
  const [aiOpen, setAiOpen] = useAskAiOpen();
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <PrmsMobileSidebar roles={roles} permissionOverrides={permissionOverrides} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Procurement &amp; Expense</p>
        <p className="truncate text-[11px] text-muted-foreground">Purchase orders, vendors &amp; expense reports</p>
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
        <PrmsNotificationsBell items={notifications} unread={unread} />
        <ThemeToggle />
      </div>
      <AskAiDrawer
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        panelId="prms"
        panelTitle="Procurement Management"
        panelDescription="Purchase orders, vendors & expense reports"
        roles={roles}
      />
    </header>
  );
}
