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
import { agenticAiFaqs } from "./faqs";

export default function AgenticAiContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industrial-training"
        categoryLabel="training"
        title="Agentic AI Training"
        subtitle="Systems that plan and act, not just chat."
        description="Learn to design autonomous AI agents that break down goals, call tools, remember context, and coordinate with other agents — the skill set behind the next generation of AI-powered automation."
        icon={Bot}
        image="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Move from single prompts to autonomous, goal-driven agents"
        paragraphs={[
          "A chatbot answers one message at a time. An agent breaks a goal into steps, decides which tools to use, keeps track of progress, and adapts when something goes wrong — that shift from reactive to autonomous is what this program is built around.",
          "You'll learn the core patterns behind agentic systems: planning loops, function/tool calling, memory design, and multi-agent coordination — then apply them to real automation problems, with safety and evaluation built in from the start rather than bolted on.",
        ]}
        stats={[
          { label: "Duration", value: "10 Weeks", icon: Clock },
          { label: "Format", value: "Online & Offline", icon: Monitor },
          { label: "Level", value: "Intermediate-friendly", icon: BarChart3 },
          { label: "Projects", value: "3 Applied Builds", icon: FolderGit2 },
        ]}
      />

      <TrainingMeta
        items={[
          { icon: Monitor, label: "Mode", value: "Online / Offline" },
          { icon: Clock, label: "Duration", value: "10 Weeks" },
          { icon: Users, label: "Batch Size", value: "12–15 Learners" },
          { icon: Calendar, label: "Schedule", value: "Weekday & Weekend" },
        ]}
      />

      <ChecklistGrid
        id="learn"
        title="What you will learn"
        description="The core building blocks behind reliable, autonomous AI agents."
        items={[
          { title: "Agent Planning Loops", description: "Design agents that reason step-by-step and adapt their plan as new information arrives." },
          { title: "Tool & Function Calling", description: "Give agents structured access to APIs, databases, and external tools safely." },
          { title: "Agent Memory Design", description: "Implement short-term and long-term memory so agents retain useful context." },
          { title: "Multi-agent Orchestration", description: "Coordinate multiple specialized agents working together toward a shared goal." },
          { title: "Safety & Guardrails", description: "Constrain autonomous actions with guardrails and human-in-the-loop checkpoints." },
          { title: "Evaluating Agent Behavior", description: "Test agents for reliability, cost, and failure modes before shipping them." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools covered"
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
        title="Training roadmap"
        description="From single-agent planning to coordinated, multi-agent systems in production."
        modules={[
          { title: "Foundations of Agentic Systems", duration: "2 Weeks", topics: ["Agent vs. chatbot", "Reasoning loops", "Planning strategies", "Basic memory"] },
          { title: "Tool Use & Function Calling", duration: "2 Weeks", topics: ["Defining tools", "Function calling APIs", "Structured outputs", "Error recovery"] },
          { title: "Agent Memory & State", duration: "1 Week", topics: ["Short vs. long-term memory", "Vector memory stores", "Context window management"] },
          { title: "Multi-agent Orchestration", duration: "2 Weeks", topics: ["Agent roles", "Coordinator patterns", "Message passing", "Task delegation"] },
          { title: "Safety, Evaluation & Guardrails", duration: "2 Weeks", topics: ["Guardrails for autonomy", "Evaluating behavior", "Human-in-the-loop design"] },
          { title: "Deployment & Capstone Project", duration: "1 Week", topics: ["Deploying agent services", "Monitoring & tracing", "Final project demo"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Real-world projects you'll build"
        description="Agent systems built around real automation and operations problems."
        projects={[
          { title: "Autonomous Research Assistant", description: "An agent that plans a research task, searches for information, and drafts a structured report.", skills: ["Python", "Tool Calling", "Vector Memory"] },
          { title: "Multi-agent Customer Ops Bot", description: "Cooperating agents that triage, investigate, and resolve incoming customer requests.", skills: ["Multi-agent Orchestration", "APIs", "Guardrails"] },
          { title: "Workflow Automation Agent", description: "An agent that automates a multi-step internal business workflow end to end.", skills: ["Function Calling", "Task Orchestration", "Monitoring"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Internship & industrial exposure"
            features={[
              { name: "Real Automation Briefs", desc: "Work on agent problems modeled after real business automation requests." },
              { name: "Mentor Reviews on Agent Design", desc: "Get feedback on planning logic and tool design from practicing AI engineers." },
              { name: "Safety-first Practices", desc: "Practice the guardrail and review habits real teams use before deploying autonomous agents." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Learning methodology"
            features={[
              { name: "Build-measure-adjust Cycles", desc: "Every agent you build is tested against real tasks and refined based on results." },
              { name: "1:1 Mentorship", desc: "Weekly sessions with a mentor experienced in agent system design." },
              { name: "Applied Assessments", desc: "Evaluated on working agent behavior, not theory quizzes." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="eligibility"
        title="Eligibility"
        items={[
          { title: "Basic Python Knowledge", description: "Comfort reading and writing basic Python is expected." },
          { title: "Familiarity with LLM APIs Helpful", description: "Prior exposure to LLM APIs or our Generative AI program helps, but isn't mandatory." },
          { title: "Any Educational Background", description: "Open to developers, students, and career switchers curious about AI automation." },
          { title: "Consistent Time Commitment", description: "8–10 hours a week for hands-on practice and project work." },
        ]}
      />

      <ChecklistGrid
        id="career"
        tone="muted"
        title="Career opportunities"
        items={[
          { title: "Agentic AI Engineer", description: "Design and build autonomous agent systems for real products." },
          { title: "AI Automation Engineer", description: "Automate business workflows using agent-based systems." },
          { title: "LLM Application Engineer", description: "Build applications that combine LLMs with tool use and orchestration." },
          { title: "AI Systems Developer", description: "Focus on the infrastructure and reliability of agentic applications." },
          { title: "Applied AI Researcher", description: "Explore and evaluate new agent architectures and patterns." },
          { title: "Freelance AI Automation Consultant", description: "Deliver custom agent-based automation for clients." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit"
            features={[
              { name: "Safety-conscious Curriculum", desc: "Guardrails and evaluation are taught alongside capability, not as an afterthought." },
              { name: "Placement Assistance", desc: "Resume reviews, mock interviews, and referrals to hiring partners." },
              { name: "Real Deployment Experience", desc: "Every agent project is deployed and demoed as a working system." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        tone="muted"
        faqs={agenticAiFaqs}
      />

      <DetailCTA
        heading="Ready to build agents that plan and act on their own?"
        description="Join the next batch and go from single prompts to deployed, autonomous multi-agent systems."
        ctaLabel="Enroll Now"
      />
    </div>
  );
}
