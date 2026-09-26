"use client";

import {
  Target, Clock, Users, Layers, Headphones,
  BarChart3, Zap, ShieldCheck, Mail, Globe, CheckCircle2,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { leadGenerationFaqs } from "./faqs";

export default function LeadGenerationContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Lead Generation Services"
        subtitle="Qualified business opportunities at scale."
        description="Generate qualified business opportunities through targeted campaigns, optimized landing experiences, and data-driven lead acquisition strategies."
        icon={Target}
        image="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Fill your sales pipeline with high-intent leads"
        paragraphs={[
          "Consistent revenue growth requires a predictable stream of qualified sales opportunities. Generic traffic is useless if it doesn't translate into booked meetings or incoming quotes.",
          "We build end-to-end lead acquisition systems combining high-converting paid ads, landing pages, and lead scoring to keep your pipeline full.",
        ]}
        stats={[
          { label: "Lead Delivery", value: "Real-time CRM Sync", icon: Zap },
          { label: "Qualification", value: "Strict Screening", icon: CheckCircle2 },
          { label: "Cost Per Lead", value: "Optimized CPL", icon: BarChart3 },
          { label: "Support", value: "Dedicated Account Manager", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Lead generation solutions"
        description="Targeted acquisition strategies designed for B2B and B2C sales growth."
        items={[
          { title: "B2B LinkedIn Lead Gen", description: "Target decision-makers by industry, job title, and company size." },
          { title: "Google Search Lead Ads", description: "Capture high-intent prospects actively searching for your service." },
          { title: "High-Converting Landing Pages", description: "Dedicated conversion funnels built to maximize lead opt-in rates." },
          { title: "Lead Nurturing & Email Automation", description: "Automated follow-ups that turn cold inquiries into sales-ready leads." },
          { title: "CRM & Sales Pipeline Integration", description: "Instant synchronization with HubSpot, Salesforce, and custom CRMs." },
        ]}
      />

      <FAQAccordion faqs={leadGenerationFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Performance Marketing", description: "Drive instant lead volume with Google & Meta Ads.", href: "/services/digital-marketing/performance-marketing", icon: BarChart3 },
          { title: "Conversion Rate Optimization", description: "Convert more landing page traffic into qualified leads.", href: "/services/digital-marketing/conversion-rate-optimization", icon: Zap },
        ]}
      />

      <DetailCTA
        heading="Ready to grow your sales pipeline?"
        description="Talk to our lead generation strategists and start receiving qualified leads."
        ctaLabel="Get a Lead Gen Proposal"
        category="digital-marketing"
        subService="lead-generation"
      />
    </div>
  );
}
