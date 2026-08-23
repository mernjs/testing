"use client";

import { GraduationCap, Code2, Database, Sparkles, Bot, MessageSquare, ScanEye } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  { title: "MERN Stack", subtitle: "Full-stack JavaScript development.", description: "Build production-grade web applications end to end with MongoDB, Express, React, and Node.js — the same stack powering modern startups.", href: "/industrial-training/mern-stack", icon: Code2, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop", highlights: ["12 Weeks", "Live Projects", "Job Assistance"] },
  { title: "MEAN Stack", subtitle: "Enterprise-grade JavaScript apps.", description: "Master MongoDB, Express, Angular, and Node.js to build structured, scalable single-page applications used in enterprise software.", href: "/industrial-training/mean-stack", icon: Database, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop", highlights: ["12 Weeks", "Enterprise-Grade", "Live Projects"] },
  { title: "Generative AI", subtitle: "Build with large language models.", description: "Learn prompt engineering, fine-tuning, and retrieval-augmented generation to build real products on top of modern LLMs.", href: "/industrial-training/generative-ai", icon: Sparkles, image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop", highlights: ["10 Weeks", "LLM APIs", "RAG Pipelines"] },
  { title: "Agentic AI", subtitle: "Design autonomous AI systems.", description: "Go beyond chatbots — build goal-driven AI agents that plan, call tools, and coordinate with each other to complete complex tasks.", href: "/industrial-training/agentic-ai", icon: Bot, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop", highlights: ["10 Weeks", "Tool-Using Agents", "Live Projects"] },
  { title: "Conversational AI", subtitle: "Chatbots and voice assistants.", description: "Design and deploy natural, task-oriented conversational experiences across chat and voice channels for real businesses.", href: "/industrial-training/conversational-ai", icon: MessageSquare, image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop", highlights: ["10 Weeks", "NLU & Voice", "Live Projects"] },
  { title: "Computer Vision", subtitle: "Teach machines to see.", description: "Work with image classification, object detection, and video analytics using OpenCV and modern deep learning frameworks.", href: "/industrial-training/computer-vision", icon: ScanEye, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop", highlights: ["10 Weeks", "OpenCV & CNNs", "Edge Deployment"] },
];

export default function IndustrialTrainingContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">

      <ListingHero
        eyebrow="training"
        title="Become Industry-Ready"
        description="Practical, mentor-led training programs built around live projects, real tooling, and internship exposure — designed to take you from fundamentals to job-ready in weeks, not years."
        icon={GraduationCap}
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((item, i) => (
              <ListingCard
                key={item.href}
                index={i}
                icon={item.icon}
                badge="Training"
                badgeIcon={GraduationCap}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                highlights={item.highlights}
                href={item.href}
                image={item.image}
                ctaLabel="Learn More"
              />
            ))}
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Not sure which program fits you?"
        description="Talk to our training team and we'll help you pick the right track based on your background and career goals."
        ctaLabel="Enroll Now"
      />
    </div>
  );
}
