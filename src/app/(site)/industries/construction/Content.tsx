"use client";

import {
  HardHat, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Database, Cloud, ClipboardList, Map, Wifi, Boxes,
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
import { constructionFaqs } from "./faqs";

export default function ConstructionContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Construction"
        subtitle="Job site visibility, from breaking ground to handover."
        description="We build project management platforms, field reporting apps, and site monitoring tools that keep budgets, schedules, and safety visible across every job site."
        icon={HardHat}
        image="https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software that survives the job site, not just the office"
        paragraphs={[
          "Construction runs on hundreds of moving pieces across multiple sites, and most delays and cost overruns trace back to information that existed somewhere but wasn't visible to the people who needed it.",
          "We build project management platforms, field reporting apps, and site monitoring tools designed for people wearing gloves in the rain, not just project managers behind a desk — so budgets, schedules, and safety data stay connected in real time.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–9 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Reliability", value: "Offline-first Site Access", icon: ShieldCheck },
          { label: "Support", value: "Priority Response SLA", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What slows construction firms down once projects scale past a handful of sites."
        items={[
          { title: "Fragmented Project Data", description: "Schedules, budgets, and documents scattered across spreadsheets and disconnected tools slow every decision." },
          { title: "Poor Job Site Connectivity", description: "Field teams often work with limited or no internet, breaking apps that assume constant connectivity." },
          { title: "Delayed Progress Visibility", description: "Office teams often learn about delays and issues days after they happen on site." },
          { title: "Safety Incident Reporting Gaps", description: "Manual, paper-based safety reporting makes it hard to spot patterns before an incident occurs." },
          { title: "Subcontractor Coordination", description: "Keeping dozens of subcontractors aligned on schedule changes is a constant communication challenge." },
          { title: "Budget Overrun Visibility", description: "Cost overruns are often discovered too late to correct course meaningfully." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we turn fragmented job site data into one connected view."
        items={[
          { title: "Unified Project Management Platform", description: "Schedules, budgets, and documents in one system instead of scattered spreadsheets." },
          { title: "Offline-first Field Apps", description: "Daily logs, photos, and reports captured on site, syncing automatically once connected." },
          { title: "Real-time Progress Dashboards", description: "Office and field teams see the same up-to-date project status at the same time." },
          { title: "Digital Safety Reporting", description: "Structured incident and near-miss logging that surfaces patterns before they become injuries." },
          { title: "Centralized Subcontractor Coordination", description: "Schedule changes and task assignments pushed directly to the people who need them." },
          { title: "Live Budget Tracking", description: "Cost data updated in real time against the plan, so overruns get caught early." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Construction"
        description="The parts of our service catalog most relevant to construction and project management platforms."
        items={[
          { title: "Web App Development", description: "Project management dashboards and budget tracking tools.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Offline-first field apps for daily logs and inspections.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Schedule risk and cost overrun prediction models.", href: "/services/ai-ml-solutions" },
          { title: "Vision Intelligence", description: "Site progress tracking and safety compliance from photos.", href: "/services/vision-intelligence" },
          { title: "Prediction & Forecasting", description: "Timeline and material demand forecasting.", href: "/services/prediction-and-forecasting" },
          { title: "AR/VR", description: "3D site visualization and clash detection walkthroughs.", href: "/services/ar-vr" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on construction platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "BIM / CAD Integration", category: "Design Data", icon: Boxes },
          { name: "PostgreSQL / MongoDB", category: "Data Layer", icon: Database },
          { name: "AWS / GCP", category: "Cloud Infrastructure", icon: Cloud },
          { name: "IoT Site Sensors", category: "Site Monitoring", icon: Wifi },
          { name: "GPS / Geo-tagging APIs", category: "Location Tracking", icon: Map },
          { name: "Offline-sync Mobile Frameworks", category: "Field Apps", icon: ClipboardList },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI creates the most leverage across planning, execution, and safety."
        items={[
          { title: "Schedule Risk Prediction", description: "Flag tasks likely to slip before they cascade into project-wide delays." },
          { title: "Automated Progress Tracking", description: "Estimate completion percentage from site photos and drone imagery automatically." },
          { title: "Safety Risk Detection", description: "Spot patterns in incident reports that point to a systemic hazard before it causes injury." },
          { title: "Cost Overrun Forecasting", description: "Project final costs early based on current spend trajectory and historical project data." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Fewer Costly Delays", desc: "Real-time visibility catches schedule risk early enough to actually do something about it." },
              { name: "Improved Site Safety", desc: "Digital incident reporting surfaces hazard patterns before they cause injuries." },
              { name: "Tighter Budget Control", desc: "Live cost tracking replaces the end-of-project surprise with early corrective action." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Offline Daily Field Logs", description: "Photos, notes, and progress reports captured on site without needing signal." },
          { title: "Live Project Dashboard", description: "Schedule, budget, and safety status visible in one place, updated in real time." },
          { title: "Digital Punch Lists & Inspections", description: "Structured checklists that replace paper forms and clipboard tracking." },
          { title: "Subcontractor Task Coordination", description: "Assignments and schedule changes pushed directly to the crews affected." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take a construction platform from concept to a job-site-tested product."
        modules={[
          { title: "Discovery & Site Workflow Audit", duration: "3–5 Days", topics: ["Stakeholder workshops", "Field workflow audit", "Connectivity assessment", "Success metrics"] },
          { title: "UX & Architecture", duration: "1 Week", topics: ["Offline-first design", "System architecture", "BIM/CAD integration planning", "Data model"] },
          { title: "Core Platform Build", duration: "3–4 Weeks", topics: ["Project dashboard", "Field app", "Budget tracking", "Subcontractor coordination"] },
          { title: "AI & Monitoring Layer", duration: "1–2 Weeks", topics: ["Progress tracking from imagery", "Schedule risk models", "Safety analytics"] },
          { title: "Field Testing", duration: "1 Week", topics: ["On-site pilot testing", "Connectivity stress testing", "Usability review with crews"] },
          { title: "Launch & Iteration", duration: "Ongoing", topics: ["Phased rollout", "Crew onboarding", "Usage monitoring", "Continuous improvement"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of construction products we build across general contracting, specialty trades, and developers."
        projects={[
          { title: "Project Management Platform", description: "A unified system for scheduling, budgets, and documents across multi-site construction programs.", skills: ["Scheduling", "Budgeting", "Reporting"] },
          { title: "Field Inspection & Safety App", description: "An offline-first app for daily logs, safety checklists, and incident reporting from the job site.", skills: ["Offline Sync", "Mobile", "Compliance"] },
          { title: "Site Progress Monitoring Tool", description: "A drone and photo-based system that estimates construction progress automatically against plan.", skills: ["Computer Vision", "AI/ML", "Analytics"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our construction platforms drive."
        caseStudies={[
          {
            segment: "General Contractor",
            title: "Cutting schedule delays for a multi-site commercial builder",
            challenge: "A general contractor running a dozen concurrent sites had no unified view of schedule risk, discovering delays only after they became critical.",
            solution: "We built a real-time project dashboard combining field reports and schedule data, with automated risk flags for at-risk tasks.",
            metric: "-27%",
            metricLabel: "Reduction in schedule-related delays",
          },
          {
            segment: "Specialty Trade Contractor",
            title: "Reducing safety incidents for a specialty trade contractor",
            challenge: "A specialty contractor's paper-based safety reporting made it impossible to spot hazard patterns before an injury occurred.",
            solution: "We deployed a digital incident and near-miss reporting app with automated pattern detection across sites.",
            metric: "-34%",
            metricLabel: "Reduction in recordable safety incidents",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Construction"
            features={[
              { name: "Job-site-tested Engineering", desc: "We design for gloves, glare, and patchy signal, not just an office demo." },
              { name: "Connected Field-to-office Data", desc: "We build so office and field teams work from the same real-time information." },
              { name: "Safety-conscious by Default", desc: "We treat incident and hazard visibility as core functionality, not a compliance checkbox." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={constructionFaqs}
      />

      <DetailCTA
        heading="Ready to bring your job sites into one view?"
        description="Let's talk about your projects, your crews, and how we can help you catch problems before they cost you."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
