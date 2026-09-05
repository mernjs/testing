"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice, type VoiceStatus } from "@/components/chat/VoiceProvider";

const STATUS_LABEL: Record<VoiceStatus, string> = {
  idle: "Tap the mic and ask a question",
  listening: "Listening…",
  transcribing: "Transcribing…",
  thinking: "Thinking…",
  speaking: "Speaking",
};

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function VoiceStatusBar() {
  const { status, recordingMs, muted, canReplay, hint, error, toggleMute, replayLast, interrupt, dismissHint } =
    useVoice();

  const showTimer = status === "listening";
  const showInterrupt = status === "speaking" || status === "thinking" || status === "listening";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-sm">
        <span
          className={cn(
            "inline-flex items-center gap-2 font-medium",
            status === "listening" && "text-primary",
            status === "speaking" && "text-yashorbit-blue dark:text-secondary-foreground",
            (status === "idle" || status === "transcribing" || status === "thinking") && "text-muted-foreground"
          )}
        >
          {(status === "listening" || status === "speaking") && (
            <span className="relative flex size-2">
              <span
                className={cn(
                  "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                  status === "listening" ? "bg-primary" : "bg-yashorbit-blue dark:bg-secondary-foreground"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex size-2 rounded-full",
                  status === "listening" ? "bg-primary" : "bg-yashorbit-blue dark:bg-secondary-foreground"
                )}
              />
            </span>
          )}
          {STATUS_LABEL[status]}
          {showTimer && <span className="tabular-nums text-muted-foreground">{fmt(recordingMs)}</span>}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute the assistant" : "Mute the assistant"}
          className={cn(
            "flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground",
            muted && "border-primary/40 bg-primary/5 text-primary"
          )}
        >
          {muted ? <VolumeX className="size-3.5" /> : <Volume2 className="size-3.5" />}
        </button>
        <button
          type="button"
          onClick={replayLast}
          disabled={!canReplay || status === "speaking"}
          aria-label="Replay last response"
          className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
        >
          <RotateCcw className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={interrupt}
          disabled={!showInterrupt}
          aria-label="Stop"
          className="flex size-8 items-center justify-center rounded-full border border-destructive/40 text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-30"
        >
          <X className="size-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {(hint || error) && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            onClick={dismissHint}
            className={cn(
              "rounded-full px-3 py-1 text-xs",
              error ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            )}
          >
            {error || hint}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
