"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlassCard from "@/components/admin/GlassCard";
import { cn } from "@/lib/utils";
import type { ThemedColor } from "@/lib/category-colors";

function resolveColor(color: string | ThemedColor | undefined, isDark: boolean): string | undefined {
  if (!color) return undefined;
  return typeof color === "string" ? color : isDark ? color.dark : color.light;
}

function useCountUp(target: number, durationMs = 600) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    let frame: number;

    function tick(timestamp: number) {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}

function TrendBadge({ value }: { value: number }) {
  const isUp = value > 0;
  const isFlat = value === 0;
  return (
    <Badge
      className={cn(
        "h-5 px-1.5 text-[11px] font-semibold",
        isFlat
          ? "bg-muted text-muted-foreground"
          : isUp
            ? "bg-green-500/15 text-green-600 dark:text-green-400"
            : "bg-destructive/15 text-destructive"
      )}
    >
      {isFlat ? <Minus className="size-3" /> : isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
      {isUp ? "+" : ""}
      {value}%
    </Badge>
  );
}

export default function KpiCard({
  label,
  value,
  accent = false,
  icon,
  accentColor,
  trend,
  suffix,
}: {
  label: string;
  value: number;
  accent?: boolean;
  /** A rendered icon element (e.g. `<Code className="size-4" />`) — pass an element, not a component reference, so this can be sent from a Server Component. */
  icon?: ReactNode;
  /** Hex color for the icon chip's gradient — a single hex, or a `{light,dark}`
   * pair resolved client-side per the active theme — when omitted, falls back
   * to the brand `accent` styling. */
  accentColor?: string | ThemedColor;
  /** Growth % vs the previous period; null means "no prior period to compare" (badge is hidden). */
  trend?: number | null;
  /** Appended after the animated number, e.g. `"%"`. */
  suffix?: string;
}) {
  const animated = useCountUp(value);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const resolvedAccentColor = resolveColor(accentColor, mounted && resolvedTheme === "dark");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="h-full">
        <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
          {icon && (
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white shadow-[0_4px_10px_-2px_rgba(0,0,0,0.35)]"
              style={{
                background: resolvedAccentColor
                  ? `linear-gradient(135deg, ${resolvedAccentColor}, ${resolvedAccentColor}cc)`
                  : "linear-gradient(135deg, var(--primary), var(--color-yashorbit-coral))",
              }}
            >
              {icon}
            </motion.div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2">
            <p className={cn("text-2xl font-bold tabular-nums", accent && !resolvedAccentColor && "text-primary")}>
              {animated}
              {suffix}
            </p>
            {typeof trend === "number" && <TrendBadge value={trend} />}
          </div>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}
