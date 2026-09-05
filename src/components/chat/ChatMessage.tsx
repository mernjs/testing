"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AudioLines, Bot, ExternalLink, FileText, User } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { Markdown } from "@/components/chat/Markdown";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import type { ChatMessage as ChatMessageType } from "@/components/chat/ChatProvider";

function StreamingCursor() {
  return <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-primary align-middle" />;
}

function Citations({ citations }: { citations: ChatMessageType["citations"] }) {
  if (citations.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border/40 pt-2.5">
      <span className="w-full text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">Sources</span>
      {citations.map((c, i) => {
        const inner = (
          <>
            {c.kind === "pdf" ? <FileText className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
            <span className="max-w-[220px] truncate">{c.title}</span>
          </>
        );
        const className =
          "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground";
        return c.url ? (
          <Link key={`${c.fileId}-${i}`} href={c.url} className={className}>
            {inner}
          </Link>
        ) : (
          <span key={`${c.fileId}-${i}`} className={className}>
            {inner}
          </span>
        );
      })}
    </div>
  );
}

export function ChatMessage({ message, wide = false }: { message: ChatMessageType; wide?: boolean }) {
  const isUser = message.role === "user";
  const showTyping = message.streaming && !message.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex h-8 w-8 flex-none items-center justify-center rounded-full border shadow-sm",
          isUser
            ? "border-border/60 bg-muted text-muted-foreground"
            : "border-primary/30 bg-gradient-to-br from-primary to-yashorbit-coral text-white"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-col gap-1",
          isUser ? "max-w-[85%] items-end" : wide ? "max-w-full flex-1 items-start" : "max-w-[85%] items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl border px-4 py-2.5 shadow-sm backdrop-blur-sm",
            isUser
              ? "rounded-tr-sm border-primary/20 bg-primary/10 text-foreground"
              : message.error
                ? "rounded-tl-sm border-destructive/30 bg-destructive/5 text-foreground"
                : "rounded-tl-sm border-border/60 bg-background/70 text-foreground"
          )}
        >
          {showTyping ? (
            <TypingIndicator />
          ) : isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          ) : (
            <div className="relative">
              <Markdown content={message.content} />
              {message.streaming && <StreamingCursor />}
            </div>
          )}
          {!isUser && !message.streaming && <Citations citations={message.citations} />}
        </div>
        {!message.streaming && (
          <span className="flex items-center gap-1 px-1 text-[10px] text-muted-foreground/60">
            {message.voice && <AudioLines className="size-2.5 text-primary/70" />}
            {formatDateTime(message.createdAt)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
