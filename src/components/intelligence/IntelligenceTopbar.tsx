"use client";

import { useState } from "react";
import { Sparkles, Bell } from "lucide-react";
import IntelligenceMobileSidebar from "@/components/intelligence/IntelligenceMobileSidebar";
import ThemeToggle from "@/components/lms/ThemeToggle";
import PanelSearch from "@/components/platform/PanelSearch";

export default function IntelligenceTopbar({ roles: _roles }: { roles: string[] }) {
  const [aiOpen, setAiOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <IntelligenceMobileSidebar />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">AI Intelligence</p>
        <p className="truncate text-[11px] text-muted-foreground">Data analytics, insights &amp; AI reports</p>
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
        <button
          type="button"
          onClick={() => setBellOpen(!bellOpen)}
          title="Notifications"
          aria-label="Notifications"
          className="flex size-9 items-center justify-center rounded-full border border-border/60 bg-muted/30 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
        >
          <Bell className="size-4" />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
