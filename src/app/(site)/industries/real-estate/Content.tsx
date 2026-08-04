"use client";

import {
  Building2, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Map, Database, Blocks, Wifi, FileCheck, ClipboardList,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";

export const realEstateFaqs: { question: string; answer: string }[] = [
  { question: "Can you integrate with our existing MLS or CRM?", answer: "Yes, we regularly integrate with common MLS/RETS feeds and CRM platforms, syncing listing and lead data without requiring a full migration." },
  { question: "Do you build the 3D virtual tours yourselves?", answer: "We build the platform and rendering pipeline for interactive 3D tours and floor plans, integrating with capture tools and 3D scanning hardware your team already uses." },
  { question: "How do you handle fair housing compliance in listings?", answer: "We build compliance-aware listing tools with disclosure templates and targeting safeguards to help your platform stay aligned with fair housing requirements, though final legal review is always recommended." },
  { question: "Can tenants and owners use the same platform?", answer: "Yes, we typically build role-based portals so tenants, owners, and property managers each get the right view and permissions within one system." },
  { question: "Do you offer ongoing support after launch?", answer: "Yes, we offer SLA-backed support plans and continue to refine the platform based on real usage and market data." },
];

export default function RealEstateContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Real Estate"
        subtitle="Modernizing property management."
        description="From immersive 3D virtual tours to automated property management software, we provide the tools real estate professionals need to close deals faster and manage assets efficiently."
        icon={Building2}
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software that closes the gap between listings and closings"
        paragraphs={[
          "Real estate still runs on a patchwork of MLS feeds, spreadsheets, and phone calls, even as buyers and tenants expect a fully digital, remote-friendly experience from the first search to the signed lease.",
          "We build property management platforms, immersive 3D tour experiences, and agent CRM tools that unify fragmented data and automate the operational grind — so your team spends less time on admin and more time closing.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "4–7 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Data Handling", value: "MLS & Fair Housing Aware", icon: ShieldCheck },
          { label: "Support", value: "Priority Response SLA", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What slows real estate teams down once they try to scale past a handful of properties."
        items={[
          { title: "Fragmented Listings Data", description: "Property data is scattered across MLS feeds, spreadsheets, and siloed CRMs, making it hard to keep listings accurate." },
          { title: "Slow, Manual Back-office Processes", description: "Lease renewals, maintenance requests, and vendor coordination still run through phone calls and paper trails at many firms." },
          { title: "Poor Remote-buyer Experience", description: "Buyers increasingly shortlist properties online first, but many portals offer only static photos and vague floor plans." },
          { title: "Disconnected Agent & Client Communication", description: "Leads go cold when follow-ups depend on an agent remembering to call back." },
          { title: "Vacancy & Turnover Costs", description: "Every extra week a unit sits vacant or a listing stays unsold directly erodes margin." },
          { title: "Compliance & Fair Housing Requirements", description: "Listing and advertising platforms must avoid discriminatory targeting and disclose required property information." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we turn fragmented property operations into one connected platform."
        items={[
          { title: "Unified Property Data Layer", description: "Sync MLS feeds, internal listings, and CRM records into one consistent source of truth." },
          { title: "Automated Property Management Workflows", description: "Maintenance requests, lease renewals, and vendor scheduling handled through structured digital workflows." },
          { title: "Immersive 3D & Virtual Tours", description: "Photorealistic walkthroughs and interactive floor plans that let buyers shortlist remotely with confidence." },
          { title: "Automated Lead Nurturing", description: "CRM-driven follow-up sequences that keep leads warm without relying on an agent's memory." },
          { title: "Predictive Vacancy Analytics", description: "Forecasting models that flag units at risk of extended vacancy so teams can act early." },
          { title: "Compliance-aware Listing Tools", description: "Built-in checks and disclosure templates that help listings stay aligned with fair housing requirements." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Real Estate"
        description="The parts of our service catalog most relevant to property and real estate platforms."
        items={[
          { title: "Web App Development", description: "Property management portals and listing platforms.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Agent and tenant apps for on-the-go property management.", href: "/services/mobile-app-development" },
          { title: "AR/VR", description: "Immersive 3D virtual tours and interactive floor plans.", href: "/services/ar-vr" },
          { title: "AI/ML Solutions", description: "Automated property valuation and vacancy prediction models.", href: "/services/ai-ml-solutions" },
          { title: "Prediction & Forecasting", description: "Rent pricing and demand forecasting.", href: "/services/prediction-and-forecasting" },
          { title: "AI Agent", description: "Automated tenant support and leasing inquiry assistants.", href: "/services/ai-agent" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on real estate platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "PostGIS / Geo APIs", category: "Location Data", icon: Map },
          { name: "MongoDB / PostgreSQL", category: "Data Layer", icon: Database },
          { name: "Three.js / WebGL", category: "3D Virtual Tours", icon: Blocks },
          { name: "IoT Sensors", category: "Smart Building Data", icon: Wifi },
          { name: "E-signature APIs", category: "Digital Closings", icon: FileCheck },
          { name: "MLS / RETS Feeds", category: "Listing Data", icon: ClipboardList },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI creates the most leverage across property and leasing operations."
        items={[
          { title: "Automated Valuation Models", description: "Instantly estimate property value using comparable sales, location, and market trends." },
          { title: "Vacancy & Churn Prediction", description: "Flag units and tenants at risk of turnover before it happens." },
          { title: "Smart Lead Scoring", description: "Prioritize the buyer and tenant leads most likely to convert, so agents spend time where it counts." },
          { title: "AI Maintenance Triage", description: "Automatically categorize and route maintenance requests to the right vendor or technician." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Faster Deal Cycles", desc: "Remote-friendly tours and automated workflows shorten the time from listing to close." },
              { name: "Lower Vacancy Costs", desc: "Predictive analytics and proactive outreach reduce the days a unit sits empty." },
              { name: "Higher Agent Productivity", desc: "Automation removes repetitive admin work, freeing agents to focus on relationships and closings." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Interactive 3D Floor Plans", description: "Let buyers explore layouts and dimensions without an in-person visit." },
          { title: "Tenant & Owner Portals", description: "Self-service portals for rent payments, maintenance requests, and document access." },
          { title: "Automated Rent & Lease Management", description: "Recurring billing, lease renewals, and late-fee handling without manual tracking." },
          { title: "Real-time Market Analytics", description: "Pricing and demand dashboards pulled directly from live listing and transaction data." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take a real estate platform from concept to a live, data-connected product."
        modules={[
          { title: "Discovery & Data Audit", duration: "3–5 Days", topics: ["Stakeholder workshops", "Data source audit", "MLS/feed mapping", "Success metrics"] },
          { title: "UX & Platform Architecture", duration: "1 Week", topics: ["Wireframes", "Data architecture", "Integration planning", "Compliance review"] },
          { title: "Core Platform Build", duration: "2–4 Weeks", topics: ["Listing engine", "CRM integration", "Tenant/owner portals", "Payment workflows"] },
          { title: "3D & Immersive Layer", duration: "1–2 Weeks", topics: ["Virtual tour pipeline", "Floor plan rendering", "Mobile optimization"] },
          { title: "Analytics & AI Layer", duration: "1 Week", topics: ["Valuation models", "Vacancy prediction", "Lead scoring"] },
          { title: "Launch & Iteration", duration: "Ongoing", topics: ["Phased rollout", "Agent onboarding", "Usage monitoring", "Continuous improvement"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of real estate products we build across management, sales, and brokerage."
        projects={[
          { title: "Property Management Suite", description: "A unified platform for owners and tenants covering rent collection, maintenance, and lease renewals.", skills: ["Payments", "Workflows", "Portals"] },
          { title: "Virtual Home-buying Experience", description: "A 3D tour and interactive floor plan platform that lets remote buyers shortlist properties confidently.", skills: ["3D/AR", "Web", "Analytics"] },
          { title: "Agent CRM & Lead Engine", description: "A lead scoring and nurture system that keeps agents focused on the buyers most likely to close.", skills: ["CRM", "AI/ML", "Automation"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our real estate platforms drive."
        caseStudies={[
          {
            segment: "Property Management",
            title: "Cutting vacancy time for a multi-unit property portfolio",
            challenge: "A property management firm managing thousands of units across multiple cities had no unified view of vacancies, leading to units sitting empty for weeks longer than necessary.",
            solution: "We built a unified property data platform with predictive vacancy analytics and automated listing syndication across channels.",
            metric: "-35%",
            metricLabel: "Reduction in average vacancy duration",
          },
          {
            segment: "Residential Brokerage",
            title: "Increasing remote buyer conversions for a brokerage network",
            challenge: "A brokerage network found that out-of-town buyers rarely converted past the inquiry stage without an in-person visit.",
            solution: "We launched an immersive 3D virtual tour platform integrated with their CRM to track and follow up on remote buyer engagement.",
            metric: "+47%",
            metricLabel: "Increase in remote-buyer conversion rate",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Real Estate"
            features={[
              { name: "Real Estate Domain Depth", desc: "We understand MLS data, fair housing rules, and the operational realities of property management, not just generic CRUD apps." },
              { name: "Immersive Experience Expertise", desc: "3D tours and interactive floor plans are a core specialty, not an afterthought integration." },
              { name: "Built to Integrate, Not Replace", desc: "We connect to your existing MLS feeds and CRMs rather than forcing a costly rip-and-replace." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={realEstateFaqs}
      />

      <DetailCTA
        heading="Ready to modernize your real estate platform?"
        description="Let's talk about your portfolio, your buyers, and how we can help you close deals faster."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
