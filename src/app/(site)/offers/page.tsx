import type { Metadata } from "next";
import { cache } from "react";
import { getActiveCampaign, serializeCampaign } from "@/lib/offers/campaigns";
import { getPublicOffers, serializeOffer } from "@/lib/offers/offers";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd, defaultOgImage, siteUrl } from "@/lib/seo";
import OffersContent from "./Content";

const loadActiveCampaign = cache(async () => {
  const campaign = await getActiveCampaign();
  if (!campaign) return null;
  const offers = await getPublicOffers({ campaignId: campaign._id });
  return { campaign: serializeCampaign(campaign), offers: offers.map(serializeOffer) };
});

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
  const data = await loadActiveCampaign();
  const title = data
    ? `${data.campaign.name} — Festival Offers | YashOrbit`
    : "Festival Offers | YashOrbit";
  const description = data
    ? `${data.campaign.theme.bannerHeadline ?? data.campaign.name}: limited-time offers on Software Development, AI & Automation, Training, Internships and Developer Hiring at YashOrbit.`
    : "YashOrbit's festival offers on Software Development, AI & Automation, Training, Internships and Developer Hiring — check back for the next live campaign.";
  const image = data?.campaign.bannerImage ?? defaultOgImage;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/offers` },
    ...socialMetadata({ title, description, path: "/offers", image, imageAlt: title }),
  };
}

export default async function OffersPage() {
  const data = await loadActiveCampaign();

  const faqs = data
    ? [...data.campaign.faqs.map((f) => ({ question: f.question, answer: f.answer })), ...GENERIC_FAQS]
    : GENERIC_FAQS;

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Festival Offers", path: "/offers" },
    ]),
    faqJsonLd(faqs),
  ];

  return (
    <>
      {jsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}
      <OffersContent campaign={data?.campaign ?? null} offers={data?.offers ?? []} faqs={faqs} />
    </>
  );
}
