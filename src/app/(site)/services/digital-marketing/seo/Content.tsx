"use client";

import {
  Search, Clock, Users, Layers, Headphones,
  Globe, FileText, Link2, BarChart3, Zap, MapPin, ShoppingCart, TrendingUp, Settings,
  Megaphone, Target,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ArchitectureOverview from "@/components/sections/ArchitectureOverview";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import DeliveryTimeline from "@/components/sections/DeliveryTimeline";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { seoFaqs } from "./faqs";

export default function SeoServicesContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="SEO Services"
        subtitle="Rank higher. Drive qualified organic traffic."
        description="Improve your search visibility, attract qualified organic traffic, and build long-term online growth with a comprehensive SEO strategy tailored to your business goals."
        icon={Search}
        image="https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Organic search is your most valuable marketing channel"
        paragraphs={[
          "Unlike paid advertising, organic search traffic compounds over time. Every improvement you make to your SEO — better content, stronger backlinks, faster pages — continues generating traffic long after the work is done.",
          "We build SEO strategies that go beyond rankings. Our approach addresses the full search ecosystem: technical health, on-page relevance, content authority, and off-page trust signals — all working together to deliver sustained, qualified traffic.",
        ]}
        stats={[
          { label: "Average Ramp Time", value: "3–6 Months", icon: Clock },
          { label: "Engagement Model", value: "Monthly Retainer", icon: Users },
          { label: "Coverage", value: "Technical + Content + Links", icon: Layers },
          { label: "Reporting", value: "Monthly Performance Reports", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="SEO services we provide"
        description="A full-spectrum SEO programme covering every factor that influences your organic rankings."
        items={[
          { title: "Technical SEO", description: "Site speed, crawlability, indexation, structured data, and Core Web Vitals optimisation." },
          { title: "On-Page SEO", description: "Keyword targeting, meta tags, heading structure, internal linking, and content relevance." },
          { title: "Off-Page SEO", description: "Ethical link building, digital PR, and authority development across the web." },
          { title: "Local SEO", description: "Google Business Profile optimisation, local citations, and geo-targeted content." },
          { title: "E-commerce SEO", description: "Product page optimisation, category architecture, and faceted navigation handling." },
          { title: "Enterprise SEO", description: "Scalable SEO processes for large websites with thousands of pages." },
          { title: "International SEO", description: "Hreflang implementation, multilingual content strategy, and geo-targeting." },
          { title: "Keyword Research", description: "Deep keyword analysis to identify high-value search opportunities aligned with buyer intent." },
          { title: "Competitor Analysis", description: "Identifying competitor SEO gaps and opportunities to outrank them strategically." },
          { title: "Content Optimisation", description: "Improving existing content for better rankings, relevance, and conversion." },
          { title: "Website SEO Audit", description: "Comprehensive technical and content audit with prioritised recommendations." },
          { title: "Link Building", description: "High-quality, relevant backlink acquisition through outreach and content marketing." },
          { title: "Search Console Optimisation", description: "Using GSC data to fix crawl errors, improve CTR, and identify indexing issues." },
          { title: "SEO Performance Tracking", description: "Rank tracking, traffic monitoring, and conversion attribution reporting." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our SEO approach"
        description="How we build sustainable organic growth — not short-term ranking spikes."
        items={[
          { title: "Audit First, Always", description: "Every engagement starts with a comprehensive technical and content audit before we touch anything." },
          { title: "Intent-Led Keyword Strategy", description: "We target keywords based on buyer intent, not just search volume — so the traffic we drive actually converts." },
          { title: "Technical Precision", description: "Core Web Vitals, crawl budget, structured data, and site architecture optimised as a foundation." },
          { title: "Content That Earns Links", description: "We create content people genuinely want to reference, reducing reliance on outreach-only link building." },
          { title: "Transparent Reporting", description: "Monthly reports showing rankings, organic traffic, backlinks gained, and business impact." },
          { title: "Long-Term Partnership", description: "SEO compounds over time — our retainer model is built for sustainable growth, not quick wins." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Tools & platforms we use"
        items={[
          { name: "Google Search Console", category: "Analytics", icon: Search },
          { name: "Google Analytics 4", category: "Analytics", icon: BarChart3 },
          { name: "Ahrefs", category: "SEO Research", icon: Link2 },
          { name: "SEMrush", category: "SEO Research", icon: TrendingUp },
          { name: "Screaming Frog", category: "Technical SEO", icon: Settings },
          { name: "Google PageSpeed", category: "Performance", icon: Zap },
          { name: "Google Business Profile", category: "Local SEO", icon: MapPin },
          { name: "Schema.org", category: "Structured Data", icon: FileText },
        ]}
      />

      <CurriculumTimeline
        title="Our SEO process"
        description="How we build and execute your SEO strategy from audit to compounding results."
        modules={[
          { title: "SEO Audit & Research", duration: "Week 1–2", topics: ["Technical audit", "Keyword research", "Competitor analysis", "Content gap analysis"] },
          { title: "Strategy & Roadmap", duration: "Week 2–3", topics: ["Priority roadmap", "Content calendar", "Link building plan", "Quick-win identification"] },
          { title: "Technical Fixes", duration: "Month 1", topics: ["Core Web Vitals", "Crawl errors", "Structured data", "Site speed improvements"] },
          { title: "On-Page Optimisation", duration: "Ongoing", topics: ["Meta optimisation", "Content updates", "Internal linking", "UX improvements"] },
          { title: "Content & Link Building", duration: "Ongoing", topics: ["SEO content creation", "Outreach campaigns", "Digital PR", "Authority building"] },
          { title: "Reporting & Iteration", duration: "Monthly", topics: ["Rank tracking", "Traffic analysis", "Backlink report", "Strategy refinement"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="SEO framework overview"
        description="The four pillars of a complete, sustainable SEO programme."
        layers={[
          { name: "Technical Foundation", description: "Site speed, crawlability, mobile usability, and Core Web Vitals — the baseline every SEO strategy depends on.", tech: "Technical SEO", icon: Settings },
          { name: "On-Page Relevance", description: "Keyword-optimised content, structured headings, and internal linking that tells search engines exactly what each page is about.", tech: "On-Page SEO", icon: FileText },
          { name: "Content Authority", description: "In-depth, search-intent-matched content that attracts organic links, earns rankings, and converts visitors.", tech: "Content SEO", icon: Globe },
          { name: "Off-Page Trust", description: "High-quality backlinks from relevant, authoritative sources that signal trust and domain authority to search engines.", tech: "Link Building", icon: Link2 },
        ]}
      />

      <ChecklistGrid
        id="business-benefits"
        title="Business benefits of SEO"
        description="Why organic search is the highest-ROI digital marketing channel over the long term."
        items={[
          { title: "Compounding Returns", description: "Unlike paid ads, SEO results compound. Traffic and leads grow month over month as authority builds." },
          { title: "Lower Cost Per Lead", description: "Organic traffic has no per-click cost. Over time, SEO consistently delivers the lowest CPL of any digital channel." },
          { title: "High-Intent Visitors", description: "People who find you through search are actively looking for what you offer — they convert at higher rates." },
          { title: "Brand Credibility", description: "Ranking on page one signals authority and trustworthiness to potential customers before they even click." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry SEO use cases"
        description="How we apply SEO strategy across different business types and industries."
        projects={[
          { title: "B2B SaaS SEO", description: "Doubling organic lead volume for a SaaS product by targeting high-intent, solution-aware keywords and building topical authority.", skills: ["Technical SEO", "Content", "Link Building"] },
          { title: "Local Service Business", description: "Taking a local service business from page 3 to page 1 for core city-specific keywords in under 6 months.", skills: ["Local SEO", "Google Business", "Reviews"] },
          { title: "E-commerce Growth", description: "Increasing organic revenue for an online store by 180% through product page optimisation and category SEO.", skills: ["E-commerce SEO", "Content", "Technical"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our SEO team"
            features={[
              { name: "White-Hat, Sustainable SEO", desc: "We build organic growth through legitimate strategies that withstand Google algorithm updates." },
              { name: "Full-Funnel Strategy", desc: "From awareness to conversion — we optimise for traffic that actually turns into leads and revenue." },
              { name: "Transparent Monthly Reporting", desc: "You always know what we're doing and why, with clear data on rankings, traffic, and impact." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement model"
            features={[
              { name: "Monthly SEO Retainer", desc: "Ongoing monthly engagement covering strategy, execution, reporting, and continuous optimisation." },
              { name: "Project-Based SEO", desc: "One-time SEO audit and implementation sprints for businesses that need a specific deliverable." },
              { name: "Consultant Support", desc: "Advisory SEO support for in-house teams that need expert guidance without full outsourcing." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="When to expect SEO results"
        description="Realistic timelines for organic growth — because good SEO takes time but compounds strongly."
        bands={[
          { scope: "Technical & Quick Wins", duration: "Month 1–2", fill: 25, description: "Technical fixes, on-page updates, and quick-win content improvements." },
          { scope: "Ranking Improvements", duration: "Month 3–6", fill: 60, description: "Target keywords begin moving to page one and organic traffic grows noticeably." },
          { scope: "Authority & Compounding Growth", duration: "Month 6+", fill: 100, description: "Domain authority grows, rankings stabilise, and organic traffic compounds month over month." },
        ]}
      />

      <FAQAccordion faqs={seoFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Performance Marketing", description: "Accelerate growth with paid search and social advertising.", href: "/services/digital-marketing/performance-marketing", icon: BarChart3 },
          { title: "Content Marketing", description: "Build the content engine that powers your SEO rankings.", href: "/services/digital-marketing/content-marketing", icon: FileText },
          { title: "Local Digital Marketing", description: "Dominate local search results and Google Maps.", href: "/services/digital-marketing/local-digital-marketing", icon: MapPin },
        ]}
      />

      <DetailCTA
        heading="Ready to grow your organic traffic?"
        description="Let's build an SEO strategy that delivers compounding, qualified traffic to your business."
        ctaLabel="Get a Free SEO Audit"
        category="digital-marketing"
        subService="seo"
      />
    </div>
  );
}
