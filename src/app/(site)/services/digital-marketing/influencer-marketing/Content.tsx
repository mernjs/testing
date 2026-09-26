"use client";

import {
  Users, Clock, Layers, Headphones,
  Share2, Star, Sparkles, Target,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { influencerMarketingFaqs } from "./faqs";

export default function InfluencerMarketingContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Influencer Marketing"
        subtitle="Amplify your brand through trusted creators."
        description="Connect your brand with relevant creators and communities to increase awareness, engagement, trust, and customer acquisition."
        icon={Users}
        image="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Leverage creator trust to reach your ideal audience"
        paragraphs={[
          "Consumers trust recommendations from niche creators far more than traditional brand advertisements. Partnering with authentic creators gives your brand immediate credibility.",
          "We manage full-cycle creator partnerships — from talent discovery and contract negotiation to campaign execution and ROI tracking."
        ]}
        stats={[
          { label: "Vetting", value: "100% Authentic Audience", icon: Star },
          { label: "Content Type", value: "UGC & Sponsored Posts", icon: Sparkles },
          { label: "Platforms", value: "IG, YouTube, TikTok", icon: Share2 },
          { label: "Management", value: "Turnkey Campaign Execution", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Influencer campaign offerings"
        description="Strategic influencer and creator collaboration services."
        items={[
          { title: "Creator Discovery & Vetting", description: "Identifying aligned nano, micro, and macro creators with authentic engagement." },
          { title: "UGC Ad Creation", description: "Sourcing authentic creator videos to fuel high-performing paid ad campaigns." },
          { title: "Contracting & Licensing Management", description: "Handling creator negotiations, usage rights, and deliverable schedules." },
          { title: "Campaign ROI Tracking", description: "Tracking promo codes, affiliate links, and branded sentiment metrics." },
        ]}
      />

      <FAQAccordion faqs={influencerMarketingFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Social Media Marketing", description: "Build your brand's organic social presence.", href: "/services/digital-marketing/social-media-marketing", icon: Share2 },
          { title: "Performance Marketing", description: "Amplify creator UGC videos with paid social ads.", href: "/services/digital-marketing/performance-marketing", icon: Target },
        ]}
      />

      <DetailCTA
        heading="Ready to launch your influencer campaign?"
        description="Connect with top creators in your niche and amplify your brand reach."
        ctaLabel="Get Influencer Strategy"
        category="digital-marketing"
        subService="influencer-marketing"
      />
    </div>
  );
}
