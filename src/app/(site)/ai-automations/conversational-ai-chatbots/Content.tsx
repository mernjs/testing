"use client";

import {
  MessageSquare, Clock, Users, Layers, Headphones,
  Braces, Bot, Database, Network, Gauge, Lock, Globe,
  Workflow, TrendingUp, Plug, Mic, Search,
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
import { chatbotFaqs } from "./faqs";

export default function ConversationalAIChatbotsContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="ai-automations"
        categoryLabel="AI & Automations"
        title="Conversational AI & Chatbots"
        subtitle="24/7 intelligent customer engagement."
        description="Deploy LLM-powered assistants that understand intent, retrieve relevant knowledge, and take real actions — turning every conversation into a resolution, not just a reply."
        icon={MessageSquare}
        image="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Chatbots that resolve — not just respond"
        paragraphs={[
          "Most chatbots are FAQ databases with a chat interface. The conversational AI systems we build actually understand what a user is trying to accomplish — and have the capability to complete it. That means looking up an order, updating account details, checking policy coverage, or booking an appointment, without transferring to a human.",
          "We build on top of production-ready LLM foundations with retrieval-augmented generation (RAG) for accurate, grounded answers, tool-use for real system actions, and multi-turn memory for contextually coherent conversations — across chat, voice, and messaging channels your customers already use.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "4–8 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Fixed Scope or Dedicated Team", icon: Users },
          { label: "Team Composition", value: "AI Engineers + Conversation Designers", icon: Layers },
          { label: "Post-Launch", value: "Intent Analytics & Continuous Tuning", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="The scenarios that make conversational AI worth building."
        items={[
          { title: "Support Queues Dominated by Repetitive Queries", description: "Order status, account questions, policy lookups — queries a human shouldn't need to handle manually at scale." },
          { title: "Chatbots That Can't Take Action", description: "Many deployed bots can only answer questions but can't update a record, trigger a refund, or book an appointment." },
          { title: "Knowledge Bases That Go Stale", description: "Rule-based FAQ bots require constant manual updates as policies, products, and processes change." },
          { title: "Poor Handoff to Human Agents", description: "When a bot fails, it often drops the user with no context — forcing them to repeat everything to a human agent." },
          { title: "Siloed Channels with Inconsistent Experience", description: "Customers expect the same quality of response whether they use website chat, WhatsApp, or a mobile app." },
          { title: "Low Deflection Rates Despite Automation Investment", description: "Existing bot implementations don't actually reduce human support load because they can't resolve issues end-to-end." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we build chatbots that actually resolve, not just respond."
        items={[
          { title: "Intent Mapping Before Any Prompt Engineering", description: "We map every category of user request, the systems needed to resolve each, and the edge cases that require human escalation." },
          { title: "RAG for Accurate, Grounded Answers", description: "Knowledge retrieval is scoped to your actual documents and data — not the LLM's training data — so answers are accurate and verifiable." },
          { title: "Tool-Use for System Actions", description: "The bot can look up, create, update, and trigger real actions in your backend systems through secure, permissioned API calls." },
          { title: "Graceful Human Handoff", description: "When the bot escalates, it transfers the full conversation context so the agent picks up where the bot left off." },
          { title: "Multi-Channel Native Design", description: "We build for the channels your customers use — web, WhatsApp, mobile in-app, or voice — with consistent behaviour across all." },
          { title: "Continuous Improvement from Analytics", description: "Conversation analytics surface where users drop off, escalate, or express frustration — feeding ongoing intent refinement." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key capabilities"
        items={[
          { title: "RAG-Powered Knowledge Retrieval", description: "Answers grounded in your actual documentation, policies, and product data — not hallucinated responses." },
          { title: "Tool Calling & System Actions", description: "The bot performs real operations in connected systems with defined permission boundaries." },
          { title: "Multi-Turn Contextual Memory", description: "Maintains conversation context across a session so users don't repeat themselves." },
          { title: "Intelligent Escalation & Handoff", description: "Routes to human agents with full transcript and context when confidence or authority limits are reached." },
          { title: "Multi-Channel Deployment", description: "Single bot logic deployed consistently across web, mobile, WhatsApp, and voice channels." },
          { title: "Conversation Analytics Dashboard", description: "Intent distribution, resolution rates, escalation patterns, and CSAT trends tracked in real time." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Customer Support Chatbot", description: "An LLM-backed bot that resolves common support queries end-to-end and escalates the rest with context." },
          { title: "Internal HR & IT Helpdesk Bot", description: "Answers employee questions about policies, benefits, IT issues, and access requests — reducing internal ticket volume." },
          { title: "E-Commerce Order & Returns Bot", description: "Handles order tracking, return initiation, and refund status across any e-commerce platform." },
          { title: "Sales & Lead Qualification Bot", description: "Engages inbound leads, qualifies them against defined criteria, and books calls with the sales team automatically." },
          { title: "Voice Bot & IVR Replacement", description: "Conversational voice AI that replaces legacy IVR menus with natural-language call handling." },
          { title: "Bot Audit & Re-Engineering", description: "Assessment and rebuild of an existing chatbot that isn't performing — improving resolution rates without starting from scratch." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "LLM APIs", category: "Reasoning Engine", icon: Bot },
          { name: "RAG Pipelines", category: "Knowledge Retrieval", icon: Search },
          { name: "Vector Databases", category: "Knowledge Store", icon: Database },
          { name: "Function / Tool Calling", category: "System Actions", icon: Plug },
          { name: "Voice & ASR APIs", category: "Voice Channel", icon: Mic },
          { name: "Omnichannel Middleware", category: "Channel Routing", icon: Globe },
          { name: "Conversation Analytics", category: "Observability", icon: Gauge },
          { name: "RBAC & Data Masking", category: "Security", icon: Lock },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we design, build, and launch a conversational AI system."
        modules={[
          { title: "Intent & Scope Discovery", duration: "3–5 Days", topics: ["Intent mapping", "Query volume analysis", "System access review", "Escalation path design"] },
          { title: "Knowledge Base Setup", duration: "1 Week", topics: ["Document ingestion", "Chunking & embedding", "RAG pipeline setup", "Answer accuracy testing"] },
          { title: "Bot Build & Tool Integration", duration: "2–3 Weeks", topics: ["Conversation flow design", "System API connections", "Tool-calling setup", "Multi-turn memory"] },
          { title: "Channel Deployment", duration: "1 Week", topics: ["Web widget integration", "WhatsApp / mobile setup", "Voice channel (if applicable)", "Escalation routing"] },
          { title: "UAT & Accuracy Tuning", duration: "1 Week", topics: ["Intent accuracy testing", "Edge case handling", "Escalation validation", "Stakeholder sign-off"] },
          { title: "Launch & Analytics", duration: "Ongoing", topics: ["Live monitoring", "Resolution rate tracking", "Intent gap analysis", "Continuous prompt refinement"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A layered architecture for the conversational AI systems we build."
        layers={[
          { name: "Channel Layer", description: "The interface through which users interact — web chat, WhatsApp, mobile in-app, or voice.", tech: "Omnichannel Middleware", icon: Globe },
          { name: "Reasoning Layer", description: "The LLM that interprets user intent, generates responses, and decides which tools or knowledge to invoke.", tech: "LLM API", icon: Bot },
          { name: "Knowledge Layer", description: "Vector-indexed documentation and policy data retrieved via RAG to ground answers in your actual content.", tech: "Vector DB + RAG Pipeline", icon: Database },
          { name: "Action Layer", description: "Tool-calling functions that let the bot perform real operations in your backend systems.", tech: "API Integrations", icon: Plug },
          { name: "Oversight Layer", description: "Confidence thresholds, human escalation routing, and conversation analytics for continuous improvement.", tech: "Analytics + Monitoring", icon: Gauge },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of conversational AI systems we've built across support, sales, and operations."
        projects={[
          { title: "E-Commerce Support Bot", description: "An LLM-backed bot handling order tracking, returns, and account queries for a fashion retailer — resolving 68% of contacts without human involvement.", skills: ["RAG", "Order API", "WhatsApp"] },
          { title: "HR Policy Helpdesk Bot", description: "An internal bot answering HR, payroll, and IT policy questions for a 1,200-person organisation — reducing HR ticket volume by 40%.", skills: ["Document RAG", "Slack Integration", "Policy Grounding"] },
          { title: "Insurance Lead Qualification Bot", description: "A conversational AI qualifying inbound leads against coverage eligibility criteria and booking advisor calls — increasing qualified call volume by 35%.", skills: ["Intent Classification", "CRM Integration", "Calendar Booking"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Higher Resolution Rate, Lower Ticket Volume", desc: "Bots that actually complete tasks reduce the volume of work reaching human agents." },
              { name: "Consistent Experience at Any Scale", desc: "Handles 10 or 10,000 simultaneous conversations with the same quality — with no wait times." },
              { name: "Insight Into What Customers Are Actually Asking", desc: "Conversation analytics reveal intent patterns that inform product, policy, and support decisions." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Action-Capable Bot Engineering", desc: "We build bots that do things, not just answer questions — with real system integrations and tool-calling from day one." },
              { name: "RAG Specialists", desc: "Retrieval-augmented generation is a core competency — we know how to build knowledge pipelines that are accurate and maintainable." },
              { name: "Conversation Design Expertise", desc: "We pair engineering with conversation design — because a technically correct bot that feels robotic still frustrates users." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Fixed-Scope Bot Build", desc: "A defined bot, for a defined use case, delivered at a clear price and timeline." },
              { name: "Dedicated AI Team", desc: "An ongoing team for a multi-channel, multi-intent conversational AI roadmap." },
              { name: "Bot Audit & Improvement", desc: "Assessment and re-engineering of an existing low-performing bot to improve resolution rates." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by bot scope."
        bands={[
          { scope: "Single-Channel FAQ + Action Bot", duration: "4–5 Weeks", fill: 35, description: "A focused bot resolving a defined set of intents on one channel." },
          { scope: "Multi-Intent Support Bot", duration: "6–9 Weeks", fill: 65, description: "Broader intent coverage with multiple system integrations and escalation paths." },
          { scope: "Omnichannel + Voice Bot Platform", duration: "10+ Weeks", fill: 100, description: "Full multi-channel deployment with voice, analytics, and ongoing optimisation." },
        ]}
      />

      <FAQAccordion faqs={chatbotFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Intelligent Process Automation", description: "Trigger backend workflows from bot conversations automatically.", href: "/ai-automations/intelligent-process-automation", icon: Workflow },
          { title: "AI Integration Services", description: "Connect your bot to any system in your existing stack.", href: "/ai-automations/ai-integration-services", icon: Plug },
          { title: "Document Intelligence", description: "Let your bot read and extract from documents users send it.", href: "/ai-automations/document-intelligence", icon: Search },
        ]}
      />

      <DetailCTA
        heading="Ready to build a chatbot that actually resolves?"
        description="Tell us about your most common customer or employee queries, and we'll design a conversational AI system that handles them end-to-end."
        ctaLabel="Start a Conversation"
        checklist={["Free intent discovery session", "Omnichannel from day one", "Production-ready RAG pipelines"]}
        category="ai-automations"
        subService="conversational-ai-chatbots"
      />
    </div>
  );
}
