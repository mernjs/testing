"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mic, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "@/components/chat/VoiceProvider";

export function MicButton() {
  const { status, level, toggleListening, available, interrupt } = useVoice();

  const listening = status === "listening";
  const busy = status === "transcribing" || status === "thinking";
  const speaking = status === "speaking";

  const onClick = () => {
    if (speaking) interrupt();
    else if (status === "idle" || listening) toggleListening();
  };

  const label = listening
    ? "Stop recording"
    : speaking
      ? "Stop the assistant"
      : busy
        ? "Working…"
        : "Start speaking";

  return (
    <div className="relative flex items-center justify-center">
      {/* pulsing rings while listening */}
      <AnimatePresence>
        {listening && (
          <>
            {[0, 1].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 1, opacity: 0.35 }}
                animate={{ scale: 1.9 + level * 1.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                className="absolute size-16 rounded-full bg-primary/30"
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onClick}
        disabled={busy || (!available && status === "idle")}
        aria-label={label}
        animate={listening ? { scale: 1 + level * 0.12 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "relative flex size-16 items-center justify-center rounded-full text-white shadow-xl transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          listening
            ? "bg-gradient-to-br from-primary to-yashorbit-coral shadow-primary/40"
            : speaking
              ? "bg-gradient-to-br from-yashorbit-blue to-secondary-foreground shadow-yashorbit-blue/40"
              : "bg-gradient-to-br from-primary to-yashorbit-coral shadow-primary/30 hover:scale-105 active:scale-95"
        )}
      >
        {busy ? (
          <Loader2 className="size-6 animate-spin" />
        ) : listening || speaking ? (
          <Square className="size-5" fill="currentColor" />
        ) : (
          <Mic className="size-6" />
        )}
      </motion.button>
    </div>
  );
}
