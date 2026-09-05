"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/components/chat/ChatMessage";
import type { ChatMessage as ChatMessageType } from "@/components/chat/ChatProvider";

export function ChatThread({
  messages,
  wide = false,
  className,
}: {
  messages: ChatMessageType[];
  wide?: boolean;
  className?: string;
}) {
  const endRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const pinnedRef = React.useRef(true);

  // Only auto-scroll when the user is already near the bottom, so reading
  // earlier messages isn't interrupted by streaming tokens.
  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  };

  const lastContent = messages[messages.length - 1]?.content;
  React.useEffect(() => {
    if (pinnedRef.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages.length, lastContent]);

  return (
    <div ref={containerRef} onScroll={onScroll} className="flex-1 overflow-y-auto">
      <div className={cn("space-y-5 py-5", wide ? "px-0" : "px-4", className)}>
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} wide={wide} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
