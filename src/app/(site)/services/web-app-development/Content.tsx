"use client";

import {
  Globe, Clock, Users, Layers, Headphones,
  Code2, Server, Database, Workflow, Cloud, Zap, Palette, GitBranch,
  Smartphone, Cpu, Bot,
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
import { webAppDevelopmentFaqs } from "./faqs";

export default function WebAppDevelopmentContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="services"
        categoryLabel="services"
        title="Web App Development"
        subtitle="Scalable platforms for the modern web."
        description="We engineer lightning-fast, highly secure web applications using React, Next.js, and modern cloud architectures that provide seamless experiences across all devices."
        icon={Globe}
        image="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Web software built to handle real traffic, not just a demo"
        paragraphs={[
          "A web app that works in a demo and a web app that holds up under real user traffic, real data volume, and real edge cases are two very different things. We build for the second one, from the first line of code.",
          "Whether it's a customer-facing SaaS product, an internal operations tool, or a full e-commerce platform, we architect for the load, security, and SEO requirements your business will actually face, not just the ones visible on day one.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "4–8 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "Full-stack + DevOps", icon: Layers },
          { label: "Support", value: "SLA-backed Maintenance", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="The problems that show up once a web app leaves the prototype stage."
        items={[
          { title: "Slow Page Loads Costing Conversions", description: "Every extra second of load time measurably increases bounce rate and cart abandonment." },
          { title: "Scaling Past the MVP", description: "Architecture that worked for the first 1,000 users often breaks down at 100,000." },
          { title: "SEO That Doesn't Work with JS Frameworks", description: "Client-rendered apps frequently get under-indexed by search engines without the right rendering strategy." },
          { title: "Accumulating Technical Debt", description: "Fast early development often leaves a codebase that's expensive and risky to extend." },
          { title: "Fragmented Data Across Systems", description: "Apps that need to talk to CRMs, payment processors, and internal tools often end up with brittle, one-off integrations." },
          { title: "Security Gaps Under Deadline Pressure", description: "Shipping fast without a security review leaves common vulnerabilities in auth and APIs unaddressed." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we turn those problems into architectural decisions from day one."
        items={[
          { title: "Architecture Before Code", description: "We map data flow, scaling points, and integration needs before writing the first feature." },
          { title: "Server-rendered Where It Matters", description: "SSR/SSG for public, SEO-critical pages; client-rendered where interactivity matters more than indexing." },
          { title: "API-first Design", description: "We build a clean API layer first so web, mobile, and future integrations all consume the same contract." },
          { title: "Continuous Performance Budgets", description: "Page-weight and load-time budgets enforced in CI, not discovered after launch." },
          { title: "Security Reviewed at Each Milestone", description: "Auth, input validation, and dependency scanning built into delivery, not a final audit." },
          { title: "Documented, Testable Codebases", description: "Code that the next engineer, yours or ours, can pick up without a lengthy handoff." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        items={[
          { title: "Responsive, Accessible UI", description: "Interfaces that work well on any device and meet WCAG accessibility guidelines." },
          { title: "Real-time Data Sync", description: "Live updates via WebSockets or polling where your product genuinely needs them." },
          { title: "Role-based Access Control", description: "Granular permissions for multi-user, multi-team products." },
          { title: "Admin & Analytics Dashboards", description: "Internal tooling that gives your team visibility without extra engineering requests." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Custom SaaS Platforms", description: "Multi-tenant products built to onboard and scale across customer accounts." },
          { title: "E-commerce Storefronts", description: "Catalog, cart, checkout, and payments built for conversion and reliability." },
          { title: "Internal Tools & Portals", description: "Purpose-built dashboards and workflow tools for your own team." },
          { title: "API & Backend Development", description: "Standalone APIs and services that power your web, mobile, and partner integrations." },
          { title: "Legacy Application Modernization", description: "Incremental migration of aging codebases to modern, maintainable stacks." },
          { title: "Progressive Web Apps", description: "Installable, offline-capable web experiences that blur the line with native apps." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "PostgreSQL / MongoDB", category: "Database", icon: Database },
          { name: "GraphQL / REST", category: "APIs", icon: Workflow },
          { name: "AWS / Vercel", category: "Cloud & Hosting", icon: Cloud },
          { name: "Redis", category: "Caching", icon: Zap },
          { name: "Tailwind CSS", category: "Styling", icon: Palette },
          { name: "GitHub Actions", category: "CI/CD", icon: GitBranch },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we take a web application from architecture to a supported, production system."
        modules={[
          { title: "Discovery & Architecture", duration: "3–5 Days", topics: ["Requirements workshops", "System architecture", "Data modeling", "Tech stack decisions"] },
          { title: "UI/UX Design", duration: "1 Week", topics: ["Wireframes", "Design system", "Prototype review", "Accessibility pass"] },
          { title: "Core Development", duration: "2–4 Weeks", topics: ["Frontend build", "API development", "Database implementation", "Third-party integrations"] },
          { title: "Testing & QA", duration: "3–5 Days", topics: ["Unit & integration tests", "Cross-browser testing", "Performance testing", "Security review"] },
          { title: "Deployment", duration: "2–3 Days", topics: ["CI/CD setup", "Staging validation", "Production rollout", "Monitoring setup"] },
          { title: "Post-launch Support", duration: "Ongoing", topics: ["Bug fixes", "Performance monitoring", "Feature iteration", "SLA-backed maintenance"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A typical layered architecture for the web applications we build."
        layers={[
          { name: "Presentation Layer", description: "Server-rendered React components for fast, SEO-friendly pages with client-side interactivity where needed.", tech: "Next.js / React", icon: Code2 },
          { name: "Application & API Layer", description: "A clean, versioned API layer that mediates all business logic between the frontend and your data.", tech: "Node.js / GraphQL", icon: Server },
          { name: "Data Layer", description: "Relational or document storage chosen based on your data shape, with caching for hot paths.", tech: "PostgreSQL / Redis", icon: Database },
          { name: "Infrastructure Layer", description: "Auto-scaling cloud infrastructure with CI/CD pipelines and monitoring built in from day one.", tech: "AWS / Vercel", icon: Cloud },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation capabilities"
        description="Where AI adds real leverage to a modern web application."
        items={[
          { title: "AI-assisted Search & Recommendations", description: "Semantic search and personalized content recommendations powered by embeddings." },
          { title: "Automated QA & Regression Testing", description: "AI-assisted test generation that catches regressions before they reach production." },
          { title: "Smart Form & Data Validation", description: "Intelligent input validation that reduces bad data and support tickets." },
          { title: "In-app AI Assistants", description: "Embedded chat-based help that answers user questions using your own product documentation." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of web applications we build across SaaS, commerce, and internal tooling."
        projects={[
          { title: "Multi-tenant SaaS Dashboard", description: "A B2B analytics platform serving thousands of customer accounts with isolated data and usage-based billing.", skills: ["Next.js", "Multi-tenancy", "Billing"] },
          { title: "High-traffic E-commerce Platform", description: "A storefront rebuilt to handle a 3x traffic spike during seasonal sales without downtime.", skills: ["Performance", "Payments", "Caching"] },
          { title: "Internal Operations Portal", description: "A unified dashboard replacing five spreadsheets and two legacy tools for a logistics team.", skills: ["APIs", "RBAC", "Reporting"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Faster Page Loads, Higher Conversions", desc: "Performance-first architecture directly improves signup and checkout completion rates." },
              { name: "Lower Long-term Maintenance Cost", desc: "Clean architecture and documentation reduce the cost of every future feature." },
              { name: "Confident Scaling", desc: "Infrastructure that grows with usage instead of requiring a rebuild at your next growth milestone." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Senior Engineers, Not Just Junior Hours", desc: "Your project is led by engineers who've shipped production systems at scale, not learning on your budget." },
              { name: "Transparent, Milestone-based Delivery", desc: "You see working software at every milestone, not just a final reveal." },
              { name: "We Stick Around Post-launch", desc: "SLA-backed support means we're still accountable after go-live, not gone the day after." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Dedicated Team", desc: "A committed team working exclusively on your product — best for ongoing, evolving platforms." },
              { name: "Fixed Scope Project", desc: "A defined scope, timeline, and price — best for well-specified projects with clear requirements." },
              { name: "Staff Augmentation", desc: "Embed our engineers directly into your existing team — best for filling specific skill or capacity gaps." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by project scope, so you can plan around a realistic launch date."
        bands={[
          { scope: "MVP / Proof of Concept", duration: "3–4 Weeks", fill: 35, description: "A focused build validating your core value proposition with real users." },
          { scope: "Full Product Launch", duration: "6–10 Weeks", fill: 70, description: "A production-ready platform with the complete feature set, integrations, and QA." },
          { scope: "Enterprise-scale Platform", duration: "10+ Weeks", fill: 100, description: "Multi-team, multi-phase delivery for platforms with complex compliance or scale needs." },
        ]}
      />

      <FAQAccordion
        faqs={webAppDevelopmentFaqs}
      />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Mobile App Development", description: "Extend your web product to native iOS and Android experiences.", href: "/services/mobile-app-development", icon: Smartphone },
          { title: "AI/ML Solutions", description: "Add recommendation engines, search, and predictive features to your platform.", href: "/services/ai-ml-solutions", icon: Cpu },
          { title: "AI Agent", description: "Give your web app a 24/7 support or automation assistant.", href: "/services/ai-agent", icon: Bot },
        ]}
      />

      <DetailCTA
        heading="Ready to build a web app that scales?"
        description="Let's talk about your product, your users, and how we can help you ship something built to last."
        ctaLabel="Get a Quote"
      />
    </div>
  );
}
