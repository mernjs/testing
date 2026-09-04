"use client";

import {
  FileSearch, Clock, Users, Layers, Headphones,
  Braces, Bot, Database, Gauge, Lock,
  Workflow, TrendingUp, Plug, ScanLine, CheckCircle, FileText,
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
import { documentFaqs } from "./faqs";

export default function DocumentIntelligenceContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="ai-automations"
        categoryLabel="AI & Automations"
        title="Document Intelligence"
        subtitle="Automate document reading and extraction."
        description="Feed invoices, contracts, forms, and reports into structured pipelines that extract, validate, and route data automatically — eliminating manual data entry at its root."
        icon={FileSearch}
        image="https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Documents shouldn't require humans to read them"
        paragraphs={[
          "Across finance, legal, procurement, and operations, a huge proportion of business data arrives locked inside unstructured documents — PDFs, scanned forms, email attachments, and digital contracts. Getting that data into your systems currently requires someone to read, interpret, and re-key it. That's slow, error-prone, and an extraordinary waste of skilled time.",
          "We build Intelligent Document Processing (IDP) pipelines that read documents the way a trained analyst would — identifying fields across variable layouts, understanding context, validating against business rules, and routing structured data directly into your downstream systems. Whether the input is a structured PDF invoice or a handwritten form scan, the output is clean, validated, usable data.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "4–8 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Fixed Scope or Dedicated Team", icon: Users },
          { label: "Team Composition", value: "AI + OCR + Integration Engineers", icon: Layers },
          { label: "Post-Launch", value: "Accuracy Monitoring & Model Updates", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="The document processing problems that drive businesses to IDP."
        items={[
          { title: "Manual Data Entry from Documents at Scale", description: "Teams spend hours keying data from invoices, forms, and reports that arrive in high volumes every day." },
          { title: "Inconsistent Document Formats", description: "The same type of document — like a supplier invoice — arrives in dozens of layouts, defeating template-based extraction." },
          { title: "High Error Rates in Manual Processing", description: "Human transcription introduces errors that propagate downstream — into payments, compliance records, and analytics." },
          { title: "Slow Document-Dependent Processes", description: "Processes gated on document review — contract approval, claims processing, loan origination — move at the speed of human reading." },
          { title: "Poor Compliance & Audit Trails for Documents", description: "Manual handling makes it difficult to track which documents were processed, by whom, and what data was extracted." },
          { title: "Documents Trapped in Email or Shared Drives", description: "Valuable business data sits in attachments and folder hierarchies instead of flowing into systems where it can be used." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we build document processing pipelines that work at production volumes."
        items={[
          { title: "Document Type & Field Analysis", description: "We analyse your document corpus to identify all layouts, field types, and extraction rules before building the pipeline." },
          { title: "Layered OCR + NLP Architecture", description: "We combine high-accuracy OCR for text extraction with NLP for field identification and contextual understanding." },
          { title: "Validation Rules Against Business Logic", description: "Extracted data is validated against your business rules — PO matching, currency checks, required field presence — before routing." },
          { title: "Confidence-Scored Outputs", description: "Every extraction carries a confidence score. Low-confidence fields are flagged for human review rather than silently passed through." },
          { title: "Human Review Queue for Edge Cases", description: "A lightweight review interface lets operators correct uncertain extractions — which feeds back into model improvement." },
          { title: "Direct Integration Into Downstream Systems", description: "Validated data routes directly into your ERP, document management system, or custom database — no manual re-keying required." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key capabilities"
        items={[
          { title: "Multi-Format Document Ingestion", description: "Processes PDFs, scanned images, Word documents, Excel files, and email attachments from any intake channel." },
          { title: "Layout-Agnostic Field Extraction", description: "Identifies fields across variable document layouts without requiring a fixed template per vendor or document type." },
          { title: "Multi-Language Document Support", description: "Handles documents in multiple languages — critical for global procurement and multi-region operations." },
          { title: "Business Rule Validation", description: "Validates extracted data against configurable business rules before routing to downstream systems." },
          { title: "Confidence Scoring & Exception Routing", description: "Low-confidence extractions are queued for human review with the original document and extracted values side by side." },
          { title: "Full Audit Trail", description: "Every document processed, every field extracted, and every human correction is logged with timestamps." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Invoice & Purchase Order Processing", description: "Automated extraction from supplier invoices and POs, with three-way matching validation and ERP integration." },
          { title: "Contract Data Extraction", description: "Extract key dates, parties, clauses, and obligations from legal contracts at scale — feeding contract management systems." },
          { title: "KYC & Onboarding Document Processing", description: "Automated extraction and validation from identity documents, application forms, and compliance documentation." },
          { title: "Claims & Application Form Processing", description: "High-volume form processing for insurance claims, loan applications, and government submissions." },
          { title: "Medical Records & Clinical Document Processing", description: "Structured extraction from clinical notes, lab reports, and medical forms — with HIPAA-aligned data handling." },
          { title: "Custom Document Type Pipeline", description: "Full design and build of an IDP pipeline for any proprietary document type specific to your industry or operation." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "OCR Engines", category: "Text Extraction", icon: ScanLine },
          { name: "NLP / NER Models", category: "Field Identification", icon: Bot },
          { name: "Document AI APIs", category: "Cloud Intelligence", icon: FileText },
          { name: "Python", category: "Pipeline Logic", icon: Braces },
          { name: "Validation Engines", category: "Business Rules", icon: CheckCircle },
          { name: "Document Storage", category: "Archive Layer", icon: Database },
          { name: "Accuracy Monitoring", category: "Model Ops", icon: Gauge },
          { name: "Data Encryption", category: "Security", icon: Lock },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="From document corpus analysis to a monitored production IDP pipeline."
        modules={[
          { title: "Document Corpus Analysis", duration: "3–5 Days", topics: ["Document type inventory", "Layout variation mapping", "Field extraction specification", "Volume & intake analysis"] },
          { title: "Pipeline Architecture Design", duration: "1 Week", topics: ["OCR + NLP stack selection", "Validation rule design", "Exception queue design", "Integration mapping"] },
          { title: "Extraction Model Build & Training", duration: "2–3 Weeks", topics: ["Model training on document sample", "Field extraction tuning", "Confidence threshold calibration", "Multi-layout testing"] },
          { title: "Validation & Integration Build", duration: "1–2 Weeks", topics: ["Business rule implementation", "ERP / downstream connectors", "Exception queue UI", "End-to-end pipeline testing"] },
          { title: "UAT & Accuracy Benchmark", duration: "1 Week", topics: ["Accuracy rate validation", "Edge case testing", "Stakeholder sign-off", "SLA benchmark"] },
          { title: "Production & Continuous Improvement", duration: "Ongoing", topics: ["Volume monitoring", "Accuracy tracking", "Human correction feedback loop", "Model updates"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="The layered architecture of our Intelligent Document Processing pipelines."
        layers={[
          { name: "Ingestion Layer", description: "Document receipt from email, upload portals, shared drives, or API — normalised into a consistent processing queue.", tech: "Email Parser / File Watcher / API", icon: FileSearch },
          { name: "Extraction Layer", description: "OCR for text, NLP/NER for field identification, and layout analysis — working together to extract structured data from any document format.", tech: "OCR + NLP / Document AI APIs", icon: ScanLine },
          { name: "Validation Layer", description: "Business rule checks applied to extracted data — PO matching, required field validation, format verification — before any data moves downstream.", tech: "Validation Engine", icon: CheckCircle },
          { name: "Exception Layer", description: "Low-confidence extractions and validation failures queued for human review — with original document and extracted values presented side by side.", tech: "Review Queue Interface", icon: FileText },
          { name: "Integration Layer", description: "Validated, structured data routed directly into ERP, CMS, database, or downstream workflow systems.", tech: "API / Database Connectors", icon: Plug },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The document intelligence pipelines we've built across finance, legal, and operations."
        projects={[
          { title: "Accounts Payable Invoice Automation", description: "An IDP pipeline processing 3,000+ supplier invoices per month for a manufacturing company — reducing AP processing time from 7 days to same-day.", skills: ["OCR + NER", "ERP Integration", "3-Way Matching"] },
          { title: "Insurance Claims Form Processing", description: "Automated extraction from handwritten and digital claim forms for an insurance provider — improving processing throughput 4x.", skills: ["Form OCR", "Data Validation", "Claims System API"] },
          { title: "Contract Obligation Extraction", description: "NLP pipeline extracting key dates, renewal terms, and payment obligations from 8,000+ legacy contracts for a legal team's contract management migration.", skills: ["Contract NLP", "Clause Extraction", "CMS Integration"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Elimination of Manual Data Entry Cost", desc: "High-volume document processing runs without human involvement for the vast majority of documents." },
              { name: "Near-Zero Transcription Errors", desc: "Automated extraction with validation eliminates the transcription errors that propagate through downstream systems." },
              { name: "Dramatically Faster Document-Gated Processes", desc: "Processes waiting on document review — AP, claims, onboarding — run at machine speed rather than human reading speed." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Layout-Agnostic Extraction", desc: "We don't build fragile template-matching systems — our models identify fields across variable layouts without per-supplier configuration." },
              { name: "Production Accuracy Standards", desc: "We validate against a defined accuracy benchmark before launch, and include ongoing monitoring against that target." },
              { name: "Compliance-Aware Data Handling", desc: "We build with data residency, encryption, and access controls that meet financial and healthcare compliance requirements." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Fixed-Scope IDP Pipeline", desc: "A complete document processing pipeline for a defined document type, delivered at a clear price and timeline." },
              { name: "Multi-Document Type Platform", desc: "An IDP platform handling multiple document categories with shared infrastructure and monitoring." },
              { name: "IDP Audit & Improvement", desc: "Assessment and optimisation of an existing extraction solution that isn't meeting accuracy requirements." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by IDP scope."
        bands={[
          { scope: "Single Document Type Pipeline", duration: "4–6 Weeks", fill: 30, description: "One document type — invoices, forms, or contracts — fully extracted and integrated." },
          { scope: "Multi-Type IDP Platform", duration: "7–12 Weeks", fill: 65, description: "Three to five document types on shared infrastructure with unified review queue." },
          { scope: "Enterprise Document Intelligence Platform", duration: "12+ Weeks", fill: 100, description: "Organisation-wide IDP handling all incoming document types with full integration into business systems." },
        ]}
      />

      <FAQAccordion faqs={documentFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Intelligent Process Automation", description: "Route extracted document data into automated downstream workflows automatically.", href: "/ai-automations/intelligent-process-automation", icon: Workflow },
          { title: "Conversational AI & Chatbots", description: "Let users submit documents through a chat interface and receive extracted results conversationally.", href: "/ai-automations/conversational-ai-chatbots", icon: Bot },
          { title: "AI Integration Services", description: "Connect your IDP pipeline to any system in your existing stack.", href: "/ai-automations/ai-integration-services", icon: Plug },
        ]}
      />

      <DetailCTA
        heading="Ready to stop re-keying data from documents?"
        description="Tell us about your highest-volume document type and we'll design an extraction pipeline that processes it accurately and routes data into your systems automatically."
        ctaLabel="Start a Conversation"
        checklist={["Free document corpus assessment", "Accuracy-benchmarked delivery", "Any document type or format"]}
        category="ai-automations"
        subService="document-intelligence"
      />
    </div>
  );
}
