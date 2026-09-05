"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles } from "lucide-react";

export function WelcomeScreen({
  welcomeMessage,
  suggestedQuestions,
  onPick,
}: {
  welcomeMessage: string;
  suggestedQuestions: string[];
  onPick: (q: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center gap-5 px-2 py-8 text-center"
    >
      <div className="relative">
        <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-primary/30 to-yashorbit-coral/20 blur-xl" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-yashorbit-coral text-white shadow-lg">
          <Bot className="h-7 w-7" />
        </div>
      </div>

      <div className="max-w-md space-y-1.5">
        <h2 className="text-lg font-bold text-foreground">YashOrbit AI Assistant</h2>
        <p className="text-sm text-muted-foreground">{welcomeMessage}</p>
      </div>

      {suggestedQuestions.length > 0 && (
        <div className="flex w-full max-w-md flex-col gap-2">
          <span className="flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
            <Sparkles className="h-3 w-3" /> Try asking
          </span>
          {suggestedQuestions.map((q, i) => (
            <motion.button
              key={q}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => onPick(q)}
              className="group rounded-xl border border-border/60 bg-background/60 px-4 py-2.5 text-left text-sm text-foreground/90 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              {q}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
