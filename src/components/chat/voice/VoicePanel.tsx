"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useVoice } from "@/components/chat/VoiceProvider";
import { Waveform } from "@/components/chat/voice/Waveform";
import { MicButton } from "@/components/chat/voice/MicButton";
import { VoiceStatusBar } from "@/components/chat/voice/VoiceStatusBar";

/** The voice control surface shown above the text composer while Voice Mode is on. */
export function VoicePanel({ className }: { className?: string }) {
  const { status, level } = useVoice();
  const speaking = status === "speaking";
  const listening = status === "listening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 bg-background/70 px-4 py-4 backdrop-blur-xl",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500",
          listening
            ? "bg-gradient-to-br from-primary/10 via-transparent to-yashorbit-coral/10 opacity-100"
            : speaking
              ? "bg-gradient-to-br from-yashorbit-blue/10 via-transparent to-secondary/15 opacity-100"
              : "opacity-0"
        )}
      />

      <div className="flex flex-col items-center gap-3">
        <Waveform level={level} active={listening || speaking} tone={speaking ? "blue" : "coral"} />
        <MicButton />
        <VoiceStatusBar />
      </div>
    </motion.div>
  );
}
