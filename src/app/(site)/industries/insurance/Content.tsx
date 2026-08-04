"use client";

import {
  Umbrella, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Database, Cloud, FileCheck, ClipboardCheck, ScanLine, Lock,
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

export const insuranceFaqs: { question: string; answer: string }[] = [
  { question: "Can you integrate with our existing policy admin system?", answer: "Yes, we build API and middleware layers that connect to most legacy policy admin systems, so you don't need a full replacement to modernize." },
  { question: "How do you handle state-by-state regulatory differences?", answer: "We build compliance logic as configurable modules, so rules can be adjusted per state or region as you expand without re-architecting the platform." },
  { question: "How do you approach fraud detection?", answer: "We combine rules-based checks with ML-based scoring on claims and application data, so fraud teams can review a prioritized list instead of every claim manually." },
  { question: "Can policyholders file claims from their phone?", answer: "Yes, our claims platforms typically include mobile-friendly, photo-based filing with real-time status tracking." },
  { question: "Do you offer ongoing support after launch?", answer: "Yes, we offer SLA-backed support including monitoring, incident response, and continuous compliance reviews after launch." },
];

export default function InsuranceContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Insurance"
        subtitle="Underwriting and claims, modernized."
        description="We build policy management systems, automated underwriting engines, and claims platforms that cut processing time without cutting corners on risk assessment."
        icon={Umbrella}
        image="https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software that speeds up trust, not just paperwork"
        paragraphs={[
          "Insurance runs on risk assessment and documentation — which is exactly why so many carriers are still stuck with manual underwriting and claims processes that take days when they should take minutes.",
          "We build policy administration systems, automated underwriting engines, and claims platforms that digitize the paperwork without cutting corners on the risk logic underneath, so approvals get faster and disputes get fewer.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–9 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Compliance", value: "State & Regional Regulation Ready", icon: ShieldCheck },
          { label: "Support", value: "24/7 Claims SLA", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What slows insurers down once they try to modernize beyond a legacy policy admin system."
        items={[
          { title: "Slow, Manual Underwriting", description: "Risk assessment still depends on manual document review at many carriers, adding days to every quote." },
          { title: "Legacy Policy Admin Systems", description: "Decades-old core systems make even simple product changes slow and expensive." },
          { title: "Claims Processing Delays", description: "Manual claims review frustrates policyholders and drives up loss-adjustment expense." },
          { title: "Fraudulent Claims", description: "Fraud detection that relies on manual review catches only a fraction of suspicious claims." },
          { title: "Regulatory Complexity", description: "Insurance products must comply with a patchwork of state and regional regulations." },
          { title: "Poor Policyholder Digital Experience", description: "Customers expect self-service quoting and claims, not phone calls and paper forms." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we turn manual insurance operations into connected, faster workflows."
        items={[
          { title: "Automated Underwriting Engines", description: "Rules- and ML-based risk scoring that turns days of manual review into minutes." },
          { title: "API-first Policy Administration", description: "Modern policy admin layers that connect to legacy cores without a full replacement." },
          { title: "Digitized Claims Workflows", description: "Structured intake, document capture, and routing that speeds claims from FNOL to payout." },
          { title: "ML-based Fraud Detection", description: "Pattern-based scoring that flags suspicious claims for review before payout." },
          { title: "Configurable Compliance Rules", description: "Regulatory logic built as configurable modules that adapt as you expand into new states." },
          { title: "Self-service Policyholder Portals", description: "Quoting, policy management, and claims filing that don't require a phone call." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Insurance"
        description="The parts of our service catalog most relevant to insurance platforms."
        items={[
          { title: "Web App Development", description: "Policy admin systems and self-service policyholder portals.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Mobile claims filing with photo capture and status tracking.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Automated underwriting and fraud detection models.", href: "/services/ai-ml-solutions" },
          { title: "AI Agent", description: "Claims intake assistants and policy Q&A support.", href: "/services/ai-agent" },
          { title: "Vision Intelligence", description: "Damage assessment from claim photos and documents.", href: "/services/vision-intelligence" },
          { title: "Prediction & Forecasting", description: "Loss ratio and claims volume forecasting.", href: "/services/prediction-and-forecasting" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on insurance platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js / Java", category: "Backend", icon: Server },
          { name: "PostgreSQL", category: "Policy & Claims Data", icon: Database },
          { name: "AWS / GCP", category: "Cloud Infrastructure", icon: Cloud },
          { name: "OCR / Document AI", category: "Document Processing", icon: ScanLine },
          { name: "E-signature APIs", category: "Digital Policy Issuance", icon: FileCheck },
          { name: "Rules Engines", category: "Underwriting Logic", icon: ClipboardCheck },
          { name: "OAuth2 / Encryption", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI meaningfully reduces cost and risk across underwriting and claims."
        items={[
          { title: "Automated Risk Scoring", description: "Assess applications against historical and real-time risk signals in seconds, not days." },
          { title: "Claims Fraud Detection", description: "Flag suspicious claims patterns before payout using behavioral and historical data." },
          { title: "Document Data Extraction", description: "Pull structured data from applications and claim forms automatically using document AI." },
          { title: "Damage Assessment from Photos", description: "Estimate claim severity from submitted photos to speed up adjuster decisions." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Faster Underwriting Cycles", desc: "Automated risk scoring turns multi-day quotes into a near-instant decision." },
              { name: "Lower Loss-adjustment Expense", desc: "Digitized claims workflows cut the manual review time behind every payout." },
              { name: "Reduced Fraud Losses", desc: "ML-based detection catches suspicious claims that manual review alone would miss." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Instant Quoting Engine", description: "Self-service quoting backed by automated, rules-based risk assessment." },
          { title: "Digital Claims Filing", description: "Photo-based claims intake with real-time status tracking for policyholders." },
          { title: "Policyholder Self-service Portal", description: "Policy management, payments, and document access in one place." },
          { title: "Fraud Risk Dashboard", description: "A prioritized view of flagged claims for adjusters and investigators." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take an insurance platform from concept to a compliant, production-grade system."
        modules={[
          { title: "Discovery & Compliance Mapping", duration: "3–5 Days", topics: ["Stakeholder workshops", "Regulatory scoping", "Risk model review", "Success metrics"] },
          { title: "Architecture & Rules Design", duration: "1 Week", topics: ["System architecture", "Underwriting rules mapping", "Data flow design", "Integration planning"] },
          { title: "Core Platform Build", duration: "3–5 Weeks", topics: ["Policy admin core", "Claims workflow engine", "Quoting engine", "Policyholder portal"] },
          { title: "AI & Automation Layer", duration: "1–2 Weeks", topics: ["Risk scoring models", "Fraud detection", "Document AI extraction"] },
          { title: "Compliance Review & Testing", duration: "1 Week", topics: ["Regulatory review", "Security testing", "Rules validation", "UAT with underwriters"] },
          { title: "Launch & Monitoring", duration: "Ongoing", topics: ["Phased rollout", "Adjuster onboarding", "Performance monitoring", "Continuous compliance"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of insurance products we build across underwriting, claims, and policyholder experience."
        projects={[
          { title: "Automated Underwriting Engine", description: "A rules- and ML-based underwriting system that turns multi-day quotes into near-instant decisions.", skills: ["Risk Scoring", "Rules Engine", "APIs"] },
          { title: "Digital Claims Platform", description: "An end-to-end claims system from FNOL through adjuster review to payout, with photo-based damage assessment.", skills: ["Claims", "Document AI", "Workflow"] },
          { title: "Policyholder Self-service Portal", description: "A portal for quoting, policy management, and claims filing that replaced a call-center-first experience.", skills: ["Portals", "Payments", "UX"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our insurance platforms drive."
        caseStudies={[
          {
            segment: "Personal Lines Carrier",
            title: "Cutting quote-to-bind time for a personal lines carrier",
            challenge: "A regional carrier's manual underwriting process took up to 3 days per application, losing price-sensitive customers to faster competitors.",
            solution: "We built an automated underwriting engine that scores risk in real time using third-party and historical data.",
            metric: "-85%",
            metricLabel: "Reduction in quote-to-bind time",
          },
          {
            segment: "Claims Operations",
            title: "Reducing fraud losses for a property & casualty insurer",
            challenge: "A P&C insurer's rules-based fraud checks were catching fraud too late, after payout had already occurred.",
            solution: "We deployed an ML-based fraud scoring layer that flags high-risk claims for review before approval.",
            metric: "-52%",
            metricLabel: "Reduction in fraud-related claim losses",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Insurance"
            features={[
              { name: "Insurance Domain Fluency", desc: "We understand underwriting, claims, and regulatory logic, not just generic CRUD workflows." },
              { name: "Automation Without Cutting Corners", desc: "We digitize processes without weakening the risk assessment underneath them." },
              { name: "Built to Integrate with Legacy Cores", desc: "We connect to your existing policy admin systems rather than forcing a costly rip-and-replace." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={insuranceFaqs}
      />

      <DetailCTA
        heading="Ready to modernize underwriting and claims?"
        description="Let's talk about your risk models, your policyholders, and how we can help you process faster without cutting corners."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
