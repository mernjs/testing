"use client";

import * as React from "react";
import { useChat } from "@/components/chat/ChatProvider";
import { useVoice } from "@/components/chat/VoiceProvider";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { VoiceModeToggle } from "@/components/chat/voice/VoiceModeToggle";
import { VoicePanel } from "@/components/chat/voice/VoicePanel";

/**
 * The bottom dock of the /ask workspace: an always-visible Text / Voice switch
 * sitting directly above the active input surface (text composer or the Voice
 * Mode console). Keeping the switch pinned here means either mode is one tap
 * away at any point in the conversation.
 */
export function ChatDock({ wide = false }: { wide?: boolean }) {
  const { send, status, config } = useChat();
  const { supported, available, voiceMode } = useVoice();

  const streaming = status === "streaming";
  const unavailable = config?.available === false;
  const maxChars = config?.maxMessageChars ?? 2000;
  const showVoice = supported && voiceMode && available;

  // On a real mode switch (not first mount), move focus to the new input so
  // keyboard and screen-reader users land on the control they just chose.
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const sel = showVoice ? "[data-voice-mic]" : "[data-chat-input]";
    (document.querySelector(sel) as HTMLElement | null)?.focus();
  }, [showVoice]);

  return (
    <div className="flex flex-col gap-2 pb-3 pt-1 sm:gap-2.5">
      {supported && (
        <div className="flex justify-center">
          <VoiceModeToggle size="lg" />
        </div>
      )}

      {showVoice ? (
        <VoicePanel />
      ) : (
        <ChatComposer
          disabled={unavailable}
          streaming={streaming}
          maxChars={maxChars}
          onSend={send}
          wide={wide}
        />
      )}
    </div>
  );
}
