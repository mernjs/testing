"use client";

import {
  Workflow, Clock, Users, Layers, Headphones,
  Braces, GitBranch, Puzzle, Database, Network, Gauge, Lock,
  Bot, LineChart, Globe, TrendingUp, Zap, Shield,
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
import { ipaFaqs } from "./faqs";

export default function IntelligentProcessAutomationContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="ai-automations"
        categoryLabel="AI & Automations"
        title="Intelligent Process Automation"
        subtitle="End-to-end workflow automation."
        description="Replace manual, rule-bound processes with AI-driven workflows that adapt to context, handle exceptions, and scale across your entire operation without adding headcount."
        icon={Workflow}
        image="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Automation that actually handles the messy parts"
        paragraphs={[
          "Traditional rule-based automation breaks the moment an exception appears. Intelligent Process Automation combines AI reasoning with structured workflow orchestration — so when a document is missing a field, an approval goes to an unusual approver, or an edge case falls outside the script, the system handles it intelligently rather than failing silently.",
          "We design IPA solutions around your specific processes — mapping current steps, identifying where AI adds genuine value versus where simple rules suffice, and building an end-to-end system that runs reliably in production, with the audit trails and oversight your compliance team expects.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–10 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "AI + Workflow + Integration Engineers", icon: Layers },
          { label: "Post-Launch", value: "Monitoring & Continuous Tuning", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="What pushes a business toward intelligent process automation."
        items={[
          { title: "Workflows That Break on Exceptions", description: "Rule-based systems stall whenever a document is incomplete, an approver is unavailable, or data doesn't match the expected format." },
          { title: "High Manual Labour in Repetitive Processes", description: "Teams spend disproportionate hours on approvals, data transfers, status updates, and notifications that follow a predictable pattern." },
          { title: "Siloed Systems That Don't Communicate", description: "Data lives in ERP, CRM, and spreadsheets simultaneously — requiring manual reconciliation that introduces delays and errors." },
          { title: "Compliance Gaps from Manual Steps", description: "Every manual handoff is a potential audit risk. Without a system-of-record for process execution, proving compliance is difficult." },
          { title: "Automation That Scales Poorly", description: "Point solutions built for one process can't be extended to adjacent workflows without significant re-engineering." },
          { title: "Fear of Automation Breaking Live Operations", description: "Business-critical processes can't afford downtime during a rollout — requiring careful, staged transition planning." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we build automation that survives production and scales with your business."
        items={[
          { title: "Process Discovery First", description: "We map existing workflows end-to-end before writing a line of code — capturing every exception path and edge case." },
          { title: "AI Where It Adds Value, Rules Where Rules Suffice", description: "We don't apply AI indiscriminately. Predictable steps get rule-based logic; context-dependent decisions get AI reasoning." },
          { title: "Staged Rollout With Shadow Mode", description: "New automation runs alongside existing processes first, proving accuracy before replacing manual steps entirely." },
          { title: "Audit-Ready by Design", description: "Every action, decision, and exception is logged with timestamps and actor context — ready for any compliance review." },
          { title: "Exception Escalation Built In", description: "When a case falls outside confidence thresholds, it routes to a human with full context, not to a dead-letter queue." },
          { title: "Integration Into Your Existing Stack", description: "We connect to the systems you already run — ERP, CRM, HRMS, document management — without requiring a platform change." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key capabilities"
        items={[
          { title: "Event-Driven Workflow Triggers", description: "Processes start automatically from emails, form submissions, database events, or API webhooks." },
          { title: "Conditional Branching with AI Decisions", description: "Complex conditional logic evaluated using AI classification — not just fixed if-then rules." },
          { title: "Multi-System Data Orchestration", description: "Reads from and writes to multiple connected systems in a single workflow run." },
          { title: "Human-in-the-Loop Checkpoints", description: "Defined approval or review gates that pause, notify, and resume based on human input." },
          { title: "Full Execution Audit Trails", description: "Every step, decision, and output recorded with the data state at each stage." },
          { title: "SLA Monitoring & Escalation", description: "Automatic alerts and escalation when processes are approaching or breaching defined time limits." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Finance & Accounts Payable Automation", description: "Invoice intake, three-way matching, approval routing, and payment scheduling — fully automated." },
          { title: "HR Onboarding & Offboarding Automation", description: "Account provisioning, document collection, system access grants, and task tracking across IT, HR, and Finance." },
          { title: "Customer Order Processing Automation", description: "Order intake from any channel, inventory checks, fulfilment routing, and customer notification without manual steps." },
          { title: "Regulatory & Compliance Workflows", description: "Automated compliance checks, document verification, and audit log generation for regulated industries." },
          { title: "Cross-System Data Sync Pipelines", description: "Reliable data synchronisation between ERP, CRM, and operational systems on schedule or event-driven trigger." },
          { title: "Custom Process Design & Build", description: "Full discovery, design, and implementation of any multi-step business process specific to your industry and systems." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "Workflow Orchestrators", category: "Process Engine", icon: GitBranch },
          { name: "LLM APIs", category: "AI Decision Engine", icon: Bot },
          { name: "Integration Middleware", category: "Connectivity", icon: Puzzle },
          { name: "Vector & Relational DBs", category: "Data Layer", icon: Database },
          { name: "REST & GraphQL APIs", category: "System Connectors", icon: Network },
          { name: "Monitoring & Tracing", category: "Observability", icon: Gauge },
          { name: "Role-Based Access Control", category: "Security", icon: Lock },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we go from a documented workflow to a monitored, production automation system."
        modules={[
          { title: "Process Discovery & Mapping", duration: "1 Week", topics: ["Current-state workflow documentation", "Exception path mapping", "Integration inventory", "KPI baseline"] },
          { title: "Solution Design", duration: "1 Week", topics: ["Automation architecture", "AI vs rule decision mapping", "Human-in-the-loop design", "Data schema planning"] },
          { title: "Integration Setup", duration: "1–2 Weeks", topics: ["System API connections", "Auth & permissions setup", "Data transformation logic", "Sandbox environment"] },
          { title: "Workflow Build & Testing", duration: "2–4 Weeks", topics: ["Workflow development", "Exception handlers", "AI decision integration", "End-to-end testing"] },
          { title: "Shadow Mode & UAT", duration: "1 Week", topics: ["Parallel-run validation", "Stakeholder sign-off", "Edge case remediation", "Performance benchmarking"] },
          { title: "Production Rollout & Monitoring", duration: "Ongoing", topics: ["Phased go-live", "SLA dashboards", "Escalation tuning", "Continuous optimisation"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A layered architecture for the IPA systems we build."
        layers={[
          { name: "Trigger Layer", description: "Events from emails, webhooks, schedules, or form submissions that initiate workflow execution.", tech: "Event Bus / Webhooks", icon: Zap },
          { name: "Orchestration Layer", description: "The workflow engine that sequences steps, manages state, handles retries, and routes exceptions.", tech: "Workflow Orchestrator", icon: GitBranch },
          { name: "AI Decision Layer", description: "LLM or ML model inference for contextual classification, extraction, or routing decisions.", tech: "LLM APIs / Custom Models", icon: Bot },
          { name: "Integration Layer", description: "Structured connectors into your ERP, CRM, document systems, and notification channels.", tech: "REST / GraphQL / Middleware", icon: Network },
          { name: "Compliance & Audit Layer", description: "Immutable logs, access-controlled audit trails, and SLA enforcement across every workflow run.", tech: "Audit DB + Monitoring", icon: Shield },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of process automation we build across finance, HR, operations, and customer service."
        projects={[
          { title: "Invoice Processing Automation", description: "Automated invoice intake, extraction, GL coding, and three-way matching for a manufacturing firm — reducing processing time from 5 days to same-day.", skills: ["OCR + NLP", "ERP Integration", "Approval Routing"] },
          { title: "Employee Onboarding Workflow", description: "End-to-end onboarding automation across HR, IT, and Finance for a 500-person organisation — eliminating 3 days of manual coordination per hire.", skills: ["HRMS Integration", "Task Orchestration", "Access Provisioning"] },
          { title: "Customer Order Fulfilment Pipeline", description: "Automated order processing from intake to dispatch notification for a D2C brand handling 2,000+ daily orders.", skills: ["Multi-Channel Intake", "Inventory API", "Notification Automation"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Dramatically Lower Processing Times", desc: "Tasks that took days due to manual handoffs are resolved in minutes with automated routing and execution." },
              { name: "Consistent, Error-Free Execution", desc: "Automation doesn't skip steps, misread data, or forget to send a notification — reducing error rates to near zero." },
              { name: "Headcount Growth Decoupled from Volume", desc: "Process capacity scales with demand without proportional headcount growth — a direct impact on unit economics." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Process-First, Technology-Second", desc: "We start with what you actually do — not what a tool happens to support — and design automation around your reality." },
              { name: "Deep Integration Experience", desc: "We've built connectors into a wide range of ERP, CRM, HRMS, and custom systems — not just the popular SaaS platforms." },
              { name: "Production-Ready Engineering", desc: "Every system we build includes error handling, monitoring, retry logic, and escalation paths — not just a happy-path demo." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Dedicated Automation Team", desc: "A committed team for an evolving automation roadmap across multiple processes." },
              { name: "Fixed-Scope Process Automation", desc: "One clearly defined process, fully automated, delivered at a clear price and timeline." },
              { name: "Discovery & Design Sprint", desc: "A structured engagement to map your processes and deliver a prioritised automation roadmap." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by automation scope, so you can plan around a realistic rollout."
        bands={[
          { scope: "Single Process Automation", duration: "4–6 Weeks", fill: 30, description: "One end-to-end workflow automated with all required integrations." },
          { scope: "Multi-Process Automation Suite", duration: "8–14 Weeks", fill: 65, description: "Three to five related workflows automated and interconnected." },
          { scope: "Enterprise Automation Platform", duration: "14+ Weeks", fill: 100, description: "Organisation-wide automation infrastructure with shared governance and monitoring." },
        ]}
      />

      <FAQAccordion faqs={ipaFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Document Intelligence", description: "Add AI document extraction to any step in your automated workflows.", href: "/ai-automations/document-intelligence", icon: Puzzle },
          { title: "Predictive AI Workflows", description: "Trigger automation based on forward-looking AI predictions, not just past events.", href: "/ai-automations/predictive-ai-workflows", icon: TrendingUp },
          { title: "AI Integration Services", description: "Connect LLMs and AI APIs into the workflows you've already built.", href: "/ai-automations/ai-integration-services", icon: LineChart },
        ]}
      />

      <DetailCTA
        heading="Ready to automate your most manual processes?"
        description="Let's map your workflow, identify where AI genuinely helps, and build an automation system that runs reliably in your real production environment."
        ctaLabel="Start a Conversation"
        checklist={["Free process discovery call", "No platform lock-in", "Production-first delivery"]}
      />
    </div>
  );
}
