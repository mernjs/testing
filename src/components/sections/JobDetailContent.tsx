"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MapPin, BarChart3 } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import TrainingMeta from "@/components/sections/TrainingMeta";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import DetailCTA from "@/components/sections/DetailCTA";
import type { Job } from "@/app/(site)/careers/jobs-data";
import { mailtoApplyHref, perks, applicationSteps } from "@/app/(site)/careers/jobs-data";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CAREERS_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

export default function JobDetailContent({ job }: { job: Job }) {
  const applyHref = mailtoApplyHref(job.title);

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <PageHero
        category="careers"
        categoryLabel="careers"
        title={job.title}
        subtitle={`${job.category} · ${job.employmentType}`}
        description={job.summary}
        icon={job.icon}
        image={CAREERS_IMAGE}
        primaryCta={{ label: "Apply Now", href: applyHref, external: true }}
      />

      <TrainingMeta
        items={[
          { icon: job.icon, label: "Department", value: job.category },
          { icon: Clock, label: "Employment Type", value: job.employmentType },
          { icon: MapPin, label: "Location", value: job.location },
          { icon: BarChart3, label: "Experience", value: job.experience },
        ]}
      />

      <ChecklistGrid
        id="responsibilities"
        title="Key Responsibilities"
        description={`What you'll actually be doing day to day as our ${job.title}.`}
        items={job.responsibilities}
        columns={2}
      />

      <ChecklistGrid
        id="qualifications"
        tone="muted"
        title="What We're Looking For"
        description="The experience and qualities that set you up to succeed in this role."
        items={job.qualifications}
        columns={2}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-2xl mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Nice to Have</h2>
            <p className="text-lg leading-8 text-muted-foreground">Not required, but these would make you stand out from the pile.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {job.niceToHave.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
                className="flex items-start gap-3 p-5 rounded-xl bg-muted/20 border border-border/50"
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
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeIn}
            className="max-w-2xl mb-10"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Skills &amp; Tools</h2>
            <p className="text-lg leading-8 text-muted-foreground">Technologies and tools you&apos;ll be working with in this role.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeIn}
            className="flex flex-wrap gap-3"
          >
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground bg-background border border-border/60 px-4 py-2 rounded-full"
              >
                <CheckCircle2 className="w-4 h-4 text-primary flex-none" />
                {skill}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <ChecklistGrid
        id="what-we-offer"
        title="What We Offer"
        description={`The perks and culture behind the ${job.title} role.`}
        items={perks}
        columns={3}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeIn} className="max-w-2xl mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">How to Apply</h2>
            <p className="text-lg leading-8 text-muted-foreground">A simple, four-step process — no account required, no black hole.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {applicationSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative p-6 rounded-2xl bg-background border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h4 className="font-bold text-foreground mb-1.5 leading-snug">{step.title}</h4>
                <p className="text-xs font-semibold text-primary mb-2">{step.duration}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DetailCTA
        heading={`Ready to Apply for ${job.title}?`}
        description="Send us your resume and a short note about why you're a fit. Our hiring team reviews every application personally."
        ctaLabel="Apply Now"
        ctaHref={applyHref}
        external
        checklist={["Quick response", "Direct to our hiring team", "No account required"]}
      />
    </div>
  );
}
