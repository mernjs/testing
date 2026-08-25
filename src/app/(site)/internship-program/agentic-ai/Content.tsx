"use client";

import {
  Bot, Clock, Monitor, BarChart3, FolderGit2, Users, Calendar,
  Braces, Workflow, Puzzle, Database, Network, Gauge, Package,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import TrainingMeta from "@/components/sections/TrainingMeta";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { agenticAiInternshipFaqs } from "./faqs";

export default function AgenticAiInternshipContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="internship-program"
        categoryLabel="internship"
        title="Agentic AI Internship"
        subtitle="Build autonomous systems that ship."
        description="An 8–12 week paid internship where you design and build goal-driven, tool-using AI agents for real automation problems, reviewed by a practicing agentic AI engineer."
        icon={Bot}
        image="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Move from agent theory to a deployed autonomous system"
        paragraphs={[
          "This is the internship that follows our Agentic AI training — you're placed on a real automation project, working on agent planning, tool integration, or multi-agent coordination tied to an actual business workflow.",
          "You'll ramp up on the project's architecture and tools in week one, move into guided agent-building work, and by the second half of the internship, you'll be owning an agent capability end to end, from design through safety review and deployment.",
        ]}
        stats={[
          { label: "Duration", value: "8–12 Weeks", icon: Clock },
          { label: "Format", value: "Online & Offline", icon: Monitor },
          { label: "Track", value: "Agentic AI", icon: BarChart3 },
          { label: "Stipend", value: "Performance-based", icon: FolderGit2 },
        ]}
      />

      <TrainingMeta
        items={[
          { icon: Monitor, label: "Mode", value: "Online / Offline" },
          { icon: Clock, label: "Duration", value: "8–12 Weeks" },
          { icon: Users, label: "Cohort Size", value: "4–6 Interns" },
          { icon: Calendar, label: "Schedule", value: "Full-time, Weekdays" },
        ]}
      />

      <ChecklistGrid
        id="work"
        title="What you'll work on"
        description="Real agent-building work, scoped to grow with your skill level."
        items={[
          { title: "Agent Planning Logic", description: "Design and refine the reasoning and planning steps for a real agent workflow." },
          { title: "Tool & Function Integration", description: "Give an agent structured, safe access to real APIs and internal tools." },
          { title: "Agent Memory Implementation", description: "Build short-term or long-term memory for an agent working on a real task." },
          { title: "Guardrail & Safety Checks", description: "Add constraints and evaluation checks before an agent's actions ship." },
          { title: "Code Review Participation", description: "Have your pull requests reviewed, and review others', as part of the team's workflow." },
          { title: "Monitoring & Deployment Support", description: "Help take an agent service through staging, monitoring, and deployment." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies you'll work with"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "Agent Frameworks", category: "Orchestration", icon: Workflow },
          { name: "Function Calling", category: "Tool Use", icon: Puzzle },
          { name: "Vector Memory Stores", category: "Agent Memory", icon: Database },
          { name: "Task Orchestration", category: "Multi-agent Coordination", icon: Network },
          { name: "Tracing & Monitoring", category: "Observability", icon: Gauge },
          { name: "LLM APIs", category: "Model Access", icon: Bot },
          { name: "Docker", category: "Deployment", icon: Package },
        ]}
      />

      <CurriculumTimeline
        title="How the internship is structured"
        description="A four-phase structure that moves you from onboarding to owning a real agent capability."
        modules={[
          { title: "Onboarding & Project Ramp-up", duration: "Week 1", topics: ["Tooling and environment setup", "Agent architecture and tool walkthrough", "Meet your mentor and team", "First small, guided task"] },
          { title: "Guided Agent-building Work", duration: "Weeks 2–6", topics: ["Paired work on real planning and tool-use tickets", "Daily standups and sprint planning", "Code review on every pull request", "Mid-internship progress check-in"] },
          { title: "Independent Feature Ownership", duration: "Weeks 7–10", topics: ["Own an agent capability end-to-end with mentor support", "Run safety and evaluation checks", "Participate in deployment", "Document your work for the team"] },
          { title: "Final Presentation & Evaluation", duration: "Weeks 11–12", topics: ["Present your shipped work to the team", "Mentor evaluation and written feedback", "Certificate and LOR eligibility review", "Full-time opportunity discussion, if applicable"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="The kind of work interns actually ship"
        description="Real examples of feature scope Agentic AI interns take on."
        projects={[
          { title: "Research Assistant Tool Integration", description: "Added a new data-source tool to an existing autonomous research agent.", skills: ["Python", "Tool Calling", "Vector Memory"] },
          { title: "Customer Ops Agent Handoff Logic", description: "Built the handoff logic between two cooperating agents in a customer support workflow.", skills: ["Multi-agent Orchestration", "APIs", "Guardrails"] },
          { title: "Workflow Automation Guardrails", description: "Added safety checks and human-in-the-loop review to an internal automation agent.", skills: ["Function Calling", "Monitoring", "Python"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="What makes this internship real"
            features={[
              { name: "Real Automation Problems, Not Sandboxes", desc: "You work on agent capabilities tied to actual business workflows, not toy tasks." },
              { name: "A Named Mentor", desc: "You're paired with one AI engineer for the full internship who reviews your work and tracks your growth." },
              { name: "Safety-first Practices", desc: "You practice the guardrail and review habits real teams use before deploying autonomous agents." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="eligibility"
        tone="muted"
        title="Eligibility"
        items={[
          { title: "Basic Python Knowledge", description: "Comfortable reading and writing basic Python is expected." },
          { title: "LLM or Agent Exposure Helpful", description: "Prior exposure to LLM APIs or our Agentic AI training program is a plus, but not mandatory." },
          { title: "Full-time Availability", description: "Able to commit to a full-time, weekday schedule for the internship's duration." },
          { title: "A GitHub Profile", description: "Any prior project work or coursework repos you can share with your application." },
        ]}
      />

      <ChecklistGrid
        id="benefits"
        title="What you walk away with"
        items={[
          { title: "Performance-based Stipend", description: "A paid internship, with stipend tied to your track and prior experience." },
          { title: "Certificate of Completion", description: "Awarded to every intern who completes the program's full evaluation." },
          { title: "Letter of Recommendation", description: "Issued to strong performers based on their mentor's written evaluation." },
          { title: "A Real Shipped Portfolio", description: "A deployed agent capability you can show and speak to in interviews." },
          { title: "Full-time Consideration", description: "Top performers are considered first when Agentic AI Engineer roles open." },
          { title: "A Direct Mentor Reference", description: "A working AI engineer who can speak to your work firsthand." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why intern with YashOrbit"
            features={[
              { name: "You Ship, Not Just Learn", desc: "Every intern's work goes into a real deployed agent capability, not a personal sandbox project." },
              { name: "Mentors Who Are Still Building", desc: "You're reviewed by engineers actively shipping agentic systems to clients." },
              { name: "A Clear Path to Full-time", desc: "Strong performance is the primary path to a full-time offer, evaluated transparently." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={agenticAiInternshipFaqs}
      />

      <DetailCTA
        heading="Ready to intern on real Agentic AI work?"
        description="Apply for the Agentic AI internship and start shipping autonomous systems that actually go live."
        ctaLabel="Apply Now"
      />
    </div>
  );
}
