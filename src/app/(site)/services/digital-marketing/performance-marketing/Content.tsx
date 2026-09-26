"use client";

import {
  BarChart3, Clock, Users, Layers, Headphones,
  Search, Globe, Video, Target, TrendingUp, Zap, RefreshCw, DollarSign, FileText, MapPin,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import DeliveryTimeline from "@/components/sections/DeliveryTimeline";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { performanceMarketingFaqs } from "./faqs";

export default function PerformanceMarketingContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Performance Marketing Services"
        subtitle="Every rupee spent, measured and optimised."
        description="Drive measurable business results through targeted advertising campaigns optimised for traffic, leads, conversions, and revenue across Google, Meta, LinkedIn, and YouTube."
        icon={BarChart3}
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Paid advertising that pays for itself"
        paragraphs={[
          "Performance marketing is about one thing: return on investment. Every campaign we run is built around a clear business goal — leads, sales, installs, or sign-ups — and every rupee is tracked back to a measurable outcome.",
          "We manage paid campaigns across Google Ads, Meta (Facebook & Instagram), LinkedIn, and YouTube. Our approach combines audience precision, creative testing, and continuous optimisation to lower your cost per acquisition and maximise ROAS.",
        ]}
        stats={[
          { label: "Campaign Launch", value: "5–7 Business Days", icon: Clock },
          { label: "Platforms Covered", value: "Google, Meta, LinkedIn, YouTube", icon: Users },
          { label: "Optimisation Cycle", value: "Continuous + Weekly Reviews", icon: Layers },
          { label: "Reporting", value: "Weekly + Monthly", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Performance marketing services"
        description="Full-funnel paid advertising across every major digital platform."
        items={[
          { title: "Google Ads", description: "Full Google Ads account management including campaign architecture, bidding strategy, and ongoing optimisation." },
          { title: "Search Ads", description: "Keyword-targeted search campaigns that capture high-intent buyers at the moment they're looking." },
          { title: "Display Ads", description: "Visually compelling banner and responsive ads across the Google Display Network for awareness and remarketing." },
          { title: "YouTube Ads", description: "Video advertising on YouTube to build brand awareness and capture attention at scale." },
          { title: "Meta Ads (Facebook & Instagram)", description: "Audience-targeted campaigns on Facebook and Instagram for lead generation, traffic, and conversions." },
          { title: "LinkedIn Ads", description: "B2B-focused LinkedIn campaigns targeting by job title, company size, industry, and seniority." },
          { title: "Remarketing Campaigns", description: "Re-engaging website visitors and past customers who didn't convert the first time." },
          { title: "Lead Generation Campaigns", description: "Campaigns built specifically to generate qualified leads through forms, landing pages, and offers." },
          { title: "Conversion Campaigns", description: "Bottom-of-funnel campaigns optimised for purchases, sign-ups, and app installs." },
          { title: "App Promotion Campaigns", description: "Campaigns designed to drive mobile app installs and in-app actions." },
          { title: "Campaign Optimisation", description: "Ongoing A/B testing, bid adjustments, audience refinement, and creative rotation to improve performance." },
          { title: "Conversion Tracking", description: "Precise conversion tracking setup across Google Tag Manager, GA4, Meta Pixel, and LinkedIn Insight Tag." },
          { title: "ROAS & ROI Optimisation", description: "Focusing budget on the campaigns, audiences, and creatives that deliver the strongest return on ad spend." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="How we manage your campaigns"
        description="Our systematic approach to paid media that consistently improves performance over time."
        items={[
          { title: "Goal-First Campaign Architecture", description: "Every campaign is structured around a clear business goal before a single ad is written." },
          { title: "Audience Precision", description: "We build tightly defined audience segments based on intent, behaviour, demographics, and remarketing signals." },
          { title: "Creative Testing Framework", description: "Systematic A/B testing of ad copy, visuals, and offers to identify what drives the best response." },
          { title: "Conversion Tracking Accuracy", description: "Proper tracking setup ensures we're optimising toward real business outcomes, not vanity metrics." },
          { title: "Budget Allocation Discipline", description: "Budget flows to top-performing campaigns, audiences, and time windows based on performance data." },
          { title: "Transparent Reporting", description: "Weekly and monthly reports showing spend, results, CPA, ROAS, and key trends in plain language." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Platforms & tools we use"
        items={[
          { name: "Google Ads", category: "Search & Display", icon: Search },
          { name: "Meta Ads Manager", category: "Social Ads", icon: Globe },
          { name: "YouTube Ads", category: "Video", icon: Video },
          { name: "LinkedIn Campaign Manager", category: "B2B Ads", icon: Target },
          { name: "Google Analytics 4", category: "Analytics", icon: BarChart3 },
          { name: "Google Tag Manager", category: "Tracking", icon: Zap },
          { name: "Meta Pixel", category: "Tracking", icon: RefreshCw },
          { name: "Looker Studio", category: "Reporting", icon: FileText },
        ]}
      />

      <CurriculumTimeline
        title="Campaign launch & management process"
        description="How we go from strategy to live, optimised campaigns."
        modules={[
          { title: "Discovery & Strategy", duration: "Week 1", topics: ["Business goal alignment", "Platform selection", "Audience research", "Competitor ad analysis"] },
          { title: "Account & Campaign Setup", duration: "Week 1–2", topics: ["Account structure", "Conversion tracking", "Audience setup", "Ad creative preparation"] },
          { title: "Campaign Launch", duration: "Week 2", topics: ["Live campaign launch", "Initial monitoring", "Budget allocation", "Baseline performance capture"] },
          { title: "Optimisation Phase", duration: "Month 1–3", topics: ["A/B testing", "Bid adjustments", "Audience refinement", "Creative rotation"] },
          { title: "Scaling", duration: "Month 3+", topics: ["Budget scaling", "New audience expansion", "New campaign types", "ROAS maximisation"] },
          { title: "Monthly Reporting", duration: "Ongoing", topics: ["Performance review", "Spend analysis", "ROAS & CPA tracking", "Strategy refinement"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Performance marketing use cases"
        description="Real-world campaign outcomes across different industries and goals."
        projects={[
          { title: "B2B Lead Generation", description: "Generating qualified decision-maker leads for a SaaS company at a target CPL through LinkedIn and Google Search.", skills: ["LinkedIn Ads", "Google Search", "Lead Gen"] },
          { title: "E-commerce ROAS", description: "Achieving 5x ROAS for an online retailer through Google Shopping and Meta dynamic product ads.", skills: ["Google Shopping", "Meta Ads", "ROAS"] },
          { title: "App Install Campaigns", description: "Driving cost-effective mobile app installs across Google UAC and Meta App campaigns.", skills: ["App Campaigns", "Meta Ads", "UAC"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our performance marketing team"
            features={[
              { name: "Results, Not Vanity Metrics", desc: "We optimise for leads, conversions, and revenue — not clicks and impressions." },
              { name: "Multi-Platform Expertise", desc: "Google, Meta, LinkedIn, YouTube — we run unified strategies across all relevant platforms." },
              { name: "Transparent ROI Reporting", desc: "You see exactly where your budget went and what it generated, every single week." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Monthly Management Retainer", desc: "Ongoing campaign management with weekly optimisation and monthly reporting — best for consistent growth." },
              { name: "Campaign Setup + Handover", desc: "We build and launch your campaigns, then hand them to your in-house team with full documentation." },
              { name: "Audit & Strategy", desc: "A one-time audit of your existing ad accounts with an actionable improvement roadmap." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Performance timeline"
        description="How performance marketing results typically develop over the engagement lifecycle."
        bands={[
          { scope: "Learning & Baseline", duration: "Month 1", fill: 30, description: "Campaign launch, data collection, and algorithm learning — results begin but aren't yet optimised." },
          { scope: "Optimisation & Improvement", duration: "Month 2–3", fill: 65, description: "A/B tests inform decisions, CPA drops, ROAS improves, and qualified volume increases." },
          { scope: "Scaling & Maximising Returns", duration: "Month 3+", fill: 100, description: "Proven campaigns scale, new audiences expand reach, and ROAS reaches target or above." },
        ]}
      />

      <FAQAccordion faqs={performanceMarketingFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "SEO Services", description: "Build organic traffic alongside your paid acquisition.", href: "/services/digital-marketing/seo", icon: Search },
          { title: "Lead Generation", description: "Full-funnel lead acquisition strategy beyond paid ads.", href: "/services/digital-marketing/lead-generation", icon: Target },
          { title: "Conversion Rate Optimisation", description: "Turn more of your paid traffic into customers.", href: "/services/digital-marketing/conversion-rate-optimization", icon: TrendingUp },
        ]}
      />

      <DetailCTA
        heading="Ready to run paid campaigns that actually deliver?"
        description="Let's build a performance marketing strategy that turns your ad spend into measurable business growth."
        ctaLabel="Get a Campaign Proposal"
        category="digital-marketing"
        subService="performance-marketing"
      />
    </div>
  );
}
