"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Wallet, Clock } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import TrainingMeta from "@/components/sections/TrainingMeta";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import SubscriptionCard from "@/components/sections/SubscriptionCard";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import type { EngagementCategory } from "@/app/(site)/resource-augmentation/resources-data";
import { hireMailto } from "@/app/(site)/resource-augmentation/resources-data";

const HERO_IMAGE = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function CategoryDetail({ category }: { category: EngagementCategory }) {
  const applyHref = hireMailto(`Inquiry: ${category.title}`);

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <PageHero
        category="resource-augmentation"
        categoryLabel="resource augmentation"
        title={category.title}
        subtitle={category.tagline}
        description={category.summary}
        icon={category.icon}
        image={HERO_IMAGE}
        primaryCta={{ label: "Get a Custom Quote", href: applyHref, external: true }}
      />

      <TrainingMeta
        items={[
          { icon: Users, label: "Team Composition", value: category.cardHighlight.teamComposition },
          { icon: Wallet, label: "Billing Type", value: category.cardHighlight.billingType },
          { icon: Clock, label: "Hiring Duration", value: category.cardHighlight.hiringDuration },
          { icon: category.icon, label: "Starting Price", value: category.cardHighlight.pricing },
        ]}
      />

      <ChecklistGrid
        id="overview"
        title="Overview"
        description={`How ${category.title.toLowerCase()} hiring works.`}
        items={category.overview}
        columns={2}
      />

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key Features"
        description={`What makes ${category.title.toLowerCase()} hiring worth choosing.`}
        items={category.features}
        columns={3}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Ideal Use Case</h2>
            <p className="text-lg leading-8 text-muted-foreground">Signs {category.title.toLowerCase()} hiring is the right fit for your team.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.idealUseCase.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                className="flex items-start gap-3 p-5 rounded-xl bg-background border border-border/50"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-none mt-0.5" />
                <span className="text-sm text-foreground leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="options" className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-2xl mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">Compare Options</p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Choose Your Plan</h2>
            <p className="text-lg leading-8 text-muted-foreground">{category.subOptionsIntro}</p>
          </motion.div>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
              category.subOptions.length >= 5 ? "lg:grid-cols-4" : category.subOptions.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2 max-w-3xl"
            }`}
          >
            {category.subOptions.map((option, i) => (
              <SubscriptionCard
                key={option.slug}
                index={i}
                compact
                icon={option.icon}
                title={option.title}
                tagline={option.tagline}
                price={option.price}
                features={option.points}
                featured={option.featured}
                href={hireMailto(`Inquiry: ${category.title} — ${option.title}`)}
                ctaLabel="Inquire"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Deliverables</h2>
            <p className="text-lg leading-8 text-muted-foreground">What you actually receive from this engagement.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.deliverables.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                className="flex items-start gap-3 p-5 rounded-xl bg-background border border-border/50"
              >
                <CheckCircle2 className="w-5 h-5 text-primary flex-none mt-0.5" />
                <span className="text-sm text-foreground leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Pricing</h2>
            <p className="text-lg leading-8 text-muted-foreground mb-8">{category.pricingIntro}</p>
            <div className="flex flex-wrap items-baseline gap-4 p-8 rounded-2xl bg-muted/20 border border-border/50">
              <span className="text-4xl font-black text-foreground">{category.cardHighlight.pricing}</span>
              <span className="text-sm text-muted-foreground">
                {category.cardHighlight.billingType} · {category.cardHighlight.hiringDuration}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <CurriculumTimeline title="Hiring Process" description="From first call to your first deliverable." modules={category.hiringProcess} />

      <FAQAccordion tone="muted" faqs={category.faqs} />

      <DetailCTA
        heading={`Ready to Get Started With ${category.title}?`}
        description="Tell us what you're building and we'll confirm fit, timeline, and pricing on a short discovery call."
        ctaLabel="Get a Custom Quote"
        ctaHref={applyHref}
        external
        checklist={["Quick response", "Fast onboarding", "Replacement guarantee"]}
      />
    </div>
  );
}
