import { NextRequest, NextResponse } from "next/server";
import { getActiveCampaignForPage } from "@/lib/offers/campaigns";
import { getPopupTemplateMeta, audienceForPath } from "@/lib/offers/constants";
import { whatsapp, phone } from "@/lib/contact";

function resolveCtaHref(actionType: string, actionValue: string): string {
  if (actionType === "whatsapp") return whatsapp.href;
  if (actionType === "call") return phone.href;
  return actionValue || "/offers";
}

/**
 * Public, best-effort read for the global top strip + popup — the single
 * source both components fetch from (never duplicated queries). Never
 * throws a 4xx/5xx for "nothing to show"; an inactive/missing campaign is a
 * normal `{ active: false }` response so the calling component can hide
 * gracefully without treating it as an error.
 */
export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get("page") || "/";

  try {
    const campaign = await getActiveCampaignForPage(page);
    if (!campaign) return NextResponse.json({ active: false, serverTime: Date.now() });

    const display = campaign.display;
    if (!display?.strip?.enabled && !display?.popup?.enabled) {
      return NextResponse.json({ active: false, serverTime: Date.now() });
    }

    const base = {
      id: campaign._id,
      slug: campaign.slug,
      name: campaign.name,
      startDate: campaign.startDate.toISOString(),
      endDate: campaign.endDate.toISOString(),
    };

    const strip = display.strip?.enabled
      ? {
          message: display.strip.message || campaign.name,
          discountText: display.strip.discountText,
          ctaText: display.strip.ctaText,
          ctaHref: resolveCtaHref(display.strip.ctaActionType, display.strip.ctaActionValue),
          showCountdown: display.strip.showCountdown,
          allowClose: display.strip.allowClose,
        }
      : null;

    const templateMeta = getPopupTemplateMeta(display.popup?.template);
    const popup = display.popup?.enabled
      ? {
          template: display.popup.template,
          emoji: templateMeta.emoji,
          heading: templateMeta.heading,
          ctaText: display.popup.ctaText,
          ctaHref: resolveCtaHref(display.popup.ctaActionType, display.popup.ctaActionValue),
          showCountdown: display.popup.showCountdown,
          trigger: { type: display.popup.triggerType, value: display.popup.triggerValue },
          frequency: display.popup.frequency,
        }
      : null;

    return NextResponse.json({
      active: true,
      // Lets every countdown use the server clock instead of the visitor's (possibly wrong) device clock.
      serverTime: Date.now(),
      campaign: base,
      audience: audienceForPath(page),
      strip,
      popup,
    });
  } catch (err) {
    console.error("Failed to resolve active campaign display (hiding promotions gracefully)", err);
    // A transient DB failure must NOT read as "no campaign": the client keeps showing the last good strip/popup
    // on a 5xx, but tears them down on an honest `{ active: false }`.
    return NextResponse.json({ error: "temporarily_unavailable" }, { status: 503 });
  }
}
