"use client";

import {
  Star, Clock, Users, Layers, Headphones,
  ShieldCheck, Eye, Search, Megaphone,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { ormFaqs } from "./faqs";

export default function OrmContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Online Reputation Management"
        subtitle="Protect & strengthen your digital brand reputation."
        description="Protect and strengthen your digital reputation by monitoring online presence, managing customer feedback, and improving brand perception across review platforms and search results."
        icon={Star}
        image="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Build trust and protect your brand's digital identity"
        paragraphs={[
          "Your digital reputation dictates whether potential clients choose you or your competitors. Unaddressed negative feedback or poor search result signals can erode brand trust quickly.",
          "We offer proactive reputation management — monitoring mention signals, generating positive review momentum, and ensuring your brand presents authority across search engines.",
        ]}
        stats={[
          { label: "Monitoring", value: "24/7 Mention Tracking", icon: Eye },
          { label: "Review Growth", value: "Automated Workflows", icon: Star },
          { label: "Search Control", value: "SERP Suppression", icon: Search },
          { label: "Support", value: "Crisis Response", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="ORM services"
        description="Proactive strategies for review generation, sentiment tracking, and brand protection."
        items={[
          { title: "Review Generation & Management", description: "Automated campaigns to earn 5-star reviews on Google, Trustpilot, and industry platforms." },
          { title: "SERP Reputation Suppression", description: "Ranking positive brand assets to push unrepresentative negative results off page 1." },
          { title: "Brand Sentiment & Mention Monitoring", description: "Real-time tracking of brand mentions across news, social media, and review sites." },
          { title: "Crisis Management & PR", description: "Strategic response plans and public relations support during brand crises." },
        ]}
      />

      <FAQAccordion faqs={ormFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Local Digital Marketing", description: "Boost your local Google reviews and business profile.", href: "/services/digital-marketing/local-digital-marketing", icon: Star },
          { title: "Social Media Marketing", description: "Maintain active and positive social media customer relations.", href: "/services/digital-marketing/social-media-marketing", icon: Megaphone },
        ]}
      />

      <DetailCTA
        heading="Take control of your online reputation"
        description="Protect your brand and build trust with prospective customers today."
        ctaLabel="Get Reputation Audit"
        category="digital-marketing"
        subService="online-reputation-management"
      />
    </div>
  );
}
