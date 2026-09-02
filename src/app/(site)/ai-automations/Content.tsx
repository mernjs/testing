"use client";

import React from "react";
import { Workflow, MessageSquare, BarChart3, FileSearch, TrendingUp, Plug, Bot, BrainCircuit } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import FeaturedListingCard from "@/components/sections/FeaturedListingCard";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  {
    title: "Intelligent Process Automation",
    subtitle: "End-to-end workflow automation.",
    description: "Replace manual, rule-bound processes with AI-driven workflows that adapt to context, handle exceptions, and scale across your entire operation without adding headcount.",
    href: "/ai-automations/intelligent-process-automation",
    icon: Workflow,
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Event-Driven", "Exception Handling", "Enterprise-Grade"],
  },
  {
    title: "Conversational AI & Chatbots",
    subtitle: "24/7 intelligent customer engagement.",
    description: "Deploy LLM-powered assistants that understand intent, retrieve relevant knowledge, and take real actions — turning every conversation into a resolution, not just a reply.",
    href: "/ai-automations/conversational-ai-chatbots",
    icon: MessageSquare,
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Multi-Channel", "RAG-Powered", "Human Handoff"],
  },
  {
    title: "AI-Powered Data Analytics",
    subtitle: "Turn data into actionable intelligence.",
    description: "Go beyond dashboards. Our ML-driven analytics pipelines detect anomalies, surface trends, and generate plain-language insights so your team acts on data instead of just reviewing it.",
    href: "/ai-automations/ai-powered-data-analytics",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Real-Time", "Anomaly Detection", "NL Insights"],
  },
  {
    title: "Document Intelligence",
    subtitle: "Automate document reading and extraction.",
    description: "Feed invoices, contracts, forms, and reports into structured pipelines that extract, validate, and route data automatically — eliminating manual data entry at its root.",
    href: "/ai-automations/document-intelligence",
    icon: FileSearch,
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200&auto=format&fit=crop",
    highlights: ["OCR + NLP", "Multi-Format", "Validation Pipelines"],
  },
  {
    title: "Predictive AI Workflows",
    subtitle: "Act before problems surface.",
    description: "Embed predictive models directly into your operational triggers — automatically flagging at-risk accounts, forecasting resource needs, or pre-empting equipment failures before they happen.",
    href: "/ai-automations/predictive-ai-workflows",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Proactive Alerts", "ML-Driven", "Operational Triggers"],
  },
  {
    title: "AI Integration Services",
    subtitle: "Embed AI into your existing stack.",
    description: "Connect LLMs, vector stores, and AI APIs into your CRM, ERP, helpdesk, or custom application without rebuilding your architecture — we wire the intelligence in where it creates the most value.",
    href: "/ai-automations/ai-integration-services",
    icon: Plug,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop",
    highlights: ["API-First", "Zero Rearchitecting", "RAG & Vector DBs"],
  },
  {
    title: "Robotic Process Automation",
    subtitle: "Automate repetitive desktop and web tasks.",
    description: "When systems don't expose an API, we build software robots that interact with UIs, fill forms, scrape structured data, and carry out multi-step tasks across legacy and modern apps alike.",
    href: "/ai-automations/robotic-process-automation",
    icon: Bot,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    highlights: ["UI Automation", "Legacy-Ready", "Scheduled & Triggered"],
  },
];

const [featured, ...rest] = items;

export default function AIAutomationsContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="ai & automations"
        title="AI & Automations"
        description="Move beyond point-in-time AI experiments. We build production automation systems — intelligent workflows, document pipelines, predictive triggers, and AI-backed bots — that replace manual effort at scale and run reliably in your real business environment."
        icon={BrainCircuit}
        image="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1400&auto=format&fit=crop"
      />

      {/* Modern Listing Grid */}
      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mb-16 lg:mb-20">
            <FeaturedListingCard
              icon={featured.icon}
              badge="AI & Automations"
              badgeIcon={BrainCircuit}
              title={featured.title}
              subtitle={featured.subtitle}
              description={featured.description}
              highlights={featured.highlights}
              href={featured.href}
              image={featured.image}
            />
          </div>

          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">More Offerings</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rest.map((item, i) => (
              <ListingCard
                key={item.href}
                index={i}
                icon={item.icon}
                badge="AI & Automations"
                badgeIcon={BrainCircuit}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                highlights={item.highlights}
                href={item.href}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Not sure which automation fits your business?"
        description="Tell us about the process you want to automate and we'll design a solution around your existing systems, team, and scale — no generic templates."
        checklist={["Free discovery call", "System-agnostic approach", "Production-ready delivery"]}
      />
    </div>
  );
}
