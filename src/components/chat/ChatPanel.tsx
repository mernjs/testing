"use client";

import { Bot, Plus, X } from "lucide-react";
import { useChat } from "@/components/chat/ChatProvider";
import { ChatConversation } from "@/components/chat/ChatConversation";

/** Widget chrome (used by the floating ChatWidget). The full-page /ask
 * experience uses ChatWorkspace instead. */
export function ChatPanel({ onClose }: { onClose?: () => void }) {
  const { messages, newConversation } = useChat();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/50 bg-background/70 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-yashorbit-coral text-white shadow-sm">
            <Bot className="size-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground">Ask YashOrbit</p>
            <p className="text-[11px] text-muted-foreground">AI assistant · answers from our knowledge base</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={newConversation}
              className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Plus className="size-3" /> New chat
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close chat"
              className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <ChatConversation />
    </div>
  );
}
