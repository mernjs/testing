"use client";

import React from "react";
import { Layers, Code2, GraduationCap, UserPlus, Briefcase, BrainCircuit } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import FeaturedListingCard from "@/components/sections/FeaturedListingCard";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  {
    title: "Software Development",
    subtitle: "Custom web, mobile, desktop & cloud platforms.",
    description: "We design, build, and ship production-grade custom software — from web platforms and cross-platform mobile apps to desktop software and custom cloud solutions built for massive scale.",
    href: "/software-development",
    icon: Code2,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Web & Mobile Apps", "Desktop & Cloud", "Enterprise Ready"],
  },
  {
    title: "Industrial Training",
    subtitle: "Mentor-led, project-based developer training.",
    description: "Practical training programs built around live projects, real tooling, and internship exposure — taking candidates from fundamentals to job-ready in weeks.",
    href: "/industrial-training",
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
    highlights: ["MERN & MEAN Stack", "Generative & Agentic AI", "Job Assistance"],
  },
  {
    title: "Resource Augmentation",
    subtitle: "Flexible developer & dedicated team hiring.",
    description: "Scale your engineering team instantly. Hire vetted individual developers or complete pre-built teams on flexible hourly, project, or retainer engagement models.",
    href: "/resource-augmentation",
    icon: UserPlus,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Pre-Vetted Talent", "Fast Onboarding", "Flexible Engagement"],
  },
  {
    title: "Internship Program",
    subtitle: "Paid internships working on real client codebases.",
    description: "Work on real feature tickets alongside senior engineering mentors in MERN, MEAN, AI, and Computer Vision development tracks — preparing you for real tech careers.",
    href: "/internship-program",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Live Codebases", "Senior Mentorship", "Career Pathway"],
  },
  {
    title: "AI & Automations",
    subtitle: "Workflows, chatbots, document pipelines & RPA.",
    description: "Deploy production-grade intelligent process automation, RAG chatbots, predictive triggers, document extraction pipelines, and UI software robots.",
    href: "/ai-automations",
    icon: BrainCircuit,
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Process Automation", "RAG & Chatbots", "RPA & Document AI"],
  },
];

const [featured, ...rest] = items;

export default function ServicesContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="our services portfolio"
        title="Our Services"
        description="Explore YashOrbit's five specialized service pillars — engineered to deliver custom software, enterprise AI & automations, industry-ready training, talent augmentation, and real-world internships."
        icon={Layers}
        image="https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1400&auto=format&fit=crop"
      />

      {/* Modern Listing Grid */}
      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mb-16 lg:mb-20">
            <FeaturedListingCard
              icon={featured.icon}
              badge="Services Pillar"
              badgeIcon={Layers}
              title={featured.title}
              subtitle={featured.subtitle}
              description={featured.description}
              highlights={featured.highlights}
              href={featured.href}
              image={featured.image}
              ctaLabel="Explore Software Development"
            />
          </div>

          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">More Service Pillars</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {rest.map((item, i) => (
              <ListingCard
                key={item.href}
                index={i}
                icon={item.icon}
                badge="Service Pillar"
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
        heading="Looking for custom enterprise solutions?"
        description="Whether you need software development, AI automations, training, or staff augmentation, our technical team is ready to deliver."
        checklist={["5 Specialized Divisions", "Agile & Transparent", "100% Code Ownership"]}
      />
    </div>
  );
}
