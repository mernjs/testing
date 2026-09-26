"use client";

import {
  FileText, Clock, Users, Layers, Headphones,
  Search, BookOpen, PenTool, Share2, BarChart3, CheckCircle2, Megaphone, Target, Zap, Globe, AlignLeft,
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
import { contentMarketingFaqs } from "./faqs";

export default function ContentMarketingContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Content Marketing Services"
        subtitle="Authority-building content that attracts & converts."
        description="Create valuable, search-friendly, and conversion-focused content that builds authority, attracts your target audience, and drives long-term business growth."
        icon={FileText}
        image="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Turn readers into leads with high-value content"
        paragraphs={[
          "Great content isn't just about writing — it's about answering the exact questions your ideal prospects are searching for, establishing your brand as an industry leader, and guiding readers seamlessly toward conversion.",
          "We craft research-backed content strategies that align search intent with business objectives, delivering consistent articles, guides, case studies, and assets that rank high and build lasting brand authority.",
        ]}
        stats={[
          { label: "Content Turnaround", value: "3–5 Days / Article", icon: Clock },
          { label: "Writer Expertise", value: "Niche Specialists", icon: Users },
          { label: "SEO Alignment", value: "100% Intent-Mapped", icon: Search },
          { label: "Reporting", value: "Monthly Traffic & Leads", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Content marketing services"
        description="Comprehensive content creation and strategy for every stage of your buyer's journey."
        items={[
          { title: "SEO Blog Writing", description: "Search-optimised articles that target commercial and informational queries to drive organic traffic." },
          { title: "Content Strategy & Planning", description: "Audience research, topic cluster mapping, and editorial calendar management." },
          { title: "Long-Form Guides & Whitepapers", description: "In-depth authoritative resources built for B2B lead generation and thought leadership." },
          { title: "Case Studies & Client Stories", description: "Proof-driven stories highlighting customer successes to build trust with prospects." },
          { title: "Landing Page Copywriting", description: "High-converting copy designed to turn visitors into leads and paying customers." },
          { title: "Content Refresh & Optimisation", description: "Upgrading legacy content to recover lost rankings and boost engagement." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our content approach"
        description="How we create content that stands out in crowded search results."
        items={[
          { title: "Audience-First Research", description: "Understanding customer pain points, intent, and buying triggers before writing a single word." },
          { title: "Topic Clusters & Silos", description: "Structuring content in interconnected hubs to build topical authority in Google." },
          { title: "Brand Voice Alignment", description: "Ensuring every piece of content matches your brand's unique tone and expertise." },
          { title: "Multi-Channel Distribution", description: "Repurposing articles into social posts, email newsletters, and lead magnets." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Tools & workflow stack"
        items={[
          { name: "WordPress", category: "CMS", icon: Globe },
          { name: "Grammarly & Hemingway", category: "Quality", icon: PenTool },
          { name: "Surfer SEO", category: "Optimization", icon: Search },
          { name: "Ahrefs & SEMrush", category: "Topic Research", icon: BarChart3 },
          { name: "Notion & Trello", category: "Workflow", icon: AlignLeft },
          { name: "Canva & Figma", category: "Graphics", icon: BookOpen },
        ]}
      />

      <CurriculumTimeline
        title="Content creation workflow"
        description="Our step-by-step process for publishing top-ranking content."
        modules={[
          { title: "Topic Research & Brief", duration: "Phase 1", topics: ["Keyword research", "Search intent audit", "Outline & brief creation"] },
          { title: "Drafting & Editing", duration: "Phase 2", topics: ["Subject matter writing", "Fact checking", "SEO optimization & proofreading"] },
          { title: "Design & Formatting", duration: "Phase 3", topics: ["Custom illustrations", "Formatting", "Internal link insertion"] },
          { title: "Publishing & Promotion", duration: "Phase 4", topics: ["CMS upload", "Meta tag setup", "Social snippet creation"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Content ecosystem framework"
        description="The four pillars of a successful content strategy."
        layers={[
          { name: "Pillar Content", description: "In-depth comprehensive guides establishing core industry topics.", tech: "Authority Building", icon: BookOpen },
          { name: "Cluster Articles", description: "Targeted sub-topic posts answering specific user questions.", tech: "Traffic Growth", icon: FileText },
          { name: "Lead Magnets", description: "Downloadable ebooks and templates capturing lead contacts.", tech: "Lead Gen", icon: Target },
          { name: "Repurposed Assets", description: "Social snippets and newsletters amplifying content reach.", tech: "Distribution", icon: Share2 },
        ]}
      />

      <FAQAccordion faqs={contentMarketingFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "SEO Services", description: "Rank higher with technical and on-page SEO.", href: "/services/digital-marketing/seo", icon: Search },
          { title: "Social Media Marketing", description: "Amplify your content across social platforms.", href: "/services/digital-marketing/social-media-marketing", icon: Share2 },
          { title: "Email Marketing", description: "Nurture content readers into paying clients.", href: "/services/digital-marketing/email-marketing", icon: Headphones },
        ]}
      />

      <DetailCTA
        heading="Ready to elevate your content strategy?"
        description="Partner with our content marketing team to build authority and attract qualified leads."
        ctaLabel="Get a Content Strategy Plan"
        category="digital-marketing"
        subService="content-marketing"
      />
    </div>
  );
}
