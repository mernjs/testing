"use client";

import {
  Bot, Clock, Users, Layers, Headphones,
  Braces, Workflow, Puzzle, Database, Network, Gauge, Lock,
  Cpu, LineChart, Globe,
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
import { aiAgentFaqs } from "./faqs";

export default function AIAgentContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="services"
        categoryLabel="services"
        title="AI Agent"
        subtitle="Autonomous assistants for your enterprise."
        description="Deploy intelligent, autonomous AI agents that can handle customer support, automate internal workflows, and act as 24/7 digital employees."
        icon={Bot}
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Digital employees that actually get work done"
        paragraphs={[
          "Most \"AI chatbots\" just answer questions. An AI agent we build takes action — looking up an order, updating a record, triggering a workflow — inside the systems your business already runs on, not a sandbox demo.",
          "We design agents around a specific job to be done: a support queue to triage, an internal process to automate, a workflow that currently eats hours of manual work every week — with the guardrails and oversight a business-critical system actually needs.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "4–7 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "AI Engineers + Integration Specialists", icon: Layers },
          { label: "Support", value: "Monitoring & Guardrail Tuning", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="What pushes a business toward wanting an agent in the first place."
        items={[
          { title: "Support Queues That Never Shrink", description: "Ticket volume grows faster than headcount, and most tickets are repetitive questions a human shouldn't need to answer manually." },
          { title: "Manual, Repetitive Internal Workflows", description: "Teams spend hours a week on approvals, data entry, and status updates that follow a predictable pattern." },
          { title: "Chatbots That Can't Actually Do Anything", description: "Many existing \"AI\" tools can only answer FAQs, not take real actions in your systems." },
          { title: "Fragmented Systems That Don't Talk to Each Other", description: "The data an agent needs often lives across a CRM, a helpdesk, and an internal database." },
          { title: "Fear of Autonomous Mistakes", description: "Business leaders are, rightly, cautious about giving an AI system the ability to take action without oversight." },
          { title: "Agents That Work in Demos, Not Production", description: "A lot of agent projects stall because they were never built with real error handling or monitoring." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we build agents that survive contact with real production traffic."
        items={[
          { title: "Start From One Well-defined Job", description: "We scope the agent around a specific, measurable task instead of a vague \"automate everything\" goal." },
          { title: "Tool & Function Calling Into Real Systems", description: "Agents get structured, permissioned access to your CRM, helpdesk, or internal APIs." },
          { title: "Guardrails by Design", description: "Confidence thresholds, human-in-the-loop checkpoints, and defined action boundaries built in from day one." },
          { title: "Memory Tuned to the Task", description: "The right amount of context retention for the job, no more, no less." },
          { title: "Shadow Mode Before Full Autonomy", description: "Agents run alongside your team first, building trust before taking unsupervised action." },
          { title: "Built for Production Monitoring", description: "Logging, tracing, and cost tracking treated as core requirements, not afterthoughts." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        items={[
          { title: "Multi-step Task Execution", description: "Agents that break a request into steps and carry it through to completion, not just a single reply." },
          { title: "System & API Integrations", description: "Direct, secure connections into the tools your team already uses daily." },
          { title: "Human Handoff & Escalation", description: "A clear path to a human whenever the agent hits its confidence or authority limits." },
          { title: "Full Action Audit Trail", description: "Every action an agent takes is logged and reviewable after the fact." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Customer Support Agents", description: "Agents that resolve common tickets end-to-end and escalate the rest with full context." },
          { title: "Internal Operations Agents", description: "Agents that handle approvals, data entry, and status updates across internal tools." },
          { title: "Sales & Lead Qualification Agents", description: "Agents that qualify and route inbound leads before a rep ever picks up the phone." },
          { title: "Multi-agent Workflow Systems", description: "Coordinated agents handling different parts of a larger, multi-step business process." },
          { title: "Agent Integration & Retrofitting", description: "Adding agent capabilities to an existing chatbot or support system you already have." },
          { title: "Ongoing Agent Tuning & Support", description: "Continued monitoring, prompt refinement, and guardrail adjustment after launch." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "LLM APIs", category: "Reasoning Engine", icon: Bot },
          { name: "Agent Frameworks", category: "Orchestration", icon: Workflow },
          { name: "Function Calling", category: "Tool Use", icon: Puzzle },
          { name: "Vector Memory Stores", category: "Context", icon: Database },
          { name: "Integration APIs", category: "CRM / ERP", icon: Network },
          { name: "Tracing & Monitoring", category: "Observability", icon: Gauge },
          { name: "Guardrail Middleware", category: "Safety", icon: Lock },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we take an agent from a scoped idea to a monitored, production system."
        modules={[
          { title: "Discovery & Task Scoping", duration: "3–5 Days", topics: ["Workflow mapping", "Success metrics", "System access review", "Risk assessment"] },
          { title: "Agent Design", duration: "1 Week", topics: ["Planning logic design", "Tool/API selection", "Guardrail definition", "Memory design"] },
          { title: "Core Build", duration: "2–3 Weeks", topics: ["Agent development", "System integrations", "Escalation logic", "Logging setup"] },
          { title: "Shadow Mode Testing", duration: "1 Week", topics: ["Parallel-run testing", "Accuracy validation", "Edge case handling", "Stakeholder review"] },
          { title: "Controlled Rollout", duration: "3–5 Days", topics: ["Phased autonomy increase", "Monitoring dashboards", "Team training"] },
          { title: "Monitoring & Tuning", duration: "Ongoing", topics: ["Performance monitoring", "Prompt refinement", "Guardrail adjustment", "Cost optimization"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A typical layered architecture for the AI agents we build."
        layers={[
          { name: "Reasoning Layer", description: "The LLM-driven core that interprets requests and plans the steps needed to complete a task.", tech: "LLM APIs", icon: Bot },
          { name: "Tool & Integration Layer", description: "Structured, permissioned functions that let the agent act on real systems like your CRM or helpdesk.", tech: "Function Calling / APIs", icon: Puzzle },
          { name: "Memory Layer", description: "Context storage that gives the agent just enough history to act coherently across a conversation or task.", tech: "Vector Store", icon: Database },
          { name: "Oversight Layer", description: "Guardrails, confidence thresholds, and human escalation paths that keep autonomy within safe, defined limits.", tech: "Guardrail Middleware", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation capabilities"
        description="What makes an agent meaningfully different from a scripted bot."
        items={[
          { title: "Autonomous Task Completion", description: "Agents that carry a request through multiple steps to a real outcome, not just an answer." },
          { title: "Multi-agent Coordination", description: "Specialized agents that hand off parts of a larger workflow to each other." },
          { title: "Continuous Self-improvement", description: "Agents that learn from escalations and corrections to reduce future handoffs." },
          { title: "Proactive Automation", description: "Agents that trigger actions based on events, not just respond to direct requests." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of agents we build across support, operations, and sales."
        projects={[
          { title: "Tier-1 Support Resolution Agent", description: "An agent resolving order status, returns, and account questions end-to-end for an e-commerce support team.", skills: ["LLM APIs", "Helpdesk Integration", "Escalation"] },
          { title: "Internal Approvals Agent", description: "An agent routing and pre-validating expense and purchase approvals across departments.", skills: ["Workflow Automation", "ERP Integration", "Guardrails"] },
          { title: "Sales Lead Qualification Agent", description: "An agent that qualifies inbound leads against defined criteria and books qualified calls automatically.", skills: ["CRM Integration", "Lead Scoring", "Scheduling"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Lower Cost Per Resolved Ticket", desc: "Repetitive requests get resolved without adding headcount." },
              { name: "Faster Response Times, Any Hour", desc: "Agents don't clock out, so response times improve outside business hours too." },
              { name: "Freed-up Team Capacity", desc: "Your team spends time on judgment calls and relationships, not repetitive tasks." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Production-first Agent Engineering", desc: "We build for monitoring, cost, and failure handling from day one, not just a working demo." },
              { name: "Integration Depth", desc: "We've connected agents into a wide range of CRMs, helpdesks, and internal systems, not just chat widgets." },
              { name: "Safety-conscious by Default", desc: "Guardrails and human escalation paths are standard, not an optional add-on." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Dedicated Team", desc: "A committed AI engineering team for an evolving agent roadmap." },
              { name: "Fixed Scope Project", desc: "A defined agent, integrations, and timeline delivered at a clear price." },
              { name: "Staff Augmentation", desc: "Embed our AI engineers into your existing team for specific agent-building expertise." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by project scope, so you can plan around a realistic rollout."
        bands={[
          { scope: "Single-workflow Agent", duration: "3–4 Weeks", fill: 35, description: "One agent automating a clearly defined task or workflow." },
          { scope: "Multi-workflow Agent System", duration: "5–8 Weeks", fill: 70, description: "Several coordinated agents covering a broader set of business processes." },
          { scope: "Enterprise Agent Platform", duration: "8+ Weeks", fill: 100, description: "An organization-wide agent platform with shared infrastructure, monitoring, and governance." },
        ]}
      />

      <FAQAccordion
        faqs={aiAgentFaqs}
      />

      <RelatedServices
        tone="muted"
        services={[
          { title: "AI/ML Solutions", description: "Add custom prediction and recommendation models to power your agents.", href: "/services/ai-ml-solutions", icon: Cpu },
          { title: "Prediction & Forecasting", description: "Give your agents forecasts to act on, not just historical data.", href: "/services/prediction-and-forecasting", icon: LineChart },
          { title: "Web App Development", description: "Pair your agent with a dashboard for oversight and reporting.", href: "/services/web-app-development", icon: Globe },
        ]}
      />

      <DetailCTA
        heading="Ready to put an AI agent to work in your business?"
        description="Let's talk about the workflow you want to automate and how we can build an agent that actually gets it done."
        ctaLabel="Get a Quote"
        category="software-development"
        subService="ai-agent"
      />
    </div>
  );
}
