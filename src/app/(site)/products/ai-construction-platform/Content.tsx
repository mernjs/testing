"use client";

import {
  HardHat, Users2, Cloud, Sparkles,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  CreditCard, Mic, FileCheck,
  LineChart, Camera, Briefcase,
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

export default function AIConstructionPlatformContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="AI Construction Platform"
        subtitle="AI-powered construction management, from documents to daily decisions."
        description="An AI-powered construction web app featuring subscription-based access, an AI document analyzer, and a RAG-based AI chat that answers questions grounded in your own project files."
        icon={HardHat}
        image="https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["AI Document Analyzer", "RAG AI Chat", "Subscriptions", "Web App"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Every project document, one AI you can actually ask questions"
        paragraphs={[
          "The AI Construction Platform gives general contractors and project teams a single place to upload specs, contracts, and drawings, then get instant, grounded answers instead of digging through binders or shared drives during a site call.",
          "It's built for construction firms managing multiple active projects who need document review and project Q&A to keep pace with the volume of paperwork a single job generates, without adding administrative headcount.",
        ]}
        stats={[
          { label: "Built For", value: "General Contractors & Project Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Construction Document Intelligence", icon: HardHat },
          { label: "Deployment", value: "Cloud, Subscription-Based Web App", icon: Cloud },
          { label: "Category", value: "AI-Powered Construction Platform", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built around the volume of documents a live construction project actually generates."
        items={[
          { title: "AI Document Analyzer", description: "Upload contracts, specs, and drawings and get key terms, dates, and clauses extracted automatically." },
          { title: "RAG-Based AI Chat", description: "Ask questions in plain language and get answers grounded directly in your project's own documents." },
          { title: "Subscription & Billing Management", description: "Self-service plan upgrades and billing built into the platform, no manual invoicing required." },
          { title: "Project Document Library", description: "A centralized, searchable archive for every document tied to a project." },
          { title: "Team Collaboration Workspaces", description: "Give project managers, supers, and subs a shared workspace scoped to their project." },
          { title: "Role-Based Access Control", description: "Control who can view or edit sensitive contracts and financial documents." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Document Analyzer", description: "AI-driven extraction of key terms, deadlines, and obligations from uploaded documents." },
          { title: "AI Chat Assistant", description: "RAG-based conversational interface scoped to a project's document set." },
          { title: "Subscription & Billing", description: "Plan management, upgrades, and payment handling for every workspace." },
          { title: "Project Workspace", description: "Per-project hub for documents, team members, and activity." },
          { title: "Document Library", description: "Searchable storage for contracts, drawings, and specs across all projects." },
          { title: "Access Control", description: "Workspace- and project-level permissions for internal teams and subcontractors." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a construction team goes from signing up to running every project through the platform."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create a company workspace", "Choose a subscription plan"] },
          { title: "Setup", duration: "Step 2", topics: ["Create your first project", "Upload contracts & drawings"] },
          { title: "Configure", duration: "Step 3", topics: ["Invite project team & subs", "Set document access levels"] },
          { title: "Use Features", duration: "Step 4", topics: ["Run the AI document analyzer", "Ask the AI chat project questions"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Export extracted terms & deadlines"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track document activity", "Review upcoming contract deadlines"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add new projects", "Expand seats across the company"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "Next.js", category: "Frontend & Backend", icon: Code2 },
          { name: "Node.js", category: "API Layer", icon: Server },
          { name: "Progressive Web App", category: "Mobile", icon: Smartphone },
          { name: "MongoDB", category: "Database", icon: Database },
          { name: "OpenAI", category: "AI/ML", icon: BrainCircuit },
          { name: "Vercel / AWS", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "Role-Based Access Control", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "Document Intelligence", description: "The AI document analyzer extracts key terms and obligations from contracts and specs automatically." },
          { title: "RAG Integration", description: "AI chat answers are grounded directly in your uploaded project documents, not generic web knowledge." },
          { title: "Conversational AI", description: "Ask project questions in plain language instead of searching through a document library manually." },
          { title: "Voice Transcription", description: "Deepgram-powered transcription turns voice notes and call recordings into searchable project text." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect the AI Construction Platform to the tools already running a project."
        items={[
          { name: "Stripe", category: "Subscription Billing", icon: CreditCard },
          { name: "OpenAI", category: "LLM Provider", icon: Sparkles },
          { name: "Deepgram", category: "Voice Transcription", icon: Mic },
          { name: "DocuSign", category: "Contract Signing", icon: FileCheck },
          { name: "REST APIs", category: "Custom Integration", icon: Server },
          { name: "Cloud Storage", category: "Document Sync", icon: Cloud },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Faster Document Review", desc: "AI-extracted terms and deadlines mean fewer hours spent re-reading contracts and specs by hand." },
              { name: "Fewer Missed Obligations", desc: "Grounded AI chat surfaces the exact clause or deadline a project manager is looking for, instantly." },
              { name: "Centralized Project Knowledge", desc: "One searchable library replaces scattered folders, email attachments, and printed binders." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using the AI Construction Platform"
        columns={2}
        items={[
          { title: "Construction", description: "Purpose-built for general contractors managing multiple active job sites.", href: "/industries/construction" },
          { title: "Real Estate", description: "Support development and property teams managing contracts across projects.", href: "/industries/real-estate" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the AI Construction Platform workspace."
        images={[
          { src: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=800&auto=format&fit=crop", caption: "Project Document Library" },
          { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", caption: "AI Chat Assistant" },
          { src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop", caption: "Subscription & Billing" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "General Contracting",
            title: "Cutting contract review time for a multi-project general contractor",
            challenge: "A general contractor running several concurrent job sites had project managers manually re-reading lengthy contracts and specs each time a deadline or clause needed to be confirmed.",
            solution: "We rolled out the AI Construction Platform's document analyzer and RAG-based chat, letting project managers ask questions directly against their own uploaded contracts instead of searching PDFs by hand.",
            metric: "-58%",
            metricLabel: "Contract review time",
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "What file types can the AI document analyzer process?", answer: "Contracts, specs, and drawings uploaded as PDFs or scanned documents are supported, with key terms and dates extracted automatically." },
          { question: "Does the AI chat only answer from our own documents?", answer: "Yes, responses are grounded in the documents uploaded to your project workspace, reducing the risk of generic or inaccurate answers." },
          { question: "Can subcontractors get limited access to a project?", answer: "Yes, role-based access lets you scope what subs and external collaborators can view or edit within a project." },
          { question: "How does billing work across multiple projects?", answer: "Subscriptions are managed at the company level, with self-service plan upgrades as you add projects or seats." },
          { question: "Is our project data kept private between companies?", answer: "Yes, each company workspace is isolated, with encrypted storage and role-based access controls." },
        ]}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "Predictive Analytics Engine", description: "Forecast labor and material needs across active job sites.", href: "/products/predictive-analytics-engine", icon: LineChart },
          { title: "Image Recognition System", description: "Monitor job-site camera feeds alongside your project documents.", href: "/products/image-recognition-system", icon: Camera },
          { title: "AI Job Board Portal", description: "Hire and onboard construction teams for your next project.", href: "/products/ai-job-board-portal", icon: Briefcase },
        ]}
      />

      <DetailCTA
        heading="Ready to put your project documents to work?"
        description="See how the AI Construction Platform can cut document review time on your next job."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
