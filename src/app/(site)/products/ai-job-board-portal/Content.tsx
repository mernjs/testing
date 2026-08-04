"use client";

import {
  Briefcase, Users2, Cloud, Sparkles,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  CreditCard, FileText, Bell,
  Bot, HardHat, TrendingUp,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import TechStackGrid from "@/components/sections/TechStackGrid";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import ProductGallery from "@/components/sections/ProductGallery";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { aiJobBoardPortalFaqs } from "./faqs";

export default function AIJobBoardPortalContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="AI Job Board Portal"
        subtitle="A full-featured job portal with hiring built in."
        description="A full-featured job portal with an integrated applicant tracking system, subscription-based employer plans, and OpenAI integrations for job matching and candidate screening."
        icon={Briefcase}
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["Integrated ATS", "Job Board", "Subscriptions", "OpenAI Powered"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Job listings and applicant tracking, in one place"
        paragraphs={[
          "AI Job Board Portal gives employers and recruiters a place to post roles, track applicants through an integrated ATS, and let AI assist with matching and initial screening, instead of stitching together a job board and a separate hiring tool.",
          "It's built for recruiters and employers who need a single platform to publish listings, manage candidate pipelines, and run paid employer plans, while giving job seekers a straightforward way to search and apply.",
        ]}
        stats={[
          { label: "Built For", value: "Recruiters, Employers & Job Seekers", icon: Users2 },
          { label: "Primary Use Case", value: "Job Listings & Applicant Tracking", icon: Briefcase },
          { label: "Deployment", value: "Cloud, Subscription-Based SaaS", icon: Cloud },
          { label: "Category", value: "AI-Assisted Job Board Platform", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built to cover the full loop from job posting to hire, not just the listing."
        items={[
          { title: "Integrated ATS", description: "Track every applicant through your hiring pipeline without leaving the job board platform." },
          { title: "AI Job Matching", description: "OpenAI-powered matching surfaces the most relevant candidates for a role, and the most relevant roles for a seeker." },
          { title: "Employer Subscription Plans", description: "Self-service subscription tiers control listing volume, visibility, and ATS access." },
          { title: "Resume Parsing", description: "Candidate resumes are parsed automatically into structured, searchable profiles." },
          { title: "Job Search & Alerts", description: "Job seekers can search listings and get notified when a new match appears." },
          { title: "Candidate Application Tracking", description: "Employers see every applicant's status and history in one pipeline view." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Job Listings", description: "Employer-facing tools for posting, editing, and publishing job listings." },
          { title: "Applicant Tracking System", description: "Pipeline management for every candidate applying to a listing." },
          { title: "AI Matching Engine", description: "OpenAI-powered matching between candidates and open roles." },
          { title: "Resume Intelligence", description: "Automated parsing and structuring of uploaded resumes." },
          { title: "Subscription & Billing", description: "Employer plan management, upgrades, and payment handling." },
          { title: "Search & Alerts", description: "Job seeker search, saved searches, and match notifications." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How an employer goes from posting a role to reviewing qualified applicants."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create an employer account", "Choose a subscription plan"] },
          { title: "Setup", duration: "Step 2", topics: ["Post your first job listing", "Configure ATS pipeline stages"] },
          { title: "Configure", duration: "Step 3", topics: ["Set AI matching criteria", "Invite hiring team members"] },
          { title: "Use Features", duration: "Step 4", topics: ["Review AI-matched candidates", "Move applicants through the pipeline"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Review applicant funnel metrics"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track listing performance", "Monitor time-to-fill by role"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Post additional listings", "Expand to new hiring teams"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "React", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "React Native", category: "Mobile", icon: Smartphone },
          { name: "MongoDB", category: "Database", icon: Database },
          { name: "OpenAI", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "OAuth2 & RBAC", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "AI Job Matching", description: "OpenAI-powered matching ranks candidates against role requirements automatically." },
          { title: "Resume Parsing", description: "Uploaded resumes are converted into structured, searchable candidate data." },
          { title: "Automation", description: "Application status updates and notifications trigger automatically as candidates move stages." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect AI Job Board Portal to the tools employers already use to hire."
        items={[
          { name: "Stripe", category: "Subscription Billing", icon: CreditCard },
          { name: "OpenAI", category: "LLM Provider", icon: Sparkles },
          { name: "Job Syndication Feeds", category: "Listing Distribution", icon: FileText },
          { name: "Email Notifications", category: "Candidate & Employer Alerts", icon: Bell },
          { name: "REST APIs", category: "Custom Integration", icon: Server },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Faster Time-to-Fill", desc: "AI matching surfaces relevant candidates immediately instead of waiting for applications to trickle in." },
              { name: "One Platform, Not Two", desc: "Posting and applicant tracking live together, cutting the overhead of a separate ATS." },
              { name: "Predictable Recruiting Costs", desc: "Subscription plans give employers predictable, self-service control over hiring spend." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using the AI Job Board Portal"
        columns={2}
        items={[
          { title: "Education", description: "Support campus and faculty recruiting with a dedicated hiring pipeline.", href: "/industries/education" },
          { title: "Finance", description: "Manage high-volume professional hiring with structured applicant tracking.", href: "/industries/finance" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the AI Job Board Portal."
        images={[
          { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", caption: "Applicant Pipeline" },
          { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", caption: "AI Matching View" },
          { src: "https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=800&auto=format&fit=crop", caption: "Employer Dashboard" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Recruiting Agency",
            title: "Consolidating job posting and applicant tracking for a growing recruiting agency",
            challenge: "A recruiting agency was posting jobs on one platform and tracking applicants in a separate spreadsheet-based process, causing candidates to fall through the cracks between systems.",
            solution: "We migrated the agency onto the AI Job Board Portal, combining listings, AI-assisted matching, and applicant tracking into a single pipeline.",
            metric: "-39%",
            metricLabel: "Time-to-fill per role",
          },
        ]}
      />

      <FAQAccordion
        faqs={aiJobBoardPortalFaqs}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "AI Voice Assistant", description: "Add a conversational voice layer to candidate screening calls.", href: "/products/ai-voice-assistant", icon: Bot },
          { title: "AI Construction Platform", description: "Hire and onboard teams directly into your active project workspaces.", href: "/products/ai-construction-platform", icon: HardHat },
          { title: "Predictive Analytics Engine", description: "Forecast hiring and labor demand alongside your job pipeline.", href: "/products/predictive-analytics-engine", icon: TrendingUp },
        ]}
      />

      <DetailCTA
        heading="Ready to hire from one platform instead of three?"
        description="See how the AI Job Board Portal can bring listings and applicant tracking together."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
