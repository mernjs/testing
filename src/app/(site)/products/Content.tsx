"use client";

import React from "react";
import { Box, HardHat, ShieldAlert, Bot, TrendingUp, Camera, Briefcase } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  { title: "AI Construction Platform", subtitle: "AI-powered construction management, from documents to daily decisions.", description: "An AI-powered construction web app featuring subscriptions, an AI document analyzer, and a RAG-based AI chat that answers questions grounded in your own project files.", href: "/products/ai-construction-platform", icon: HardHat, image: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=1200&auto=format&fit=crop", highlights: ["AI Document Analyzer", "RAG AI Chat", "Subscriptions"] },
  { title: "Smart Spam Filter", subtitle: "Stop spam calls before they ever ring through.", description: "A progressive web app that smartly filters spam calls using dynamic spam scoring and intelligent routing logic, so real calls get through and the rest don't.", href: "/products/smart-spam-filter", icon: ShieldAlert, image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop", highlights: ["PWA", "Dynamic Spam Scoring", "Intelligent Routing"] },
  { title: "AI Voice Assistant", subtitle: "A human-like AI agent, one phone call away.", description: "A sports-focused hybrid app that lets fans call in and talk with a human-like AI voice agent, getting live updates and answers through natural conversation.", href: "/products/ai-voice-assistant", icon: Bot, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop", highlights: ["Voice AI", "Hybrid App", "Human-Like Agent"] },
  { title: "Predictive Analytics Engine", subtitle: "Know what's coming before it happens.", description: "A predictive analytics engine that forecasts orders, sales, and labor needs using machine learning, so planning is based on what's likely to happen next.", href: "/products/predictive-analytics-engine", icon: TrendingUp, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop", highlights: ["Machine Learning", "Demand Forecasting", "API-First"] },
  { title: "Image Recognition System", subtitle: "Serverless image intelligence, running across an entire device fleet.", description: "A serverless computer vision system that processes over a million images across 800+ devices, automatically detecting blank captures and alerting admins.", href: "/products/image-recognition-system", icon: Camera, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop", highlights: ["Computer Vision", "Serverless", "Fleet Monitoring"] },
  { title: "AI Job Board Portal", subtitle: "A full-featured job portal with hiring built in.", description: "A full-featured job portal with an integrated applicant tracking system, subscription-based employer plans, and OpenAI integrations for matching and screening.", href: "/products/ai-job-board-portal", icon: Briefcase, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop", highlights: ["Integrated ATS", "Job Board", "OpenAI Powered"] },
];

export default function ProductsContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="products portfolio"
        title="Our Products"
        description="Explore our proprietary software solutions and platforms designed to solve industry-specific challenges, automate workflows, and empower your workforce."
        icon={Box}
        image="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1400&auto=format&fit=crop"
      />

      {/* Modern Listing Grid */}
      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item, i) => (
              <ListingCard
                key={item.href}
                index={i}
                icon={item.icon}
                badge="Product"
                badgeIcon={Box}
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
        heading="Didn't find what you're looking for?"
        description="We specialize in custom enterprise solutions. Contact our technical team to discuss your specific requirements."
      />
    </div>
  );
}
