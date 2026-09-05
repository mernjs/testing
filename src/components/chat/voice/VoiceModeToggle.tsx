"use client";

import { motion } from "framer-motion";
import { Keyboard, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "@/components/chat/VoiceProvider";

export function VoiceModeToggle({ className }: { className?: string }) {
  const { voiceMode, setVoiceMode, available, supported } = useVoice();

  if (!supported) return null;

  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-background/70 p-0.5 backdrop-blur-sm",
        className
      )}
      role="tablist"
      aria-label="Chat input mode"
    >
      {(
        [
          { key: "text", label: "Text", icon: Keyboard, on: !voiceMode },
          { key: "voice", label: "Voice", icon: AudioLines, on: voiceMode },
        ] as const
      ).map((opt) => (
        <button
          key={opt.key}
          type="button"
          role="tab"
          aria-selected={opt.on}
          disabled={opt.key === "voice" && !available}
          onClick={() => setVoiceMode(opt.key === "voice")}
          className={cn(
            "relative z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40",
            opt.on ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
          title={opt.key === "voice" && !available ? "Voice mode is not available" : undefined}
        >
          {opt.on && (
            <motion.span
              layoutId="voice-mode-pill"
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary to-yashorbit-coral shadow-sm shadow-primary/30"
            />
          )}
          <opt.icon className="size-3.5" />
          {opt.label}
        </button>
      ))}
    </div>
  );
}
