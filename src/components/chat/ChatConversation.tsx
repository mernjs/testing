"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/components/chat/ChatProvider";
import { ChatThread } from "@/components/chat/ChatThread";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { PreChatForm } from "@/components/chat/PreChatForm";

/** The shared middle of every chat surface: body + error banner + composer. */
export function ChatConversation({ wide = false }: { wide?: boolean }) {
  const { messages, status, error, config, ready, send, dismissError, switchingSession, needsIdentification } =
    useChat();
  const streaming = status === "streaming";
  const unavailable = config?.available === false;
  const maxChars = config?.maxMessageChars ?? 2000;
  const columnClass = wide ? "mx-auto w-full max-w-3xl px-4 sm:px-6" : "";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {!ready || switchingSession ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        </div>
      ) : needsIdentification ? (
        <PreChatForm wide={wide} />
      ) : messages.length === 0 ? (
        <div className="flex-1 overflow-y-auto">
          <div className={cn(wide && "mx-auto max-w-2xl")}>
            <WelcomeScreen
              welcomeMessage={
                unavailable
                  ? "The assistant is being set up and isn't available just yet. Please check back soon or contact our team."
                  : config?.welcomeMessage ?? "Hi! Ask me anything about YashOrbit."
              }
              suggestedQuestions={unavailable ? [] : config?.suggestedQuestions ?? []}
              onPick={send}
            />
          </div>
        </div>
      ) : (
        <ChatThread messages={messages} wide={wide} className={columnClass} />
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className={cn(
              "mb-2 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-foreground",
              wide ? "mx-auto w-full max-w-3xl" : "mx-4"
            )}
          >
            <AlertCircle className="mt-0.5 size-3.5 flex-none text-destructive" />
            <span className="flex-1">{error}</span>
            <button onClick={dismissError} className="text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {!needsIdentification && (
        <div className={columnClass}>
          <ChatComposer disabled={unavailable} streaming={streaming} maxChars={maxChars} onSend={send} wide={wide} />
        </div>
      )}
    </div>
  );
}
