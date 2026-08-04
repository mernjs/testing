"use client";

import {
  HeartPulse, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Database, Cloud, Video, KeyRound, Lock, Workflow,
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

export const healthcareFaqs: { question: string; answer: string }[] = [
  { question: "How do you ensure HIPAA compliance?", answer: "We design data flows to minimize PHI exposure, encrypt data in transit and at rest, and build with HIPAA's technical, administrative, and physical safeguards in mind from the first architecture review." },
  { question: "Can you integrate with our existing EHR/EMR system?", answer: "Yes, we build HL7/FHIR-based integration layers that connect to most major EHR/EMR systems, so you don't need a full replacement to modernize." },
  { question: "How reliable is your telehealth infrastructure?", answer: "We build on a CDN-backed WebRTC architecture with automatic quality adaptation, tested against real-world network conditions, not just ideal lab environments." },
  { question: "How is patient data secured?", answer: "PHI is encrypted end-to-end, access is role-based down to the individual record, and every access event is logged for audit purposes." },
  { question: "Do you provide post-launch support?", answer: "Yes, we offer SLA-backed support including incident response, monitoring, and ongoing compliance reviews after launch." },
];

export default function HealthcareContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Healthcare"
        subtitle="Digital health, built for patients and providers."
        description="We build patient portals, telehealth platforms, and clinical workflow tools engineered for HIPAA compliance, EHR interoperability, and real clinical usability."
        icon={HeartPulse}
        image="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software that respects both patients and compliance"
        paragraphs={[
          "Healthcare software carries a weight most product categories don't: it touches people at their most vulnerable, and a single compliance gap or workflow mistake can affect real care outcomes, not just a bottom line.",
          "We build patient portals, telehealth platforms, and clinical decision tools with HIPAA and HL7/FHIR requirements designed in from the first architecture diagram, backed by interoperable data pipelines and infrastructure built for clinical-grade reliability.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–9 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Compliance", value: "HIPAA & HL7/FHIR Ready", icon: ShieldCheck },
          { label: "Support", value: "24/7 Clinical SLA", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What makes healthcare software genuinely harder to build than most product categories."
        items={[
          { title: "Regulatory Complexity", description: "HIPAA, HITECH, and regional health data regulations shape nearly every architecture decision." },
          { title: "EHR/EMR Interoperability", description: "Connecting new tools to legacy electronic health record systems is a persistent integration challenge." },
          { title: "Patient Data Privacy & Security", description: "Protected health information is a constant target, and a breach carries both legal and human cost." },
          { title: "Provider Workflow Friction", description: "Clinicians abandon tools that add clicks to an already time-pressured day." },
          { title: "Telehealth Reliability at Scale", description: "Dropped video calls or lag during a consultation directly undermine care quality and trust." },
          { title: "Patient No-shows & Disengagement", description: "Missed appointments and low portal adoption quietly erode both outcomes and revenue." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we design around the constraints that make healthcare software different."
        items={[
          { title: "HIPAA-first Architecture", description: "Systems designed around HIPAA safeguards from day one, not retrofitted after an audit finding." },
          { title: "FHIR/HL7-based Interoperability", description: "Standards-based integration layers that connect to most EHR/EMR systems without a full rebuild." },
          { title: "End-to-end Encryption & Access Controls", description: "PHI encrypted in transit and at rest, with role-based access down to the individual record." },
          { title: "Clinician-first Workflow Design", description: "Interfaces built alongside real clinical workflows, not adapted from a generic admin template." },
          { title: "Resilient Telehealth Infrastructure", description: "CDN-backed WebRTC video architecture built to hold quality under real-world network conditions." },
          { title: "Automated Reminders & Engagement", description: "Multi-channel reminders and portal nudges that measurably reduce no-show rates." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Healthcare"
        description="The parts of our service catalog most relevant to healthcare platforms."
        items={[
          { title: "Web App Development", description: "Secure patient portals and provider dashboards.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Telehealth and patient engagement apps for iOS and Android.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Diagnostic support and readmission risk models.", href: "/services/ai-ml-solutions" },
          { title: "AI Agent", description: "Patient intake assistants and automated triage support.", href: "/services/ai-agent" },
          { title: "Vision Intelligence", description: "Medical imaging analysis and anomaly detection.", href: "/services/vision-intelligence" },
          { title: "Prediction & Forecasting", description: "Readmission risk and patient demand forecasting.", href: "/services/prediction-and-forecasting" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on healthcare platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js / Python", category: "Backend", icon: Server },
          { name: "HL7 / FHIR", category: "Interoperability", icon: Workflow },
          { name: "PostgreSQL / MongoDB", category: "Data Layer", icon: Database },
          { name: "AWS / GCP (HIPAA-eligible)", category: "Cloud Infrastructure", icon: Cloud },
          { name: "WebRTC", category: "Telehealth Video", icon: Video },
          { name: "OAuth2 / SSO", category: "Identity & Access", icon: KeyRound },
          { name: "AES-256 Encryption", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI creates the most leverage across clinical and administrative work."
        items={[
          { title: "Diagnostic Imaging Assistance", description: "Flag anomalies in scans faster, giving radiologists a second set of eyes, not a replacement." },
          { title: "Automated Clinical Documentation", description: "Ambient note-taking that turns patient conversations into structured records automatically." },
          { title: "Readmission Risk Prediction", description: "Score discharge risk so care teams can intervene before a patient bounces back." },
          { title: "AI Patient Intake & Triage", description: "Pre-visit symptom capture and routing that saves front-desk and provider time alike." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Reduced Administrative Burden", desc: "Automated documentation and scheduling free clinical staff to spend more time with patients." },
              { name: "Better Patient Outcomes", desc: "Faster access to care and clearer data give providers what they need to act sooner." },
              { name: "Higher Patient Retention", desc: "A frictionless digital experience keeps patients engaged with your practice instead of a competitor's." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Secure Patient Portals", description: "Self-service access to records, results, and messaging, protected by strong authentication." },
          { title: "Telehealth Video Consultations", description: "Reliable, HD video visits with integrated scheduling and clinical notes." },
          { title: "EHR/EMR Integration", description: "Two-way sync with existing health record systems via HL7/FHIR." },
          { title: "Automated Appointment Reminders", description: "SMS, email, and push reminders configurable by clinic and provider." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take a healthcare platform from concept to an audited, production-grade system."
        modules={[
          { title: "Discovery & Compliance Mapping", duration: "3–5 Days", topics: ["Stakeholder workshops", "HIPAA scoping", "Clinical workflow mapping", "Success metrics"] },
          { title: "UX & Architecture", duration: "1 Week", topics: ["Clinician-tested wireframes", "System architecture", "Interoperability planning", "Access control design"] },
          { title: "Core Platform Build", duration: "3–4 Weeks", topics: ["Patient portal", "Telehealth integration", "Provider dashboard", "Scheduling engine"] },
          { title: "Interoperability & AI Layer", duration: "1–2 Weeks", topics: ["EHR/FHIR integration", "Risk scoring models", "Documentation automation"] },
          { title: "Compliance Audit & Security Testing", duration: "1 Week", topics: ["HIPAA review", "Penetration testing", "Access control validation", "Security sign-off"] },
          { title: "Launch & Monitoring", duration: "Ongoing", topics: ["Phased rollout", "Clinician onboarding", "Uptime monitoring", "Continuous compliance"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of healthcare products we build across clinics, hospitals, and digital health startups."
        projects={[
          { title: "Telehealth Consultation Platform", description: "A full video-visit platform with scheduling, e-prescriptions, and integrated clinical notes.", skills: ["Telehealth", "WebRTC", "EHR Sync"] },
          { title: "Patient Engagement Portal", description: "A self-service portal for records, results, and secure messaging across a multi-clinic network.", skills: ["Portals", "Security", "Notifications"] },
          { title: "Clinical Decision Support Tool", description: "An AI-assisted tool that surfaces risk flags and relevant history at the point of care.", skills: ["AI/ML", "FHIR", "Analytics"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our healthcare platforms drive."
        caseStudies={[
          {
            segment: "Multi-clinic Network",
            title: "Cutting no-show rates across a 12-clinic network",
            challenge: "A multi-clinic provider was losing significant revenue to a 28% no-show rate, with no automated way to remind or re-engage patients.",
            solution: "We built a multi-channel reminder system and self-service rebooking flow integrated directly into their patient portal.",
            metric: "-41%",
            metricLabel: "Reduction in appointment no-shows",
          },
          {
            segment: "Hospital System",
            title: "Reducing documentation time for a hospital system",
            challenge: "Physicians at a regional hospital system were spending hours after each shift catching up on clinical notes, driving burnout.",
            solution: "We deployed an ambient documentation assistant that structures visit notes automatically from the patient conversation.",
            metric: "-36%",
            metricLabel: "Reduction in after-hours documentation time",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Healthcare"
            features={[
              { name: "Healthcare Domain Fluency", desc: "We understand HIPAA, HL7/FHIR, and real clinical workflows, not just generic software delivery." },
              { name: "Compliance-native Engineering", desc: "Encryption, access controls, and audit logging are built in, not bolted on after a finding." },
              { name: "Long-term Clinical Partnership", desc: "We stay involved post-launch, iterating with your clinical and IT teams rather than disappearing after go-live." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={healthcareFaqs}
      />

      <DetailCTA
        heading="Ready to build patient-first healthcare software?"
        description="Let's talk about your patients, your providers, and how we can help you ship a platform they trust."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
