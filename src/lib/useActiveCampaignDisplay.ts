"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Audience, PopupTemplate, PopupTriggerType, PopupFrequency } from "@/lib/offers/constants";

export interface ActiveDisplayStrip {
  message: string;
  discountText: string;
  ctaText: string;
  ctaHref: string;
  showCountdown: boolean;
  allowClose: boolean;
}

export interface ActiveDisplayPopup {
  template: PopupTemplate;
  emoji: string;
  heading: string;
  offerTitle: string;
  offerBadge: string;
  ctaText: string;
  ctaHref: string;
  showCountdown: boolean;
  trigger: { type: PopupTriggerType; value: number };
  frequency: PopupFrequency;
}

export interface ActiveDisplay {
  active: boolean;
  campaign?: { id: string; slug: string; name: string; endDate: string };
  audience?: Audience;
  strip: ActiveDisplayStrip | null;
  popup: ActiveDisplayPopup | null;
}

const POLL_MS = 90_000; // re-check periodically so a campaign transition (expiry/rotation) shows up without a hard reload
const INACTIVE: ActiveDisplay = { active: false, strip: null, popup: null };

/**
 * Single shared fetch for both the top strip and the popup — one request per
 * page/poll tick, never two. If the campaign API fails, this resolves to
 * "inactive" rather than throwing, so the promotional layer degrades
 * gracefully and never breaks the rest of the site.
 */
export function useActiveCampaignDisplay(): ActiveDisplay {
  const pathname = usePathname();
  const [data, setData] = useState<ActiveDisplay>(INACTIVE);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/offers/active-campaign?page=${encodeURIComponent(pathname)}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`status ${res.status}`);
        const json = (await res.json()) as ActiveDisplay;
        if (!cancelled) setData(json.active ? json : INACTIVE);
      } catch {
        if (!cancelled) setData(INACTIVE);
      }
    }

    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pathname]);

  return data;
}
