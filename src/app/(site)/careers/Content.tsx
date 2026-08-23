"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import ListingHero from "@/components/sections/ListingHero";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import DetailCTA from "@/components/sections/DetailCTA";
import { jobs, categories, perks, type Job } from "./jobs-data";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function RoleCard({ job, index }: { job: Job; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.06 }}
      className="group relative h-full"
    >
      <Link
        href={`/careers/${job.slug}`}
        aria-label={`${job.title} — View role details`}
        className="flex flex-col h-full rounded-3xl bg-muted/20 border border-border/50 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-none group-hover:bg-primary group-hover:scale-105 transition-all duration-300">
            <job.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background border border-border/60 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            {job.employmentType}
          </span>
        </div>

        <h4 className="text-lg font-bold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
          {job.title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{job.summary}</p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
          <MapPin className="w-3.5 h-3.5 flex-none" />
          {job.location}
        </div>

        <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/60 px-4 py-2.5 text-sm font-bold text-foreground group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          View Role &amp; Apply <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </motion.div>
  );
}

export default function CareersContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="careers at YashOrbit"
        title="Build the Future With Us"
        description="We're a team of engineers, designers, and strategists building AI-powered products for clients around the world. Explore open roles across engineering, design, and business."
        icon={Briefcase}
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
      />

      <ChecklistGrid
        id="why-yashorbit"
        title="Why Work With Us"
        description="A growth-first environment where your work ships to real users and your career moves as fast as you do."
        items={perks}
        columns={3}
      />

      {/* Open Positions */}
      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="absolute left-0 top-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeIn}
            className="max-w-2xl mb-16"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">Open Positions</p>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4 leading-[1.1]">
              Find Your Role
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Openings are grouped by team below. Click a role to see the full job description. Don&apos;t see an exact match? We&apos;re always open to hearing from strong candidates.
            </p>
          </motion.div>

          <div className="space-y-16">
            {categories.map((category) => {
              const categoryJobs = jobs.filter((job) => job.category === category.name);
              if (categoryJobs.length === 0) return null;
              return (
                <div key={category.name}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-none">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryJobs.map((job, i) => (
                      <RoleCard key={job.slug} job={job} index={i} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Don't see your role listed?"
        description="We're always looking for great people. Send us your resume and tell us how you'd like to contribute — we'll reach out when the right role opens up."
        ctaLabel="Get in Touch"
        checklist={["Open to referrals", "Quick response", "No account required"]}
      />
    </div>
  );
}
