"use client";

import {
  Plug, Clock, Users, Layers, Headphones,
  Braces, Bot, Database, Gauge, Lock,
  Workflow, TrendingUp, FileSearch, Network, Zap, Search,
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
import { integrationFaqs } from "./faqs";

export default function AIIntegrationServicesContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="ai-automations"
        categoryLabel="AI & Automations"
        title="AI Integration Services"
        subtitle="Embed AI into your existing stack."
        description="Connect LLMs, vector stores, and AI APIs into your CRM, ERP, helpdesk, or custom application without rebuilding your architecture — we wire the intelligence in where it creates the most value."
        icon={Plug}
        image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Add AI where your system needs it — not where it's trendy"
        paragraphs={[
          "Most businesses don't need to replace their existing software to benefit from AI. What they need is AI capability wired into the systems they already run — a RAG-powered knowledge base inside their helpdesk, LLM-generated summaries in their CRM, or a classification model feeding their ERP. The value is in the integration, not the AI model on its own.",
          "We specialise in API-first AI integration — connecting LLMs, vector stores, and AI inference services into your existing applications through well-designed middleware. We choose the integration point that creates the most business value, design the data flow, and build the connections that make AI a native part of your workflow — without requiring your software vendors to natively support AI features.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "3–8 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Fixed Scope or Dedicated Team", icon: Users },
          { label: "Team Composition", value: "AI + Backend Integration Engineers", icon: Layers },
          { label: "Post-Launch", value: "Performance Monitoring & Optimisation", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="The integration gaps that keep businesses from extracting value from AI."
        items={[
          { title: "AI Pilots That Never Make It Into Real Software", description: "Proof-of-concept AI projects work in isolation but stall when it's time to connect them into actual business applications." },
          { title: "AI Vendors Without Native Integration Into Your Stack", description: "The AI tool you want to use doesn't natively connect to your CRM, ERP, or custom application — leaving a manual gap." },
          { title: "Hallucinating AI That Doesn't Know Your Business", description: "General-purpose LLMs give plausible but wrong answers because they don't have access to your actual data and documentation." },
          { title: "High LLM Costs from Unoptimised Prompting", description: "Naive LLM integrations send far more tokens than needed, inflating API costs without improving output quality." },
          { title: "AI Features That Require a Platform Replacement", description: "Being told you need to switch platforms to access AI features — when what you actually need is a well-designed integration layer." },
          { title: "Security Concerns About Sending Business Data to AI APIs", description: "Legitimate concerns about PII, proprietary data, and compliance when routing business content through external AI APIs." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we design and build AI integrations that work reliably in production."
        items={[
          { title: "Integration Point Selection First", description: "We identify exactly where in your existing workflow AI adds genuine value — not the technically simplest point, the most impactful one." },
          { title: "RAG for Business-Context Accuracy", description: "When accuracy on your specific business data matters, we build retrieval-augmented generation pipelines rather than relying on base model knowledge." },
          { title: "Prompt Engineering for Production", description: "We design prompt architectures for consistency, token efficiency, and predictable output formats — not just demonstrations." },
          { title: "Security-First Data Handling", description: "PII masking, data minimisation, and compliant API routing are core design requirements — not afterthoughts." },
          { title: "Cost Monitoring & Optimisation", description: "We instrument LLM API usage from the start and design prompts and caching strategies to control cost at scale." },
          { title: "Fallback & Error Handling Design", description: "AI APIs are external dependencies that can fail or return unexpected outputs. We design graceful fallbacks for every AI call." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key capabilities"
        items={[
          { title: "LLM API Integration", description: "Connect OpenAI, Anthropic, Google Gemini, or open-source models into your application through a managed API layer." },
          { title: "RAG Pipeline Construction", description: "Knowledge bases indexed with vector embeddings, retrieving relevant context for grounded, accurate AI responses." },
          { title: "Vector Database Setup & Management", description: "Design, deployment, and ongoing management of vector stores (Pinecone, Weaviate, pgvector) for your knowledge retrieval needs." },
          { title: "Semantic Search Integration", description: "Replace keyword search in your application with AI-powered semantic search that understands meaning and intent." },
          { title: "AI Summarisation & Classification", description: "Embed summarisation, categorisation, or classification capabilities into your existing content or support workflows." },
          { title: "Multi-Model Routing & Fallback", description: "Smart routing across multiple AI models — using cost-efficient models for simple tasks, powerful models for complex ones." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "LLM Integration Into Existing Applications", description: "Wire LLM capabilities (summarisation, generation, classification) into your existing web, mobile, or desktop application." },
          { title: "RAG Knowledge Base Build", description: "Index your documentation, policies, or product data into a vector store and build a retrieval pipeline for accurate, grounded responses." },
          { title: "CRM & Helpdesk AI Augmentation", description: "Add AI-generated summaries, suggested replies, and automated categorisation into Salesforce, Zendesk, Freshdesk, or custom CRMs." },
          { title: "Semantic Search Implementation", description: "Replace keyword search in any application with vector-powered semantic search that understands user intent." },
          { title: "AI API Gateway & Cost Control Layer", description: "A managed API layer handling routing, caching, rate limiting, cost monitoring, and fallback across multiple AI providers." },
          { title: "AI Integration Audit & Optimisation", description: "Assessment of an existing AI integration that's underperforming — identifying accuracy, cost, and reliability improvements." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "LLM APIs", category: "AI Providers", icon: Bot },
          { name: "Vector Databases", category: "Knowledge Store", icon: Database },
          { name: "RAG Frameworks", category: "Retrieval Pipeline", icon: Search },
          { name: "Python / Node.js", category: "Integration Layer", icon: Braces },
          { name: "REST & GraphQL", category: "API Connectivity", icon: Network },
          { name: "API Gateway", category: "Traffic Management", icon: Zap },
          { name: "Token Cost Monitoring", category: "Cost Control", icon: Gauge },
          { name: "PII Masking & Encryption", category: "Security", icon: Lock },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="From integration design to a monitored, cost-controlled AI capability in production."
        modules={[
          { title: "Integration Discovery", duration: "3–5 Days", topics: ["Use case definition", "Existing system API audit", "Data flow mapping", "Security & compliance review"] },
          { title: "Architecture Design", duration: "3–5 Days", topics: ["Integration point selection", "RAG pipeline design", "Prompt architecture", "Cost modelling"] },
          { title: "Integration Build", duration: "2–4 Weeks", topics: ["API connector development", "RAG pipeline construction", "Vector DB setup & indexing", "Prompt engineering"] },
          { title: "Testing & Accuracy Validation", duration: "1 Week", topics: ["Output accuracy testing", "Edge case handling", "Performance benchmarking", "Cost measurement"] },
          { title: "Production Deployment & Monitoring", duration: "3–5 Days", topics: ["Deployment to production", "Cost dashboard setup", "Alerting configuration", "Caching layer"] },
          { title: "Optimisation & Evolution", duration: "Ongoing", topics: ["Prompt refinement", "Cost optimisation", "Model upgrades", "Knowledge base updates"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="The layers of a well-designed AI integration system."
        layers={[
          { name: "Application Layer", description: "Your existing application — CRM, helpdesk, web app, mobile app — where the AI capability is surfaced to end users.", tech: "Your Existing Stack", icon: Layers },
          { name: "AI Integration Middleware", description: "The managed API layer that handles routing, authentication, prompt construction, and response parsing between your app and AI services.", tech: "API Gateway / Custom Middleware", icon: Plug },
          { name: "Knowledge Retrieval Layer", description: "RAG pipeline that retrieves relevant context from your indexed knowledge base before passing it to the LLM.", tech: "Vector DB + RAG Framework", icon: Search },
          { name: "AI Provider Layer", description: "The LLM or ML inference service called with the constructed prompt — OpenAI, Anthropic, Gemini, or a self-hosted model.", tech: "LLM API", icon: Bot },
          { name: "Observability Layer", description: "Token usage, latency, cost metrics, and error rates — tracked in real time to maintain quality and control spend.", tech: "Cost & Performance Monitoring", icon: Gauge },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The AI integrations we've built into existing business applications."
        projects={[
          { title: "Helpdesk RAG-Powered Knowledge Base", description: "A RAG integration surfacing relevant knowledge base articles to support agents inside Zendesk in real time — reducing average handling time by 28%.", skills: ["RAG Pipeline", "Zendesk Integration", "Vector DB"] },
          { title: "CRM AI Summary & Next-Action Engine", description: "LLM integration generating deal summaries and recommended next actions for sales reps inside Salesforce — from call notes and email threads.", skills: ["LLM API", "Salesforce Integration", "Prompt Engineering"] },
          { title: "Legal Document Semantic Search", description: "A semantic search layer over 40,000 historical contracts — replacing keyword search with intent-aware retrieval for a legal team's due diligence workflow.", skills: ["Vector Embeddings", "Semantic Search", "Document Pipeline"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "AI Value Without Platform Replacement", desc: "Add AI capabilities to systems your team already uses — with no vendor migration, no retraining, and no workflow disruption." },
              { name: "Accurate, Business-Grounded AI Output", desc: "RAG-powered integrations produce answers grounded in your actual data — not hallucinated responses from a general-purpose model." },
              { name: "Controlled Costs at Scale", desc: "Cost-optimised prompt design and API usage monitoring keep AI spend predictable as usage grows." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "API-First Integration Specialists", desc: "We know how to connect AI capabilities into any application through its APIs — without requiring changes to the underlying platform." },
              { name: "RAG Architecture Depth", desc: "Retrieval-augmented generation is a core competency — we build knowledge pipelines that are accurate, updateable, and cost-efficient." },
              { name: "Security-Conscious by Default", desc: "PII handling, data minimisation, and compliant API routing are core design requirements on every integration we build." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Fixed-Scope AI Integration", desc: "A specific AI capability integrated into a specific system, delivered at a clear price and timeline." },
              { name: "AI Integration Retainer", desc: "An ongoing team iterating on AI capabilities across multiple systems as your requirements evolve." },
              { name: "AI Integration Audit", desc: "Assessment of an existing AI integration — identifying accuracy, cost, and reliability improvements." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by AI integration scope."
        bands={[
          { scope: "Single Feature AI Integration", duration: "3–4 Weeks", fill: 30, description: "One AI capability — summarisation, classification, or semantic search — integrated into one system." },
          { scope: "Multi-Feature AI Integration", duration: "5–8 Weeks", fill: 65, description: "Multiple AI capabilities across one or two systems, with shared RAG knowledge infrastructure." },
          { scope: "Enterprise AI Integration Layer", duration: "8+ Weeks", fill: 100, description: "A managed AI integration middleware handling multiple systems with unified cost monitoring and governance." },
        ]}
      />

      <FAQAccordion faqs={integrationFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Conversational AI & Chatbots", description: "Build a full chatbot capability on top of the AI integration layer you deploy.", href: "/ai-automations/conversational-ai-chatbots", icon: Bot },
          { title: "Intelligent Process Automation", description: "Connect AI decisions from your integration layer to automated workflow execution.", href: "/ai-automations/intelligent-process-automation", icon: Workflow },
          { title: "Predictive AI Workflows", description: "Add ML model inference into your operational systems through the same integration architecture.", href: "/ai-automations/predictive-ai-workflows", icon: TrendingUp },
        ]}
      />

      <DetailCTA
        heading="Ready to wire AI into your existing applications?"
        description="Tell us about the system you want to augment with AI and we'll design an integration that adds genuine value without requiring a platform replacement."
        ctaLabel="Start a Conversation"
        checklist={["Free integration discovery session", "API-first, no platform replacement", "Cost-optimised from day one"]}
        category="ai-automations"
        subService="ai-integration-services"
      />
    </div>
  );
}
