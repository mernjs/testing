"use client";

import React from "react";
import { Sparkles, Video, PlayCircle } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  {
    title: "Social Media AI Reels Generator",
    subtitle: "Upload a photo. Get a scroll-stopping AI video in minutes.",
    description: "Turn a single image into a high-quality, voice-narrated short-form video for Instagram Reels, YouTube Shorts, and TikTok — using your real voice or a natural AI-generated one.",
    href: "/live-demos/social-media-ai-reels-generator",
    icon: Video,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop",
    highlights: ["AI Video Generation", "Voice Cloning", "Try It Live"],
  },
];

export default function LiveDemosContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="in-house innovation"
        title="Live Demos"
        description="Real, working AI projects we've built in-house — no screenshots, no sales pitch. Try them yourself, right now."
        icon={Sparkles}
        image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1400&auto=format&fit=crop"
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item, i) => (
              <ListingCard
                key={item.href}
                index={i}
                icon={item.icon}
                badge="Live Demo"
                badgeIcon={PlayCircle}
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
        heading="Have an idea for what we should build next?"
        description="These live demos are a sample of what our team can build. Tell us what you're trying to solve, and we'll show you what's possible."
      />
    </div>
  );
}
