"use client";

import type { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import DetailCTA from "@/components/sections/DetailCTA";

import DefaultAvatar from "@/components/ui/DefaultAvatar";

interface ChecklistItem {
  title: string;
  description: ReactNode;
}

interface AchievementItem {
  title: ReactNode;
  description: string;
  skills: string[];
}

interface StatItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface ExecutiveProfileProps {
  name: string;
  role: string;
  tagline: ReactNode;
  heroDescription: ReactNode;
  heroIcon: LucideIcon;
  photo?: string;
  gender?: "male" | "female";
  bioParagraphs: ReactNode[];
  bioStats: StatItem[];
  overviewTitle: string;
  overviewDescription?: ReactNode;
  overviewItems: ChecklistItem[];
  expertiseItems: ChecklistItem[];
  responsibilityItems: ChecklistItem[];
  achievementsDescription?: ReactNode;
  achievements: AchievementItem[];
  visionStatement: ReactNode;
  visionQuote: string;
  ctaHeading: string;
  ctaDescription: string;
}

export default function ExecutiveProfile({
  name,
  role,
  tagline,
  heroDescription,
  heroIcon,
  photo,
  gender = "female",
  bioParagraphs,
  bioStats,
  overviewTitle,
  overviewDescription,
  overviewItems,
  expertiseItems,
  responsibilityItems,
  achievementsDescription,
  achievements,
  visionStatement,
  visionQuote,
  ctaHeading,
  ctaDescription,
}: ExecutiveProfileProps) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title={name}
        subtitle={tagline}
        description={heroDescription}
        icon={heroIcon}
        image={photo ?? "/images/placeholders/leadership-hero-placeholder.png"}
      />

      <section className="py-16 sm:py-20 bg-background relative">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full ring-4 ring-primary/25 shadow-xl mb-6 overflow-hidden">
            <DefaultAvatar gender={gender} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{name}</h2>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-6">{role}</p>
        </div>
      </section>

      <CourseOverview title="Executive biography" paragraphs={bioParagraphs} stats={bioStats} />

      <ChecklistGrid
        id="overview"
        tone="muted"
        title={overviewTitle}
        description={overviewDescription}
        items={overviewItems}
      />

      <ChecklistGrid id="expertise" title="Areas of expertise" items={expertiseItems} />

      <ChecklistGrid id="responsibilities" tone="muted" title="Responsibilities" items={responsibilityItems} />

      <ProjectShowcase title="Achievements" description={achievementsDescription} projects={achievements} />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-muted/20 border border-border/50">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">Vision</h2>
            <p className="text-lg leading-8 text-muted-foreground mb-8">{visionStatement}</p>
            <blockquote className="border-l-4 border-primary pl-6 italic text-foreground/90 text-lg leading-relaxed">
              &ldquo;{visionQuote}&rdquo;
              <footer className="mt-3 text-sm font-semibold text-primary not-italic">— {name}, {role}</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <DetailCTA heading={ctaHeading} description={ctaDescription} ctaLabel="Connect With Us" />
    </div>
  );
}
