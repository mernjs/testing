"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { NavSection } from "@/lib/workspace/nav";
import HubMobileSidebar from "@/components/hub/HubMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PanelSearch from "@/components/platform/PanelSearch";
import NotificationBell from "@/components/platform/hub/NotificationBell";
import { useAskAiOpen } from "@/lib/ai/use-ask-ai-open";
import AskAiDrawer from "@/components/platform/AskAiDrawer";

export default function HubTopbar({ email, nav, unread = 0 }: { email: string; nav: NavSection[]; unread?: number }) {
  const [aiOpen, setAiOpen] = useAskAiOpen();
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <HubMobileSidebar nav={nav} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Workspace</p>
        <p className="truncate text-[11px] text-muted-foreground">Your panels, analytics &amp; settings</p>
      </div>
      <div className="flex min-w-0 flex-1 justify-center">
        <PanelSearch />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setAiOpen(!aiOpen)}
          title="Ask AI Assistant"
          aria-label="Ask AI Assistant"
          className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
        >
          <Sparkles className="size-4" />
        </button>
        <NotificationBell initial={unread} />
        <ThemeToggle />
      </div>
      <AskAiDrawer
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        panelId="hub"
        panelTitle="Workspace Hub"
        panelDescription="Your panels, analytics & settings"
      />
    </header>
  );
}
