"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Code2, Bot, Users, GraduationCap, Briefcase } from "lucide-react";
import OffersHero from "@/components/offers/OffersHero";
import AudienceSelector from "@/components/offers/AudienceSelector";
import DealOfTheDaySection from "@/components/offers/DealOfTheDaySection";
import CategoryOffersSection from "@/components/offers/CategoryOffersSection";
import FlashDealsStrip from "@/components/offers/FlashDealsStrip";
import WhyYashOrbitSection from "@/components/offers/WhyYashOrbitSection";
import HowItWorksSection from "@/components/offers/HowItWorksSection";
import OffersFaqSection from "@/components/offers/OffersFaqSection";
import FinalCtaSection from "@/components/offers/FinalCtaSection";
import StickyMobileClaimBar from "@/components/offers/StickyMobileClaimBar";
import DesktopScrollCta from "@/components/offers/DesktopScrollCta";
import ExitIntentModal from "@/components/offers/ExitIntentModal";
import ClaimOfferModal from "@/components/offers/ClaimOfferModal";
import { useOfferTracking } from "@/lib/useOfferTracking";
import { PUBLIC_AUDIENCE_TABS, type PublicAudienceTabKey } from "@/lib/offers/constants";
import type { SerializedCampaign } from "@/lib/offers/campaigns";
import type { SerializedOffer } from "@/lib/offers/offers";
import type { CategorySlug } from "@/lib/categories";

const CATEGORY_META: Record<CategorySlug, { id: string; icon: typeof Code2; title: string; description: string }> = {
  "software-development": {
    id: "software-development-offers",
    icon: Code2,
    title: "Software Development Offers",
    description: "Web, mobile, AI and cloud engineering — for business clients ready to build.",
  },
  "ai-automations": {
    id: "ai-automation-offers",
    icon: Bot,
    title: "AI & Automation Offers",
    description: "Automate your business with AI agents, chatbots, and intelligent workflows.",
  },
  "resource-augmentation": {
    id: "hiring-offers",
    icon: Users,
    title: "Developer Hiring Offers",
    description: "Hire pre-vetted developers — individual, dedicated team, or project-based.",
  },
  "industrial-training": {
    id: "training-offers",
    icon: GraduationCap,
    title: "Student Training Offers",
    description: "Launch your tech career for less — industry-focused, mentor-led programs.",
  },
  "internship-program": {
    id: "internship-offers",
    icon: Briefcase,
    title: "Internship Offers",
    description: "Turn your skills into real experience — live projects, mentorship, certificate.",
  },
};

const DEFAULT_ORDER: CategorySlug[] = [
  "software-development",
  "ai-automations",
  "resource-augmentation",
  "industrial-training",
  "internship-program",
];

const TAB_PRIORITY: Record<PublicAudienceTabKey, CategorySlug[]> = {
  CLIENT: ["software-development", "ai-automations", "resource-augmentation"],
  STUDENT: ["industrial-training", "internship-program"],
  HIRING: ["resource-augmentation"],
};

function orderedCategories(tab: PublicAudienceTabKey | null): CategorySlug[] {
  if (!tab) return DEFAULT_ORDER;
  const priority = TAB_PRIORITY[tab];
  const rest = DEFAULT_ORDER.filter((c) => !priority.includes(c));
  return [...priority, ...rest];
}

export default function OffersContent({
  campaign,
  offers,
  faqs,
}: {
  campaign: SerializedCampaign | null;
  offers: SerializedOffer[];
  faqs: { question: string; answer: string }[];
}) {
  const [tab, setTab] = useState<PublicAudienceTabKey | null>(null);
  const [claimOffer, setClaimOffer] = useState<SerializedOffer | null>(null);
  const track = useOfferTracking(campaign?._id ?? "");
  const impressionsFired = useRef(false);

  const tabAudiences = tab ? PUBLIC_AUDIENCE_TABS.find((t) => t.key === tab)?.matches : undefined;
  const visibleOffers = useMemo(() => {
    if (!tabAudiences) return offers;
    return offers.filter((o) => o.audience.includes("ALL") || o.audience.some((a) => tabAudiences.includes(a)));
  }, [offers, tabAudiences]);

  const dealOfTheDay = offers.find((o) => o.isDealOfTheDay) ?? null;
  const flashDeals = visibleOffers.filter((o) => o.isFlashDeal);
  const categories = orderedCategories(tab);

  useEffect(() => {
    if (!campaign || impressionsFired.current) return;
    impressionsFired.current = true;
    track("campaign_view", {});
    for (const offer of offers) track("offer_view", { offerId: offer._id, category: offer.category }, { once: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign?._id]);

  function handleSelectAudience(key: PublicAudienceTabKey) {
    setTab(key);
    const id = CATEGORY_META[TAB_PRIORITY[key][0]].id;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleClaim(offer: SerializedOffer) {
    track("offer_click", { offerId: offer._id, category: offer.category, audience: tab ?? undefined }, { once: true });
    setClaimOffer(offer);
  }

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <OffersHero campaign={campaign} onSelectAudience={handleSelectAudience} />

      {campaign && <AudienceSelector selected={tab} onSelect={setTab} />}

      {dealOfTheDay && <DealOfTheDaySection offer={dealOfTheDay} onClaim={handleClaim} />}

      {flashDeals.length > 0 && <FlashDealsStrip offers={flashDeals} onClaim={handleClaim} />}

      {campaign && <DesktopScrollCta campaignId={campaign._id} offer={dealOfTheDay ?? offers[0] ?? null} onClaim={handleClaim} />}

      {categories.map((category, i) => {
        const meta = CATEGORY_META[category];
        const categoryOffers = visibleOffers.filter((o) => o.category === category);
        return (
          <CategoryOffersSection
            key={category}
            id={meta.id}
            icon={meta.icon}
            title={meta.title}
            description={meta.description}
            offers={categoryOffers}
            onClaim={handleClaim}
            tone={i % 2 === 0 ? "default" : "muted"}
          />
        );
      })}

      <WhyYashOrbitSection />
      <HowItWorksSection />
      <OffersFaqSection faqs={faqs} />
      <FinalCtaSection
        hasCampaign={Boolean(campaign)}
        campaignId={campaign?._id}
        onExploreOffers={() => document.getElementById(CATEGORY_META[DEFAULT_ORDER[0]].id)?.scrollIntoView({ behavior: "smooth" })}
      />

      <StickyMobileClaimBar topOffer={dealOfTheDay ?? visibleOffers[0] ?? null} onClaim={handleClaim} />

      {campaign && <ExitIntentModal campaignId={campaign._id} offer={dealOfTheDay ?? offers[0] ?? null} onClaim={handleClaim} />}

      {campaign && <ClaimOfferModal offer={claimOffer} campaignId={campaign._id} onOpenChange={(open) => !open && setClaimOffer(null)} />}
    </div>
  );
}
