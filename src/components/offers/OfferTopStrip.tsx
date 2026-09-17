"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Flame, X } from "lucide-react";
import { useOfferTracking } from "@/lib/useOfferTracking";
import type { ActiveDisplayStrip } from "@/lib/useActiveCampaignDisplay";

const CLOSED_KEY_PREFIX = "offer_strip_closed_session:";

function isClosed(campaignId: string): boolean {
  try {
    return Boolean(window.sessionStorage.getItem(CLOSED_KEY_PREFIX + campaignId));
  } catch {
    return false;
  }
}

/** Compact "Ends in 02D 14H 32M" text — the strip's own slim format, distinct from the hero's big-box `CampaignCountdown`. */
function CompactCountdown({ endDate }: { endDate: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      const total = Math.max(new Date(endDate).getTime() - Date.now(), 0);
      if (total <= 0) {
        setText("Ending soon");
        return;
      }
      const days = Math.floor(total / 86400000);
      const hours = Math.floor((total / 3600000) % 24);
      const minutes = Math.floor((total / 60000) % 60);
      setText(days > 0 ? `Ends in ${days}D ${hours}H` : `Ends in ${hours}H ${minutes}M`);
    }
    tick();
    const interval = setInterval(tick, 30_000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!text) return null;
  return <span className="text-background/70">{text}</span>;
}

/** Renders before <Header/> and publishes its own height via `--offer-strip-h` so the fixed Header (and <main>'s top padding) can offset around it — see (site)/layout.tsx and Header.tsx. */
export default function OfferTopStrip({
  campaign,
  strip,
  endDate,
}: {
  campaign: { id: string; slug: string; name: string };
  strip: ActiveDisplayStrip;
  endDate: string;
}) {
  const [closed, setClosed] = useState(() => isClosed(campaign.id));
  const ref = useRef<HTMLDivElement>(null);
  const track = useOfferTracking(campaign.id);
  const viewedRef = useRef<string | null>(null);

  useEffect(() => {
    if (viewedRef.current === campaign.id) return;
    viewedRef.current = campaign.id;
    track("strip_view", {});
  }, [campaign.id, track]);

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (closed || !el) {
      root.style.setProperty("--offer-strip-h", "0px");
      return;
    }
    const observer = new ResizeObserver(() => {
      root.style.setProperty("--offer-strip-h", `${el.offsetHeight}px`);
    });
    observer.observe(el);
    root.style.setProperty("--offer-strip-h", `${el.offsetHeight}px`);
    return () => {
      observer.disconnect();
      root.style.setProperty("--offer-strip-h", "0px");
    };
  }, [closed]);

  function handleClose() {
    try {
      window.sessionStorage.setItem(CLOSED_KEY_PREFIX + campaign.id, "1");
    } catch {
      /* ignore */
    }
    track("strip_close", {});
    setClosed(true);
  }

  if (closed) return null;

  return (
    <div ref={ref} className="fixed inset-x-0 top-0 z-[60] w-full bg-foreground text-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2 text-center sm:justify-between sm:text-left">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-xs sm:text-sm">
          <span className="inline-flex items-center gap-1 font-bold">
            <Flame className="size-3.5 shrink-0 fill-current text-primary" />
            {strip.message}
          </span>
          {strip.discountText && <span className="font-black text-primary">{strip.discountText}</span>}
          {strip.showCountdown && <CompactCountdown endDate={endDate} />}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={strip.ctaHref}
            onClick={() => track("strip_click", {})}
            className="rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105 sm:text-sm"
          >
            {strip.ctaText}
          </Link>
          {strip.allowClose && (
            <button
              type="button"
              onClick={handleClose}
              aria-label="Dismiss offer"
              className="rounded-full p-1 text-background/70 transition-colors hover:bg-background/10 hover:text-background"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
