"use client";

import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Layers, Users, Clock } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import SubscriptionCard from "@/components/sections/SubscriptionCard";
import DetailCTA from "@/components/sections/DetailCTA";
import { engagementCategories } from "./resources-data";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ResourceAugmentationContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="hire developers"
        title="Resource Augmentation"
        description="Choose the engagement model that fits how you build — a single developer, a full pre-built team, on-demand hours, or a fixed-scope project. Every plan is transparent on pricing, duration, and what you get."
        icon={UserPlus}
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop"
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-2xl mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">Engagement Models</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Choose How You Hire</h2>
            <p className="text-lg leading-8 text-muted-foreground">Each plan below has its own dedicated page covering pricing, team structure, hiring process, deliverables, and FAQs.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {engagementCategories.map((category, i) => (
              <SubscriptionCard
                key={category.slug}
                index={i}
                icon={category.icon}
                title={category.title}
                tagline={category.tagline}
                price={category.cardHighlight.pricing}
                billingType={category.cardHighlight.billingType}
                specs={[
                  { icon: Layers, label: "Engagement", value: category.cardHighlight.engagementModel },
                  { icon: Users, label: "Team Size", value: category.cardHighlight.teamComposition },
                  { icon: Clock, label: "Duration", value: category.cardHighlight.hiringDuration },
                ]}
                bestFor={category.cardHighlight.idealUseCase}
                featuresLabel="Key Benefits"
                features={category.keyBenefits}
                href={`/resource-augmentation/${category.slug}`}
                ctaLabel="View Details"
                featured={category.slug === "package-based-team"}
              />
            ))}
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Not sure which model fits?"
        description="Tell us what you're building and we'll recommend the right engagement model, team size, and pricing — no obligation."
        ctaLabel="Get a Custom Quote"
        checklist={["Free consultation", "Fast onboarding", "Replacement guarantee"]}
        category="resource-augmentation"
      />
    </div>
  );
}
