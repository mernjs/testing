"use client";

import * as React from "react";
import { AnimatePresence } from "framer-motion";
import { Bot, PanelLeft, Plus } from "lucide-react";
import { useChat } from "@/components/chat/ChatProvider";
import { useVoice } from "@/components/chat/VoiceProvider";
import { ChatSidebar, ChatSidebarDrawer } from "@/components/chat/ChatSidebar";
import { ChatConversation } from "@/components/chat/ChatConversation";
import { VoiceModeToggle } from "@/components/chat/voice/VoiceModeToggle";
import { VoicePanel } from "@/components/chat/voice/VoicePanel";

function WorkspaceVoiceSlot() {
  const { voiceMode, supported } = useVoice();
  const { needsIdentification } = useChat();
  if (!supported || !voiceMode || needsIdentification) return null;
  return <VoicePanel />;
}

export function ChatWorkspace() {
  const { newConversation, messages, needsIdentification, ready } = useChat();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const showSidebar = ready && !needsIdentification;

  return (
    <div className="relative flex h-[calc(100dvh-88px)] w-full overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />

      {/* Desktop sidebar */}
      {showSidebar && (
        <aside className="hidden w-64 shrink-0 border-r border-border/50 bg-muted/20 dark:bg-muted/10 lg:block">
          <ChatSidebar />
        </aside>
      )}

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && showSidebar && <ChatSidebarDrawer onClose={() => setDrawerOpen(false)} />}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-2 border-b border-border/50 bg-background/70 px-4 py-2.5 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            {showSidebar && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open chat history"
                className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted lg:hidden"
              >
                <PanelLeft className="size-4" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-yashorbit-coral text-white">
                <Bot className="size-3.5" />
              </div>
              <span className="text-sm font-bold text-foreground">
                Ask <span className="text-primary">YashOrbit</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <VoiceModeToggle />
            {showSidebar && (
              <button
                type="button"
                onClick={() => void newConversation()}
                disabled={messages.length === 0}
                className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40 lg:hidden"
              >
                <Plus className="size-3.5" />
                New
              </button>
            )}
          </div>
        </header>

        <ChatConversation wide voiceSlot={<WorkspaceVoiceSlot />} />
      </div>
    </div>
  );
}
