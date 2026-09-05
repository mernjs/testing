"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Lightweight bar visualiser driven by a single 0–1 `level` value (RMS of the
 * mic input while listening, or of the AI audio output while speaking). Bars
 * ripple outward from the centre so it reads as a live waveform without needing
 * per-frequency FFT data.
 */
export function Waveform({
  level,
  active,
  tone = "coral",
  bars = 28,
  className,
}: {
  level: number;
  active: boolean;
  tone?: "coral" | "blue";
  bars?: number;
  className?: string;
}) {
  const half = Math.ceil(bars / 2);
  const [heights, setHeights] = React.useState<number[]>(() => Array.from({ length: half }, () => 0.08));
  const levelRef = React.useRef(level);
  const activeRef = React.useRef(active);

  React.useEffect(() => {
    levelRef.current = level;
    activeRef.current = active;
  }, [level, active]);

  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      setHeights((prev) => {
        const next = prev.slice();
        for (let i = next.length - 1; i > 0; i--) next[i] = next[i - 1];
        if (activeRef.current) {
          const jitter = 0.5 + Math.random() * 0.5;
          next[0] = Math.max(0.08, Math.min(1, levelRef.current * jitter * 1.7));
        } else {
          for (let i = 0; i < next.length; i++) next[i] += (0.08 - next[i]) * 0.25;
          next[0] = 0.08;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const color = tone === "coral" ? "bg-primary" : "bg-yashorbit-blue dark:bg-secondary-foreground";
  // mirror the half-array outward from the centre
  const mirrored = [...heights.slice(1).reverse(), ...heights];

  return (
    <div className={cn("flex h-16 items-center justify-center gap-[3px]", className)} aria-hidden>
      {mirrored.map((h, i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-full transition-[height] duration-75", color, !active && "opacity-40")}
          style={{ height: `${Math.round((h ?? 0.08) * 100)}%` }}
        />
      ))}
    </div>
  );
}
