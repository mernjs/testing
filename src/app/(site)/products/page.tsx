"use client";

import React from "react";
import { Box, MessageSquare, Scale, Lightbulb, UserCog, FolderSearch, Activity, Globe2, Gamepad2 } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  { title: "ConvoCraft", subtitle: "The next-generation conversational AI platform.", description: "Build, deploy, and manage highly intelligent chatbots and voice assistants without writing a single line of code. ConvoCraft makes AI accessible to everyone.", href: "/products/convocraft", icon: MessageSquare, image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=1200&auto=format&fit=crop", highlights: ["No-Code Builder", "AI Powered", "Voice & Chat"] },
  { title: "Legal Tech", subtitle: "Streamlining modern legal workflows.", description: "A comprehensive suite of tools designed specifically for law firms. Automate document generation, track case progress, and ensure absolute compliance.", href: "/products/legal-tech", icon: Scale, image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop", highlights: ["Document Automation", "Compliance Ready", "Case Tracking"] },
  { title: "Illumate", subtitle: "Intelligent illumination controls.", description: "The ultimate IoT platform for smart lighting. Illumate provides granular control, scheduling, and energy optimization for commercial and residential properties.", href: "/products/illumate", icon: Lightbulb, image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop", highlights: ["IoT Enabled", "Energy Optimization", "Smart Scheduling"] },
  { title: "AI HR Assistant", subtitle: "Automate your human resources.", description: "Revolutionize your HR department. This AI-powered tool handles initial candidate screening, employee onboarding, and routine HR queries automatically.", href: "/products/ai-hr-assistant", icon: UserCog, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop", highlights: ["AI Powered", "Automated Screening", "24/7 Support"] },
  { title: "AI Powered Smart DMS", subtitle: "Intelligent document management.", description: "Never lose a file again. Our Smart DMS uses optical character recognition (OCR) and natural language processing to categorize, tag, and search your entire company archives.", href: "/products/ai-powered-smart-dms", icon: FolderSearch, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop", highlights: ["OCR Search", "AI Powered", "Enterprise Ready"] },
  { title: "DataPulse AI", subtitle: "Real-time business intelligence.", description: "A centralized dashboard that connects to all your data sources, providing real-time visualizations and AI-generated insights into your business health.", href: "/products/datapulse-ai", icon: Activity, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop", highlights: ["Real-Time Insights", "AI Powered", "Unified Dashboard"] },
];

export default function ProductsPage() {
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
