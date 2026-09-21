import type { Metadata } from "next";
import { cache } from "react";
import { resolveOffersPage } from "@/lib/offers/state";
import { dispatchCampaignStart } from "@/lib/offers/subscriptions";
import OffersUpcoming from "@/components/offers/OffersUpcoming";
import OffersFallback from "@/components/offers/OffersFallback";
import StateWatcher from "@/components/offers/StateWatcher";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import { getAvailableBalance } from "@/lib/wallet/redemption";
import { tabForPortalRole } from "@/lib/offers/constants";
import { PORTAL_ROLE_META } from "@/lib/portal-roles";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd, defaultOgImage, siteUrl } from "@/lib/seo";
import OffersContent from "./Content";

// One state resolution per request, shared by generateMetadata and the page body.
const loadPage = cache(() => resolveOffersPage());

const GENERIC_FAQS = [
  {
    question: "Is the offer really available?",
    answer:
      "Yes — the offer you see is the live, currently-active campaign. Its exact end date is shown in the countdown above, and the page automatically stops showing it the moment it expires.",
  },
  {
    question: "Is the discount the same on every service?",
    answer:
      "No. Discounts vary by service and program — each offer card shows its own exact discount. Where no fixed price exists for a service, we show \"Custom Quote\" instead of an invented number.",
  },
  {
    question: "Can I use a coupon on top of an offer's discount?",
    answer:
      "Yes, where a valid coupon applies — the coupon discount stacks with the offer's own discount, capped so the total can never exceed the original price. All coupon validation happens on our server when you claim the offer.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await loadPage();
  const campaign = page.active?.campaign ?? page.next?.campaign ?? null;
  const title =
    page.state === "active" && campaign ? `${campaign.name} — Festival Offers | YashOrbit`
    : page.state === "none" ? "Offers & Deals | YashOrbit"
    : campaign ? `${campaign.name} — Coming Soon | YashOrbit`
    : "Festival Offers | YashOrbit";
  const description =
    page.state === "active" && campaign
      ? `${campaign.theme.bannerHeadline ?? campaign.name}: limited-time offers on Software Development, AI & Automation, Training, Internships and Developer Hiring at YashOrbit.`
      : page.state === "none"
        ? "No festival campaign is live right now. Join the list to get first access to YashOrbit's next offers on software, AI, training, internships and developer hiring."
        : `${campaign?.name ?? "Our next campaign"} is coming soon — get notified when YashOrbit's limited-time offers go live.`;
  const image = campaign?.bannerImage ?? defaultOgImage;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/offers` },
    ...socialMetadata({ title, description, path: "/offers", image, imageAlt: title }),
  };
}

export default async function OffersPage() {
  const page = await loadPage();
  const data = page.active;

  // Personalization: a signed-in portal user gets offers matched to their role plus their spendable credits.
  // Anonymous visitors simply get the generic page — this never blocks rendering.
  let viewer: { firstName: string | null; roleLabel: string | null; credits: number } | null = null;
  let viewerTab: ReturnType<typeof tabForPortalRole> = null;
  try {
    const user = page.state === "active" ? await getCurrentPortalUser() : null;
    if (user) {
      viewerTab = tabForPortalRole(user.role);
      const credits = await getAvailableBalance(user.id).catch(() => 0);
      viewer = { firstName: user.displayName.split(" ")[0] || null, roleLabel: PORTAL_ROLE_META[user.role]?.label ?? null, credits };
    }
  } catch {
    /* treat as anonymous */
  }

  const faqCampaign = data?.campaign ?? page.next?.campaign ?? null;
  const faqs = faqCampaign
    ? [...faqCampaign.faqs.map((f) => ({ question: f.question, answer: f.answer })), ...GENERIC_FAQS]
    : GENERIC_FAQS;

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Festival Offers", path: "/offers" },
    ]),
    faqJsonLd(faqs),
  ];

  // First render of a live campaign kicks off the one-time "it's live" notifications for subscribers (idempotent, never blocks).
  if (page.state === "active" && data) void dispatchCampaignStart({ _id: data.campaign._id, name: data.campaign.name }).catch(() => {});

  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      {page.state === "active" && data && (
        <>
          <StateWatcher serverTime={page.serverTime} endsAt={data.campaign.endDate} pollMs={120_000} />
          <OffersContent campaign={data.campaign} offers={data.offers} faqs={faqs} viewer={viewer} viewerTab={viewerTab} />
        </>
      )}
      {(page.state === "coming_soon" || page.state === "future") && page.next && (
        <OffersUpcoming variant={page.state} campaign={page.next.campaign} preview={page.next.preview} later={page.later} serverTime={page.serverTime} faqs={faqs} />
      )}
      {page.state === "none" && <OffersFallback serverTime={page.serverTime} lastEnded={page.lastEnded} faqs={faqs} />}
    </>
  );
}
