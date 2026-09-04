"use client";

import {
  Bot, Clock, Users, Layers, Headphones,
  Braces, Workflow, Database, Gauge, Lock,
  Plug, Monitor, Shield, CheckCircle, RefreshCw, AppWindow,
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
import { rpaFaqs } from "./faqs";

export default function RoboticProcessAutomationContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="ai-automations"
        categoryLabel="AI & Automations"
        title="Robotic Process Automation"
        subtitle="Automate repetitive desktop and web tasks."
        description="When systems don't expose an API, we build software robots that interact with UIs, fill forms, scrape structured data, and carry out multi-step tasks across legacy and modern apps alike."
        icon={Bot}
        image="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Bridge legacy software gaps without expensive platform upgrades"
        paragraphs={[
          "Many core business systems — legacy ERPs, mainframe software, desktop portals, and older web applications — lack APIs or webhooks. Yet employees spend countless hours manually re-keying data from spreadsheets or emails into these interface screens, taking them away from strategic responsibilities.",
          "Robotic Process Automation (RPA) solves this by using software bots that emulate human UI interactions — logging in, clicking buttons, extracting tabular data, and submitting forms with zero human error. At YashOrbit, we elevate standard RPA by embedding AI reasoning into selector logic, exception handling, and document processing.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "3–6 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Fixed Scope or Managed Bots", icon: Users },
          { label: "Team Composition", value: "RPA Engineers + Automation Architects", icon: Layers },
          { label: "Post-Launch", value: "Bot Maintenance & Execution Audits", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="Scenarios where UI-level software robots provide immediate ROI."
        items={[
          { title: "Legacy Software Lacking Integration APIs", description: "Systems that cannot be connected via REST/GraphQL due to vendor lock-in or outdated architecture." },
          { title: "High-Volume Manual Data Transfer", description: "Re-keying order details, financial records, or patient forms between separate applications daily." },
          { title: "Frequent UI-Based Data Scraping Needs", description: "Collecting competitive pricing, regulatory listings, or portal status updates across external sites." },
          { title: "Human Errors in Data Formatting", description: "Typographical mistakes and missed mandatory fields during manual form submissions." },
          { title: "Backlog in Repetitive Back-Office Tasks", description: "Batch processing tasks piling up during peak business hours or month-end reconciliations." },
          { title: "Prohibitive Cost of Full System Rearchitecture", description: "Replacing legacy systems is too costly, but manual workarounds are slowing growth." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we build resilient software robots that survive UI changes."
        items={[
          { title: "Resilient Selector Design", description: "We use robust, dynamic element selectors and semantic DOM matching to prevent UI layout tweaks from breaking bot execution." },
          { title: "AI-Augmented Exception Handling", description: "When unexpected popups or UI variations occur, our bots utilize vision and LLM fallback logic to adapt automatically." },
          { title: "Unattended & Attended Modes", description: "Bots can run autonomously on background virtual machines or as desktop assistants triggered by user actions." },
          { title: "Comprehensive Audit Logging", description: "Every click, keystroke, and data extraction is logged with screen captures and timestamps for total transparency." },
          { title: "Secure Credential Vaults", description: "Passwords, API keys, and session tokens are encrypted using enterprise credential vaults, never hardcoded." },
          { title: "Hybrid API + UI Orchestration", description: "Wherever APIs exist, we use them; where they don't, we seamlessly fall back to UI automation." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key capabilities"
        items={[
          { title: "Cross-Platform UI Automation", description: "Automates web browsers (Chrome, Edge), desktop apps (Windows/macOS), Citrix sessions, and terminal emulators." },
          { title: "Scheduled & Event-Triggered Bots", description: "Executes batch jobs at set schedules or launches dynamically upon receiving file or email notifications." },
          { title: "Data Scraping & Structuring", description: "Extracts structured tables and nested data from complex web portals and exports to databases or spreadsheets." },
          { title: "PDF & Form Auto-Filling", description: "Reads data payloads and automatically populates government forms, tax portals, and legacy desktop software." },
          { title: "Centralized Bot Dashboard", description: "Monitor active bot instances, success/failure rates, execution duration, and queue health in real time." },
          { title: "Human-in-the-Loop Approval Gates", description: "Pauses bot execution to request human verification for transactions exceeding business limits." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Legacy System Integration Bots", description: "Automated bots that read data from modern platforms and input it into legacy ERPs or desktop applications." },
          { title: "Web Scraping & Aggregation Pipelines", description: "High-volume web scraping bots collecting pricing, supplier inventory, or public data on automated schedules." },
          { title: "Finance & Payroll Processing Bots", description: "Automated monthly payroll calculation uploads, bank statement reconciliation, and tax portal filings." },
          { title: "Customer Portal Data Sync Bots", description: "Bots logging into supplier or client portals to upload status reports and download invoices automatically." },
          { title: "Attended Desktop Assistants", description: "Local desktop scripts assisting customer support reps by pre-filling form fields across multiple apps in one click." },
          { title: "RPA Maintenance & Bot Upgrades", description: "Ongoing maintenance, element selector repairs, and performance tuning for existing RPA installations." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Playwright & Selenium", category: "Web Automation", icon: Monitor },
          { name: "Python RPA", category: "Scripting Engine", icon: Braces },
          { name: "UiPath / Automation Anywhere", category: "Enterprise RPA", icon: Bot },
          { name: "Computer Vision OCR", category: "Visual Selectors", icon: AppWindow },
          { name: "Orchestration Queues", category: "Bot Execution", icon: Workflow },
          { name: "Encrypted Credential Vaults", category: "Security", icon: Lock },
          { name: "Headless Browsers", category: "Scalable Execution", icon: RefreshCw },
          { name: "Logging & Analytics", category: "Observability", icon: Gauge },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we move from manual workflow analysis to reliable automated bot execution."
        modules={[
          { title: "Process Recording & Mapping", duration: "3–5 Days", topics: ["Manual step recording", "UI element mapping", "Exception inventory", "Security permission review"] },
          { title: "Bot Architecture & Selector Design", duration: "1 Week", topics: ["Dynamic selector strategy", "Credential vault configuration", "Error retry logic design", "Data payload schemas"] },
          { title: "Script Development & Testing", duration: "1–2 Weeks", topics: ["Bot scripting", "UI interaction validation", "Exception handling build", "Environment setup"] },
          { title: "UAT & Dry-Run Validation", duration: "1 Week", topics: ["Parallel dry-runs", "Execution speed optimization", "Accuracy auditing", "User sign-off"] },
          { title: "Production Deployment", duration: "2–3 Days", topics: ["Unattended VM deployment", "Schedule & trigger configuration", "Alerting setup"] },
          { title: "Maintenance & Monitoring", duration: "Ongoing", topics: ["UI change monitoring", "Log analysis", "Selector updates", "Capacity scaling"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="The robust structure of our RPA execution architecture."
        layers={[
          { name: "Trigger & Schedule Layer", description: "Initiates bot jobs based on cron schedules, file arrival events, webhooks, or manual user triggers.", tech: "Orchestration Manager", icon: RefreshCw },
          { name: "Selector & Logic Engine", description: "Determines UI state, resolves dynamic DOM/desktop selectors, and executes mouse and keyboard actions.", tech: "Automation Framework", icon: Monitor },
          { name: "AI Fallback Layer", description: "Uses visual AI and computer vision to identify buttons or fields when DOM selectors change unexpectedly.", tech: "Vision AI / OCR", icon: Bot },
          { name: "Secure Storage Layer", description: "Encrypted storage for login credentials, API secrets, and temporary execution payloads.", tech: "Credential Vault", icon: Lock },
          { name: "Audit & Reporting Layer", description: "Captures screenshots, action logs, execution statistics, and alert notifications for compliance review.", tech: "Audit Logs & Dashboards", icon: Shield },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="Real-world RPA deployments delivering measurable time savings."
        projects={[
          { title: "Legacy ERP Data Sync Bot", description: "Software bot transferring 1,500 daily web orders into a legacy Windows-based ERP system — saving 40 hours of manual data entry per week.", skills: ["Desktop Automation", "Excel Parsing", "Legacy ERP"] },
          { title: "Automated Supplier Portal Scraper", description: "Daily web scraping bot retrieving inventory counts and pricing updates from 18 vendor portals and syncing directly into PostgreSQL.", skills: ["Headless Scraping", "Playwright", "Database Sync"] },
          { title: "Bank Reconciliation Bot", description: "Unattended bot logging into 4 banking portals, downloading daily statements, matching transactions against internal ledgers, and flagging discrepancies.", skills: ["Secure Authentication", "PDF Extraction", "Matching Logic"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "100% Elimination of Re-keying Errors", desc: "Software robots execute repetitive tasks with consistent formatting and zero typographical mistakes." },
              { name: "Up to 80% Reduction in Cycle Time", desc: "Batch processes that took hours when performed manually complete in minutes." },
              { name: "Preserve Investments in Legacy Software", desc: "Automate modern workflows on top of legacy applications without expensive software replacement projects." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Resilient Selector Engineering", desc: "We build bots designed to withstand UI changes and minor application updates without crashing." },
              { name: "AI-Enhanced Exception Recovery", desc: "Our bots integrate computer vision and AI fallback logic to handle unexpected popups and layout shifts gracefully." },
              { name: "Enterprise Security First", desc: "Vault-encrypted credentials, zero hardcoded secrets, and full audit logs ensure corporate security compliance." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Fixed-Scope Bot Development", desc: "Automate a specific, documented manual process for a fixed fee and fast delivery timeline." },
              { name: "Managed RPA Retainer", desc: "Ongoing bot development, infrastructure management, selector repairs, and monitoring." },
              { name: "Process Automation Opportunity Assessment", desc: "We audit your back-office processes to identify top RPA candidates prioritized by ROI." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical delivery timelines based on RPA bot complexity."
        bands={[
          { scope: "Single Task Automation Bot", duration: "2–3 Weeks", fill: 30, description: "Automates a single UI process like downloading reports or filling web forms." },
          { scope: "Multi-System Desktop Workflow Bot", duration: "4–6 Weeks", fill: 65, description: "Complex multi-application bot with exception handling and database sync." },
          { scope: "Enterprise RPA Fleet & Management", duration: "8+ Weeks", fill: 100, description: "Multiple automated bots running on unattended VMs with centralized dashboard monitoring." },
        ]}
      />

      <FAQAccordion faqs={rpaFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Intelligent Process Automation", description: "Combine RPA with AI reasoning and multi-step workflow orchestration.", href: "/ai-automations/intelligent-process-automation", icon: Workflow },
          { title: "Document Intelligence", description: "Extract structured data from PDFs before passing it to your RPA bots.", href: "/ai-automations/document-intelligence", icon: Plug },
          { title: "AI Integration Services", description: "Connect modern AI APIs directly to your RPA pipelines.", href: "/ai-automations/ai-integration-services", icon: CheckCircle },
        ]}
      />

      <DetailCTA
        heading="Ready to eliminate manual data entry in your operations?"
        description="Tell us about the repetitive desktop or web tasks slowing your team down, and we'll build software robots to handle them 24/7."
        ctaLabel="Start a Conversation"
        checklist={["Free RPA opportunity assessment", "Resilient UI selectors", "Fast 2–4 week delivery"]}
        category="ai-automations"
        subService="robotic-process-automation"
      />
    </div>
  );
}
