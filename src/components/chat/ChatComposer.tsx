"use client";

import * as React from "react";
import { ArrowUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatComposer({
  disabled,
  streaming,
  maxChars,
  onSend,
  wide = false,
}: {
  disabled?: boolean;
  streaming?: boolean;
  maxChars: number;
  onSend: (text: string) => void;
  wide?: boolean;
}) {
  const [value, setValue] = React.useState("");
  const ref = React.useRef<HTMLTextAreaElement>(null);

  const grow = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  React.useEffect(grow, [value, grow]);

  const submit = () => {
    const text = value.trim();
    if (!text || streaming || disabled) return;
    onSend(text.slice(0, maxChars));
    setValue("");
  };

  const remaining = maxChars - value.length;
  const nearLimit = remaining < 120;

  return (
    <div
      className={cn(
        "bg-background/70 backdrop-blur-xl",
        wide ? "px-0 pb-4 pt-2" : "border-t border-border/50 p-3"
      )}
    >
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border border-border/60 bg-background/80 px-3 py-2 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-3 focus-within:ring-primary/15",
          wide && "shadow-lg shadow-black/5",
          disabled && "opacity-60"
        )}
      >
        <textarea
          ref={ref}
          rows={1}
          value={value}
          disabled={disabled}
          maxLength={maxChars}
          placeholder="Ask about YashOrbit…"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="max-h-52 flex-1 resize-none bg-transparent py-1 text-sm leading-relaxed outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim() || streaming || disabled}
          aria-label="Send message"
          className="flex size-8 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          {streaming ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}
        </button>
      </div>
      <div className="mt-1.5 flex items-center justify-between px-1">
        <p className="text-[10px] text-muted-foreground/60">
          AI-generated · verify important details with our team
        </p>
        {nearLimit && (
          <p className={cn("text-[10px]", remaining < 0 ? "text-destructive" : "text-muted-foreground/70")}>
            {remaining}
          </p>
        )}
      </div>
    </div>
  );
}
