"use client";

import {
  AreaChart, Clock, Users, Layers, Headphones,
  BarChart3, Zap, ShieldCheck, Search, Eye,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { marketingAnalyticsFaqs } from "./faqs";

export default function MarketingAnalyticsContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Marketing Analytics & Reporting"
        subtitle="Turn data into actionable growth insights."
        description="Turn marketing data into actionable insights with centralized performance tracking across campaigns, channels, audiences, and conversions."
        icon={AreaChart}
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Make confident marketing decisions backed by clean data"
        paragraphs={[
          "Without accurate tracking and attribution, marketing budgets are spent blindly. Disconnected data sources make it impossible to identify which channels truly drive revenue.",
          "We implement robust analytics foundations — server-side tracking, GA4 event architecture, and unified Looker Studio dashboards — giving you complete transparency into your marketing ROI."
        ]}
        stats={[
          { label: "Accuracy", value: "Server-Side Tracking", icon: ShieldCheck },
          { label: "Dashboards", value: "Looker Studio Custom", icon: AreaChart },
          { label: "Attribution", value: "Multi-Touch Models", icon: BarChart3 },
          { label: "Support", value: "Monthly Insights", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Analytics & tracking solutions"
        description="End-to-end data setup, tracking repair, and executive dashboarding."
        items={[
          { title: "GA4 Audit & Custom Configuration", description: "Setting up custom dimensions, parameters, e-commerce tracking, and conversion goals." },
          { title: "Server-Side Tagging & CAPI", description: "Implementing Meta CAPI and GTM server-side containers to protect tracking accuracy." },
          { title: "Executive Looker Studio Dashboards", description: "Consolidating ad platforms, analytics, and CRM data into a single live dashboard." },
          { title: "Attribution Modeling & ROI Reporting", description: "Understanding the exact customer journey and revenue contributions across channels." },
        ]}
      />

      <FAQAccordion faqs={marketingAnalyticsFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Performance Marketing", description: "Optimize paid campaigns using real-time analytics.", href: "/services/digital-marketing/performance-marketing", icon: BarChart3 },
          { title: "Conversion Rate Optimization", description: "Use data insights to optimize site conversions.", href: "/services/digital-marketing/conversion-rate-optimization", icon: Zap },
        ]}
      />

      <DetailCTA
        heading="Ready to get clear visibility into your marketing ROI?"
        description="Let our analytics team audit your tracking setup and build your custom reporting dashboard."
        ctaLabel="Get Analytics Audit"
        category="digital-marketing"
        subService="marketing-analytics"
      />
    </div>
  );
}
