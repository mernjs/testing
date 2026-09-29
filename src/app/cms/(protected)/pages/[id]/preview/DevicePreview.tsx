"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone, RotateCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DEVICES = [
  { key: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
  { key: "tablet", label: "Tablet", icon: Tablet, width: "820px" },
  { key: "mobile", label: "Mobile", icon: Smartphone, width: "390px" },
] as const;

/** The draft in an iframe at real device widths (so the site's responsive layout actually applies). */
export default function DevicePreview({ src }: { src: string }) {
  const [device, setDevice] = useState<(typeof DEVICES)[number]["key"]>("desktop");
  const [nonce, setNonce] = useState(0);
  const [loading, setLoading] = useState(true);
  const width = DEVICES.find((d) => d.key === device)!.width;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 rounded-full border border-border/60 bg-muted/30 p-1" role="tablist" aria-label="Preview width">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              type="button"
              role="tab"
              aria-selected={device === d.key}
              onClick={() => setDevice(d.key)}
              className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors", device === d.key ? "bg-background text-foreground shadow-sm ring-1 ring-border/60" : "text-muted-foreground hover:text-foreground")}
            >
              <d.icon className="size-3.5" /> {d.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => { setLoading(true); setNonce((n) => n + 1); }} className="flex items-center gap-1.5 rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:text-primary">
          <RotateCw className="size-3.5" /> Reload
        </button>
      </div>
      <div className="relative flex justify-center rounded-2xl border border-border/60 bg-muted/30 p-2 sm:p-4">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        <iframe
          key={nonce}
          src={src}
          title="Draft preview"
          onLoad={() => setLoading(false)}
          className="h-[75vh] rounded-xl border border-border/40 bg-background shadow-sm transition-[width] duration-300"
          style={{ width, maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}
