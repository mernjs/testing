"use client";

import {
  Scale, Users2, Workflow, Cloud,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  FileCheck, Mail, CreditCard, Phone,
  FolderSearch, UserCog, MessageSquare,
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

export default function LegalTechContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="Legal Tech"
        subtitle="Streamlining modern legal workflows."
        description="A comprehensive suite of tools designed specifically for law firms. Automate document generation, track case progress, and ensure absolute compliance."
        icon={Scale}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["Document Automation", "Case Management", "Compliance Tracking", "Client Portal"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Less time on paperwork, more time on casework"
        paragraphs={[
          "Legal Tech is a practice management suite built for law firms tired of tracking matters across spreadsheets, email, and a document folder that only one paralegal understands.",
          "It's built for small-to-mid-sized firms that need document automation, deadline tracking, and compliance checklists in one place, without the overhead of an enterprise legal suite designed for firms ten times their size.",
        ]}
        stats={[
          { label: "Built For", value: "Law Firms & Legal Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Legal Workflow Automation", icon: Workflow },
          { label: "Deployment", value: "Cloud, Secure Hosting", icon: Cloud },
          { label: "Category", value: "Legal Practice Management", icon: Scale },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built around the day-to-day realities of running a legal practice."
        items={[
          { title: "Automated Document Generation", description: "Generate contracts, briefs, and filings from templates in minutes, cutting drafting time for routine documents." },
          { title: "Case & Matter Tracking", description: "Track deadlines, court dates, and case status in one place, reducing missed filings." },
          { title: "Client Portal", description: "Give clients secure, self-service access to case updates and documents, cutting down status-check calls." },
          { title: "Time & Billing Tracking", description: "Log billable hours against matters automatically, improving billing accuracy." },
          { title: "Compliance Checklists", description: "Built-in checklists for jurisdiction-specific requirements, reducing compliance risk." },
          { title: "E-signature Integration", description: "Send and track documents for signature without leaving the platform." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Matter Management", description: "Central hub for case details, parties, deadlines, and documents." },
          { title: "Document Assembly", description: "Template-driven generation of contracts and filings." },
          { title: "Billing & Invoicing", description: "Time tracking, invoicing, and trust accounting support." },
          { title: "Client Portal", description: "Secure client-facing access to case status and shared documents." },
          { title: "Compliance Center", description: "Jurisdiction checklists and audit trail logging." },
          { title: "Reporting", description: "Firm-wide reporting on caseload, revenue, and deadlines." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a firm goes from onboarding to running its full caseload on Legal Tech."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create firm workspace", "Add attorneys & staff"] },
          { title: "Setup", duration: "Step 2", topics: ["Import existing matters", "Configure practice areas"] },
          { title: "Configure", duration: "Step 3", topics: ["Set up document templates", "Define compliance checklists"] },
          { title: "Use Features", duration: "Step 4", topics: ["Manage active matters", "Generate documents"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Track billable hours", "Review firm performance"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track deadlines & filings", "Monitor compliance status"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add practice areas", "Onboard new attorneys"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "React", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "React Native", category: "Mobile", icon: Smartphone },
          { name: "PostgreSQL", category: "Database", icon: Database },
          { name: "NLP Document Analysis", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "AES-256 Encryption", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        description="AI plays a supporting, automation-focused role in Legal Tech."
        items={[
          { title: "Automation", description: "Automated reminders and status updates keep matters moving without manual follow-up." },
          { title: "Intelligent Search", description: "Search across case documents by concept, not just exact keywords." },
          { title: "OCR", description: "Scanned documents are automatically converted to searchable, editable text." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect Legal Tech to the tools your firm already relies on."
        items={[
          { name: "DocuSign", category: "E-signature", icon: FileCheck },
          { name: "Google Drive", category: "Document Storage", icon: Cloud },
          { name: "Outlook", category: "Email Sync", icon: Mail },
          { name: "QuickBooks", category: "Billing Sync", icon: CreditCard },
          { name: "Zoom", category: "Client Meetings", icon: Phone },
          { name: "REST APIs", category: "Custom Integration", icon: Server },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Faster Case Turnaround", desc: "Automated document generation and tracking shortens time spent on administrative work." },
              { name: "Reduced Compliance Risk", desc: "Built-in checklists catch missing requirements before they become a problem." },
              { name: "Improved Client Trust", desc: "Transparent, self-service updates keep clients informed without extra staff time." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using Legal Tech"
        columns={2}
        items={[
          { title: "Finance", description: "Manage regulatory documentation and contract review for financial services clients.", href: "/industries/finance" },
          { title: "Real Estate", description: "Streamline lease agreements, closings, and property transaction paperwork.", href: "/industries/real-estate" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the Legal Tech workspace."
        images={[
          { src: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop", caption: "Matter Dashboard" },
          { src: "https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=800&auto=format&fit=crop", caption: "Compliance Center" },
          { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop", caption: "Client Portal" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Family Law Practice",
            title: "Cutting document turnaround for a growing family law firm",
            challenge: "A 12-attorney family law firm was losing hours each week manually drafting repetitive filings and tracking court deadlines across spreadsheets.",
            solution: "We rolled out Legal Tech's document assembly and matter tracking modules, standardizing templates and centralizing every deadline in one dashboard.",
            metric: "-65%",
            metricLabel: "Document drafting time",
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Can Legal Tech handle multiple practice areas?", answer: "Yes, templates and compliance checklists are configurable per practice area within the same firm workspace." },
          { question: "Does it integrate with our existing billing software?", answer: "Yes, Legal Tech syncs with common billing tools like QuickBooks, and also supports built-in time tracking and invoicing." },
          { question: "Is client data kept confidential?", answer: "Yes, all data is encrypted at rest and in transit, with role-based access controls and full audit logging." },
          { question: "Can clients access their case status directly?", answer: "Yes, the client portal gives clients secure, read-only access to case updates and shared documents." },
          { question: "Do you support e-signatures?", answer: "Yes, documents can be sent for e-signature and tracked to completion without leaving the platform." },
        ]}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "AI Powered Smart DMS", description: "Add OCR and semantic document search to your legal document library.", href: "/products/ai-powered-smart-dms", icon: FolderSearch },
          { title: "AI HR Assistant", description: "Automate onboarding for growing legal teams.", href: "/products/ai-hr-assistant", icon: UserCog },
          { title: "ConvoCraft", description: "Add a client-facing chatbot for common intake questions.", href: "/products/convocraft", icon: MessageSquare },
        ]}
      />

      <DetailCTA
        heading="Ready to modernize your firm's workflow?"
        description="See how Legal Tech can cut administrative time across your practice."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
