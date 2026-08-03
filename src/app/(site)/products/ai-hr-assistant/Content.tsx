"use client";

import {
  UserCog, Users2, Cloud, Sparkles,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  Bell, FileCheck, Phone,
  MessageSquare, FolderSearch, Activity,
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

export default function AIHRAssistantContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="AI HR Assistant"
        subtitle="Automate your human resources."
        description="Revolutionize your HR department. This AI-powered tool handles initial candidate screening, employee onboarding, and routine HR queries automatically."
        icon={UserCog}
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["Resume Parsing", "AI Powered", "Onboarding Automation", "HR Chatbot"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Give your HR team its time back"
        paragraphs={[
          "AI HR Assistant automates the repetitive parts of hiring and onboarding — screening resumes, scheduling interviews, answering policy questions — so your HR team spends time on people decisions, not paperwork.",
          "It's built for HR and talent acquisition teams at growing companies who are hiring faster than their headcount can keep up with, and need screening, onboarding, and employee support to scale without adding recruiters.",
        ]}
        stats={[
          { label: "Built For", value: "HR & Talent Acquisition Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Hiring & Onboarding Automation", icon: UserCog },
          { label: "Deployment", value: "Cloud, SaaS", icon: Cloud },
          { label: "Category", value: "AI-Powered HR Platform", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Automation built around the actual hiring and onboarding funnel."
        items={[
          { title: "AI Resume Screening", description: "Automatically rank and shortlist candidates against role requirements, cutting manual resume review time." },
          { title: "Interview Scheduling", description: "Candidates self-book interview slots synced to recruiter calendars, eliminating back-and-forth emails." },
          { title: "Automated Onboarding Checklists", description: "New hires get a guided onboarding flow with document collection and task tracking." },
          { title: "HR Query Chatbot", description: "Employees get instant answers to common policy questions without opening a ticket." },
          { title: "Candidate Communication", description: "Automated status updates keep candidates informed at every stage, improving employer brand." },
          { title: "Compliance Document Tracking", description: "Track required employment documents and certifications with automatic expiry reminders." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Applicant Tracking", description: "Manage job postings, applications, and candidate pipelines in one view." },
          { title: "Resume Intelligence", description: "AI-assisted parsing and scoring of incoming resumes against job criteria." },
          { title: "Onboarding Workflows", description: "Configurable step-by-step onboarding journeys for new hires." },
          { title: "HR Helpdesk", description: "Chatbot and ticketing for employee policy and benefits questions." },
          { title: "Document Center", description: "Secure storage and tracking for employment and compliance documents." },
          { title: "Reporting", description: "Hiring funnel and onboarding completion analytics." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How an HR team goes from job posting to a fully onboarded hire."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create HR workspace", "Add recruiters & hiring managers"] },
          { title: "Setup", duration: "Step 2", topics: ["Post job openings", "Import candidate pipeline"] },
          { title: "Configure", duration: "Step 3", topics: ["Set screening criteria", "Build onboarding checklists"] },
          { title: "Use Features", duration: "Step 4", topics: ["Screen & shortlist candidates", "Onboard new hires"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Review hiring funnel metrics"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track onboarding completion", "Monitor open requisitions"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add hiring teams", "Expand to new departments"] },
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
          { name: "Resume Parsing NLP", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "SSO & RBAC", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "AI Resume Screening", description: "Score and rank candidates automatically based on role fit, not just keyword matches." },
          { title: "Conversational AI", description: "An HR chatbot answers common employee questions instantly, day or night." },
          { title: "Automation", description: "Onboarding tasks, reminders, and document requests trigger automatically as candidates move stages." },
          { title: "Predictive Analytics", description: "Surface likely time-to-hire and flag stalled requisitions before they become a problem." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect AI HR Assistant to the tools your recruiting team already uses."
        items={[
          { name: "LinkedIn", category: "Job Sourcing", icon: Users2 },
          { name: "Slack", category: "Team Notifications", icon: Bell },
          { name: "Google Workspace", category: "Calendar Sync", icon: Cloud },
          { name: "DocuSign", category: "Offer Letters", icon: FileCheck },
          { name: "Zoom", category: "Interview Scheduling", icon: Phone },
          { name: "REST APIs", category: "HRIS Sync", icon: Server },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Faster Time-to-Hire", desc: "Automated screening and scheduling cut weeks out of the typical hiring cycle." },
              { name: "Reduced HR Workload", desc: "Routine questions and admin tasks are handled by the platform, not a person." },
              { name: "Better Candidate Experience", desc: "Fast responses and clear communication keep candidates engaged through the process." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using AI HR Assistant"
        columns={2}
        items={[
          { title: "Education", description: "Streamline hiring for fast-growing education technology teams.", href: "/industries/education" },
          { title: "Finance", description: "Manage compliance-heavy onboarding for regulated financial roles.", href: "/industries/finance" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the AI HR Assistant workspace."
        images={[
          { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", caption: "Candidate Pipeline" },
          { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", caption: "HR Chatbot" },
          { src: "https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=800&auto=format&fit=crop", caption: "Onboarding Checklist" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Fast-Growing Startup",
            title: "Cutting time-to-hire for a scaling engineering team",
            challenge: "A 150-person startup's two-person HR team couldn't keep up with resume volume for a rapid engineering hiring push, and candidates were dropping off due to slow responses.",
            solution: "We deployed AI HR Assistant's screening and scheduling modules, automatically shortlisting candidates and letting them self-book interviews.",
            metric: "-47%",
            metricLabel: "Average time-to-hire",
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Does the AI screening replace human judgment in hiring?", answer: "No, it shortlists and ranks candidates to save time, but hiring managers make every final decision." },
          { question: "Can we customize onboarding checklists per role?", answer: "Yes, onboarding workflows are fully configurable per department or role." },
          { question: "Does the HR chatbot handle sensitive employee issues?", answer: "It handles routine policy and benefits questions, and is designed to escalate sensitive issues directly to an HR team member." },
          { question: "Can it integrate with our existing HRIS?", answer: "Yes, via REST APIs and common integrations, so you don't need to replace your core HR system." },
          { question: "Is candidate data handled securely?", answer: "Yes, data is encrypted in transit and at rest, with role-based access controls for recruiters and hiring managers." },
        ]}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "ConvoCraft", description: "Extend conversational AI beyond HR to customer-facing channels.", href: "/products/convocraft", icon: MessageSquare },
          { title: "AI Powered Smart DMS", description: "Manage employee documents and compliance records centrally.", href: "/products/ai-powered-smart-dms", icon: FolderSearch },
          { title: "DataPulse AI", description: "Turn hiring and workforce data into executive dashboards.", href: "/products/datapulse-ai", icon: Activity },
        ]}
      />

      <DetailCTA
        heading="Ready to modernize your hiring process?"
        description="See how AI HR Assistant can speed up screening and onboarding for your team."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
