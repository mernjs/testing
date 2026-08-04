"use client";

import {
  Landmark, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Database, Workflow, Cloud, Blocks, Lock, CreditCard,
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

export const financeFaqs: { question: string; answer: string }[] = [
  { question: "How do you ensure PCI-DSS compliance?", answer: "We design data flows to minimize cardholder data exposure, use tokenization wherever possible, and build with PCI-DSS control requirements in mind from the first architecture review." },
  { question: "Can you integrate with our existing core banking system?", answer: "Yes, we build API and middleware layers that connect to most legacy core banking systems, so you don't need a full replacement to modernize." },
  { question: "How do you handle fraud detection at scale?", answer: "We use real-time, ML-based transaction scoring combined with configurable rule engines, so fraud teams can tune sensitivity without waiting on engineering." },
  { question: "What regions' financial regulations do you have experience with?", answer: "We've worked with PCI-DSS and KYC/AML frameworks across multiple regions — we'll run a compliance scoping session upfront for your specific markets." },
  { question: "Do you provide post-launch security support?", answer: "Yes, we offer SLA-backed support including incident response, monitoring, and ongoing compliance reviews after launch." },
];

export default function FinanceContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Finance"
        subtitle="Secure financial technology."
        description="We engineer highly secure, compliant, and lightning-fast financial applications. From payment gateways to blockchain integration, we build the future of finance."
        icon={Landmark}
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software that treats compliance as architecture, not paperwork"
        paragraphs={[
          "Financial products live or die on trust. A single security incident or compliance failure can undo years of user confidence — which is why fintech engineering can't treat regulation as a checklist bolted on at the end.",
          "We build payment systems, lending platforms, and financial dashboards with PCI-DSS and KYC/AML requirements designed in from the first architecture diagram, backed by real-time fraud detection and infrastructure built for zero-downtime transaction processing.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–10 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Compliance", value: "PCI-DSS & KYC/AML Ready", icon: ShieldCheck },
          { label: "Support", value: "24/7 SLA & Incident Response", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What makes financial software genuinely harder to build than most product categories."
        items={[
          { title: "Regulatory Complexity", description: "Navigating PCI-DSS, KYC/AML, and regional financial regulations slows down product launches." },
          { title: "Fraud & Security Risks", description: "Financial platforms are constant targets for fraud, account takeover, and transaction manipulation." },
          { title: "Legacy Core Banking Integration", description: "Connecting modern apps to decades-old core banking systems is a common bottleneck." },
          { title: "Real-time Transaction Demands", description: "Users expect instant payments and balance updates, with zero tolerance for lag or downtime." },
          { title: "Trust & Transparency", description: "Users abandon financial products the moment they feel uncertain about security or fees." },
          { title: "Scaling Without Compromising Compliance", description: "Growth often forces trade-offs between speed and regulatory adherence." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we design around the constraints that make fintech different."
        items={[
          { title: "Compliance-first Architecture", description: "Systems designed around PCI-DSS and KYC/AML requirements from day one, not retrofitted later." },
          { title: "Real-time Fraud Detection", description: "ML-based transaction monitoring that flags anomalies without adding friction for legitimate users." },
          { title: "API-first Core Banking Integration", description: "Middleware layers that connect modern apps to legacy banking cores without a full rip-and-replace." },
          { title: "Event-driven Transaction Processing", description: "Architecture built around message queues and event streams for sub-second processing." },
          { title: "Transparent UX Design", description: "Clear fee breakdowns, transaction statuses, and security indicators that build user trust." },
          { title: "Modular Compliance Layers", description: "Compliance logic built as independent modules that scale with new markets and regulations." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Finance"
        description="The parts of our service catalog most relevant to financial products."
        items={[
          { title: "Web App Development", description: "Secure web dashboards and customer portals for financial products.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Native banking and payments apps with biometric security.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Fraud detection and credit risk scoring models.", href: "/services/ai-ml-solutions" },
          { title: "AI Agent", description: "Automated customer support and KYC document review assistants.", href: "/services/ai-agent" },
          { title: "Prediction & Forecasting", description: "Cash flow forecasting and default risk prediction.", href: "/services/prediction-and-forecasting" },
          { title: "Vision Intelligence", description: "Document verification and ID scanning for onboarding.", href: "/services/vision-intelligence" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on financial platforms."
        items={[
          { name: "Node.js / Java", category: "Backend", icon: Server },
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "PostgreSQL", category: "Transactional Data", icon: Database },
          { name: "Kafka", category: "Event Streaming", icon: Workflow },
          { name: "AWS / GCP", category: "Cloud Infrastructure", icon: Cloud },
          { name: "Blockchain / Ledger Tech", category: "Distributed Ledgers", icon: Blocks },
          { name: "OAuth2 / mTLS", category: "Security", icon: Lock },
          { name: "Payment Gateway APIs", category: "Payments", icon: CreditCard },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI meaningfully reduces risk and manual work in financial products."
        items={[
          { title: "Real-time Fraud Scoring", description: "Score every transaction in milliseconds using behavioral and historical patterns." },
          { title: "Automated KYC/AML Checks", description: "Cut onboarding time from days to minutes with automated document and identity verification." },
          { title: "Credit Risk Modeling", description: "Data-driven credit scoring that adapts faster than traditional bureau-based models." },
          { title: "Conversational Support Agents", description: "AI agents that handle balance inquiries, disputes, and common account questions." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Reduced Fraud Losses", desc: "Real-time detection catches suspicious activity before it becomes a chargeback or loss." },
              { name: "Faster Regulatory Approval", desc: "Compliance-first architecture shortens the path through audits and certifications." },
              { name: "Higher Customer Trust", desc: "Transparent, secure experiences translate directly into retention and referrals." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Multi-factor & Biometric Auth", description: "Layered authentication that balances security with a frictionless login experience." },
          { title: "Real-time Transaction Ledger", description: "Instant balance and transaction visibility across web and mobile." },
          { title: "Automated Reconciliation", description: "Systems that match and reconcile transactions across providers without manual review." },
          { title: "Configurable Risk Rules", description: "Fraud and compliance rules that risk teams can tune without engineering involvement." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take a financial product from concept to an audited, production-grade system."
        modules={[
          { title: "Discovery & Compliance Mapping", duration: "1 Week", topics: ["Regulatory scoping", "Risk assessment", "Stakeholder workshops", "Success metrics"] },
          { title: "Architecture & Security Design", duration: "1–2 Weeks", topics: ["Threat modeling", "System architecture", "Data flow mapping", "Key management"] },
          { title: "Core Platform Build", duration: "3–5 Weeks", topics: ["Transaction engine", "Ledger system", "Payment integrations", "Admin tooling"] },
          { title: "Fraud & Risk Layer", duration: "1–2 Weeks", topics: ["ML fraud models", "Rule engine", "Real-time scoring", "Alerting"] },
          { title: "Compliance Audit & Pen Testing", duration: "1 Week", topics: ["PCI-DSS review", "Penetration testing", "KYC/AML validation", "Security sign-off"] },
          { title: "Launch & Monitoring", duration: "Ongoing", topics: ["Phased rollout", "Incident response setup", "Uptime monitoring", "Continuous compliance"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of financial products we build across lending, payments, and wealth management."
        projects={[
          { title: "Digital Lending Platform", description: "An end-to-end loan origination and underwriting system with automated credit scoring.", skills: ["Credit Scoring", "KYC", "APIs"] },
          { title: "Real-time Payments Gateway", description: "A payment processing layer supporting instant transfers across multiple banking rails.", skills: ["Payments", "Event Streaming", "Security"] },
          { title: "Wealth Management Dashboard", description: "A portfolio tracking and rebalancing tool for retail investors with real-time market data.", skills: ["Analytics", "Real-time Data", "Compliance"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our financial platforms drive."
        caseStudies={[
          {
            segment: "Digital Lending",
            title: "Cutting loan approval time for a consumer lending platform",
            challenge: "A lending platform's manual underwriting process took up to 5 days per application, causing high applicant drop-off.",
            solution: "We built an automated credit scoring and document verification pipeline that pre-qualifies applicants in real time.",
            metric: "-80%",
            metricLabel: "Reduction in average approval time",
          },
          {
            segment: "Payments",
            title: "Reducing fraud losses for a multi-currency payments provider",
            challenge: "A payments provider was losing a significant share of revenue to transaction fraud that their rules-based system caught too late.",
            solution: "We deployed a real-time ML fraud scoring layer that flags suspicious transactions before settlement.",
            metric: "-64%",
            metricLabel: "Reduction in fraud-related losses",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Finance"
            features={[
              { name: "Compliance-native Engineering", desc: "We design for PCI-DSS and KYC/AML from the first architecture diagram, not as a late-stage patch." },
              { name: "Security as a Default", desc: "Encryption, key management, and access controls are built in, not bolted on after an audit finding." },
              { name: "Financial Domain Fluency", desc: "We speak the language of ledgers, settlement, and risk — not just generic software delivery." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={financeFaqs}
      />

      <DetailCTA
        heading="Ready to build secure, compliant financial software?"
        description="Let's talk about your compliance requirements, your users, and how we can help you ship a platform they trust."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
