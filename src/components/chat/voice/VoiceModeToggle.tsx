"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Keyboard, AudioLines } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "@/components/chat/VoiceProvider";

/**
 * Accessible two-option segmented control for switching between Text Mode and
 * Voice Mode. Rendered as a radio group so screen readers announce it as a
 * single control with two choices, and arrow keys move between them.
 *
 * `size="lg"` is the prominent, full-width control docked above the composer;
 * the default compact size can sit in a toolbar.
 */
export function VoiceModeToggle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  const { voiceMode, setVoiceMode, available, supported } = useVoice();
  const reduceMotion = useReducedMotion();
  const groupRef = React.useRef<HTMLDivElement>(null);

  if (!supported) return null;

  const voiceOn = voiceMode && available;
  const options = [
    { key: "text" as const, label: "Text", hint: "Type your questions", icon: Keyboard, on: !voiceOn, disabled: false },
    {
      key: "voice" as const,
      label: "Voice",
      hint: available ? "Speak and listen" : "Voice is unavailable right now",
      icon: AudioLines,
      on: voiceOn,
      disabled: !available,
    },
  ];

  const lg = size === "lg";

  const move = (dir: 1 | -1) => {
    const next = dir === 1;
    const target = options.find((o) => o.key === (next ? "voice" : "text"));
    if (target && !target.disabled) setVoiceMode(target.key === "voice");
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label="Response mode"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          move(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          move(-1);
        }
      }}
      className={cn(
        "relative inline-flex items-stretch gap-1 rounded-2xl border-2 border-border bg-background p-1 shadow-sm",
        lg && "w-full max-w-md",
        className
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          role="radio"
          aria-checked={opt.on}
          aria-label={`${opt.label} mode — ${opt.hint}`}
          tabIndex={opt.on ? 0 : -1}
          disabled={opt.disabled}
          onClick={() => setVoiceMode(opt.key === "voice")}
          className={cn(
            "relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl font-semibold transition-colors",
            "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
            "disabled:cursor-not-allowed disabled:opacity-45",
            lg ? "px-4 py-2 text-base sm:py-2.5" : "px-3.5 py-2 text-sm",
            opt.on ? "text-primary-foreground" : "text-foreground/80 hover:text-foreground"
          )}
        >
          {opt.on && (
            <motion.span
              layoutId="voice-mode-pill"
              transition={
                reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }
              }
              className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary to-yashorbit-coral shadow-sm shadow-primary/30"
            />
          )}
          <opt.icon className={cn(lg ? "size-5" : "size-4")} aria-hidden />
          {opt.label}
        </button>
      ))}
    </div>
  );
}
