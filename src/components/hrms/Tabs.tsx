"use client";

import { useState, type ReactNode } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export interface TabDef {
  key: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
  hint?: string;
}

export default function Tabs({
  tabs,
  initial,
  syncParam,
}: {
  tabs: TabDef[];
  initial?: string;
  /** When set, the active tab is mirrored to this URL search param so it
   *  survives a server re-render (e.g. a nested control calling router.replace). */
  syncParam?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstEnabled = tabs.find((t) => !t.disabled)?.key ?? tabs[0]?.key;
  const [active, setActive] = useState(
    initial && tabs.some((t) => t.key === initial && !t.disabled) ? initial : firstEnabled
  );

  function select(key: string) {
    setActive(key);
    if (syncParam) {
      const params = new URLSearchParams(searchParams.toString());
      params.set(syncParam, key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/40 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            disabled={t.disabled}
            onClick={() => !t.disabled && select(t.key)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              t.disabled
                ? "cursor-not-allowed text-muted-foreground/40"
                : active === t.key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
            )}
            title={t.disabled ? t.hint : undefined}
          >
            {t.label}
            {t.disabled && <span className="ml-1.5 text-[10px] uppercase tracking-wide">Phase 2</span>}
          </button>
        ))}
      </div>
      <div>{tabs.find((t) => t.key === active)?.content}</div>
    </div>
  );
}
