"use client";

import {
  FolderSearch, Users2, Cloud, Sparkles,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  FileCheck, Bell, Workflow,
  Scale, UserCog, Activity,
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

export default function AIPoweredSmartDMSContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="AI Powered Smart DMS"
        subtitle="Intelligent document management."
        description="Never lose a file again. Our Smart DMS uses optical character recognition (OCR) and natural language processing to categorize, tag, and search your entire company archives."
        icon={FolderSearch}
        image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["OCR Powered", "Semantic Search", "Auto-Tagging", "Enterprise Ready"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Every document, actually findable"
        paragraphs={[
          "AI Powered Smart DMS turns years of scattered PDFs, scans, and folders into a single searchable archive — no more digging through nested drives to find a contract someone filed under the wrong name.",
          "It's built for operations and records teams at organizations with large historical document volumes, who need OCR, semantic search, and automated retention without hiring a dedicated records management team.",
        ]}
        stats={[
          { label: "Built For", value: "Operations & Records Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Document Management & Search", icon: FolderSearch },
          { label: "Deployment", value: "Cloud or On-Premise", icon: Cloud },
          { label: "Category", value: "AI Document Management", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built to make an existing archive usable, not just store new files."
        items={[
          { title: "Optical Character Recognition", description: "Scanned documents become fully searchable text automatically, no manual data entry required." },
          { title: "Semantic Search", description: "Search by concept and meaning, not just exact file names or keywords, so nothing gets lost in folders." },
          { title: "Auto-Tagging & Categorization", description: "Documents are classified and tagged automatically as they're uploaded, keeping archives organized without manual filing." },
          { title: "Retention Policy Automation", description: "Set automatic retention and deletion rules per document type, reducing compliance risk." },
          { title: "Version Control", description: "Track every document revision with full history, so teams always know which version is current." },
          { title: "Granular Access Permissions", description: "Control who can view, edit, or share each document or folder, protecting sensitive records." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Document Repository", description: "Centralized, searchable storage for every file across the organization." },
          { title: "OCR & Indexing Engine", description: "Converts scanned and image-based documents into searchable, structured text." },
          { title: "Search & Discovery", description: "Semantic and keyword search across the entire archive." },
          { title: "Retention & Compliance", description: "Automated retention schedules and audit-ready compliance logs." },
          { title: "Access Control", description: "Role- and folder-based permissions for viewing and editing documents." },
          { title: "Reporting", description: "Usage, storage, and compliance reporting across the document library." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a team goes from a messy archive to a fully searchable one."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create workspace", "Invite team members"] },
          { title: "Setup", duration: "Step 2", topics: ["Connect existing storage", "Bulk-import documents"] },
          { title: "Configure", duration: "Step 3", topics: ["Set retention policies", "Define access permissions"] },
          { title: "Use Features", duration: "Step 4", topics: ["Upload & auto-tag documents", "Search across the archive"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Review storage & compliance reports"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track retention schedule compliance", "Monitor access activity"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add departments", "Expand storage capacity"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "React", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "React Native", category: "Mobile", icon: Smartphone },
          { name: "Elasticsearch", category: "Database", icon: Database },
          { name: "OCR & NLP Models", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS S3", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "Encryption at Rest", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "OCR", description: "Extract accurate text from scans, photos, and PDFs automatically, even from imperfect source documents." },
          { title: "Intelligent Search", description: "Semantic search understands intent, surfacing relevant documents even without an exact keyword match." },
          { title: "Automation", description: "Auto-tagging and retention rules apply themselves the moment a document is uploaded." },
          { title: "RAG Integration", description: "Ask natural-language questions and get answers grounded directly in your document archive." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect Smart DMS to the storage and workflow tools you already use."
        items={[
          { name: "Google Drive", category: "Cloud Storage Sync", icon: Cloud },
          { name: "Microsoft SharePoint", category: "Document Sync", icon: Database },
          { name: "DocuSign", category: "E-signature", icon: FileCheck },
          { name: "Slack", category: "Search Notifications", icon: Bell },
          { name: "Zapier", category: "Workflow Automation", icon: Workflow },
          { name: "REST APIs", category: "Custom Integration", icon: Server },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Faster Document Retrieval", desc: "Employees find what they need in seconds instead of digging through nested folders." },
              { name: "Lower Compliance Risk", desc: "Automated retention and audit trails keep records defensible without manual tracking." },
              { name: "Reduced Storage Costs", desc: "Automatic archiving and deletion rules keep storage lean and organized." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using Smart DMS"
        columns={2}
        items={[
          { title: "Finance", description: "Manage regulatory records with defensible retention and audit trails.", href: "/industries/finance" },
          { title: "Real Estate", description: "Organize lease agreements, inspections, and property records centrally.", href: "/industries/real-estate" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the Smart DMS workspace."
        images={[
          { src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop", caption: "Document Repository" },
          { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop", caption: "OCR Scanning View" },
          { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", caption: "Search & Discovery" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Insurance Operations",
            title: "Eliminating a five-day document retrieval backlog for an insurance operations team",
            challenge: "A mid-sized insurer's claims team spent days locating scanned policy documents buried across shared drives and physical archives.",
            solution: "We deployed Smart DMS with OCR ingestion and semantic search across their entire historical archive, making every document instantly searchable.",
            metric: "-90%",
            metricLabel: "Document retrieval time",
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Can it process documents we've already scanned?", answer: "Yes, bulk import and OCR processing works on existing scanned archives, not just new uploads." },
          { question: "How accurate is the OCR on older or low-quality scans?", answer: "Accuracy is generally high even on imperfect scans, though very poor quality originals may need manual review — we'll assess a sample during onboarding." },
          { question: "Can we set different retention rules per document type?", answer: "Yes, retention and deletion policies are configurable per document category or folder." },
          { question: "Is Smart DMS compliant with data privacy regulations?", answer: "Yes, it supports encryption, access controls, and audit logging designed to support common compliance requirements." },
          { question: "Can we deploy this on-premise instead of the cloud?", answer: "Yes, both cloud and on-premise deployment options are available depending on your data residency needs." },
        ]}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "Legal Tech", description: "Pair document intelligence with legal practice management.", href: "/products/legal-tech", icon: Scale },
          { title: "AI HR Assistant", description: "Apply the same document intelligence to HR and compliance records.", href: "/products/ai-hr-assistant", icon: UserCog },
          { title: "DataPulse AI", description: "Turn document metadata into business intelligence dashboards.", href: "/products/datapulse-ai", icon: Activity },
        ]}
      />

      <DetailCTA
        heading="Ready to make your archive searchable?"
        description="See how Smart DMS can turn years of scattered documents into an instantly searchable archive."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
