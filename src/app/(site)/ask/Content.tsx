"use client";

import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";

export default function AskContent() {
  return (
    <ChatProvider withHistorySidebar>
      <ChatWorkspace />
    </ChatProvider>
  );
}
