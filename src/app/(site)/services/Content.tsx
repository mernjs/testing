"use client";

import React from "react";
import { Layers, Globe, Smartphone, Monitor, LineChart, Bot, Cpu, Eye, Glasses } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  { title: "Web App Development", subtitle: "Scalable platforms for the modern web.", description: "We engineer lightning-fast, highly secure web applications using React, Next.js, and modern cloud architectures that provide seamless experiences across all devices.", href: "/services/web-app-development", icon: Globe, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop", highlights: ["Cloud Native", "SEO Optimized", "Enterprise Ready"] },
  { title: "Mobile App Development", subtitle: "Native and cross-platform mobile solutions.", description: "Reach your audience wherever they are. We build intuitive, high-performance mobile apps for iOS and Android that users love to engage with.", href: "/services/mobile-app-development", icon: Smartphone, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop", highlights: ["iOS & Android", "Offline-First", "App Store Ready"] },
  { title: "Desktop App Development", subtitle: "Powerful applications for macOS and Windows.", description: "When web browsers aren't enough, we build robust desktop software using frameworks like Electron and Tauri to deliver raw performance and deep system access.", href: "/services/desktop-app-development", icon: Monitor, image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1200&auto=format&fit=crop", highlights: ["Cross-Platform", "Auto-Updating", "Native Performance"] },
  { title: "Prediction & Forecasting", subtitle: "Data-driven foresight for your business.", description: "Stop guessing and start knowing. Our predictive analytics solutions use historical data and advanced algorithms to forecast trends, demand, and user behavior.", href: "/services/prediction-and-forecasting", icon: LineChart, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop", highlights: ["Data-Driven", "AI Powered", "Real-Time Insights"] },
  { title: "AI Agent", subtitle: "Autonomous assistants for your enterprise.", description: "Deploy intelligent, autonomous AI agents that can handle customer support, automate internal workflows, and act as 24/7 digital employees.", href: "/services/ai-agent", icon: Bot, image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop", highlights: ["24/7 Automation", "AI Powered", "Workflow Integration"] },
  { title: "AI/ML Solutions", subtitle: "Custom machine learning architecture.", description: "We design, train, and deploy bespoke machine learning models that solve highly specific problems—from natural language processing to complex recommendation engines.", href: "/services/ai-ml-solutions", icon: Cpu, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop", highlights: ["Custom Models", "AI Powered", "Production-Grade"] },
  { title: "Vision Intelligence", subtitle: "Advanced image and video analysis.", description: "Give your software the ability to see. Our computer vision solutions can identify objects, track movement, and analyze visual data in real-time.", href: "/services/vision-intelligence", icon: Eye, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop", highlights: ["Real-Time Detection", "Edge Deployment", "AI Powered"] },
  { title: "AR/VR", subtitle: "Immersive virtual experiences.", description: "Transport your users to new worlds. We build augmented and virtual reality applications for training simulations, virtual showrooms, and interactive marketing.", href: "/services/ar-vr", icon: Glasses, image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1200&auto=format&fit=crop", highlights: ["Immersive UX", "Cross-Platform", "Interactive 3D"] },
];

export default function ServicesContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="services portfolio"
        title="Our Services"
        description="From custom web and mobile applications to AI integrations built where they genuinely create value — not just where it's trendy — explore the services we offer to accelerate your digital growth."
        icon={Layers}
        image="https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1400&auto=format&fit=crop"
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
                badge="Service"
                badgeIcon={Layers}
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
