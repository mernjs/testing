"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import OtsMobileSidebar from "@/components/ots/OtsMobileSidebar";
import OtsNotificationsBell from "@/components/ots/OtsNotificationsBell";
import PanelSearch from "@/components/platform/PanelSearch";
import ThemeToggle from "@/components/lms/ThemeToggle";
import type { OtsNavFlags } from "@/components/ots/OtsSidebar";
import type { OtsBellItem } from "@/lib/ots/notifications";

export default function OtsTopbar({
  roles,
  flags,
  notifications,
  unread,
}: {
  roles: string[];
  flags: OtsNavFlags;
  notifications: OtsBellItem[];
  unread: number;
}) {
  const [aiOpen, setAiOpen] = useState(false);
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <OtsMobileSidebar flags={flags} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Online Test System</p>
        <p className="truncate text-[11px] text-muted-foreground">Create exams, quizzes &amp; evaluate candidates</p>
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
        <OtsNotificationsBell items={notifications} unread={unread} />
        <ThemeToggle />
      </div>
    </header>
  );
}
