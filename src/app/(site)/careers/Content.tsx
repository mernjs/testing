"use client";

import React, { useMemo, useState } from "react";
import { Briefcase, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import ListingHero from "@/components/sections/ListingHero";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";
import { jobs, categories } from "./jobs-data";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const CAREERS_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

export default function CareersContent() {
  const [activeFilter, setActiveFilter] = useState("All Roles");

  const filteredJobs = useMemo(
    () => (activeFilter === "All Roles" ? jobs : jobs.filter((job) => job.category === activeFilter)),
    [activeFilter]
  );

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="careers at YashOrbit"
        title="Build the Future With Us"
        description="We're a team of engineers, designers, and strategists building AI-powered products for clients around the world. Explore open roles across engineering, design, and business."
        icon={Briefcase}
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
      />

      {/* Open Positions */}
      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="absolute left-0 top-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeIn}
            className="flex flex-wrap gap-3 mb-12"
          >
            <button
              onClick={() => setActiveFilter("All Roles")}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                activeFilter === "All Roles"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-background border border-border/50 text-foreground hover:border-primary/40"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              All Roles
              <span className={`text-xs font-bold ${activeFilter === "All Roles" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {jobs.length}
              </span>
            </button>
            {categories.map((category) => {
              const count = jobs.filter((job) => job.category === category.name).length;
              if (count === 0) return null;
              return (
                <button
                  key={category.name}
                  onClick={() => setActiveFilter(category.name)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                    activeFilter === category.name
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-background border border-border/50 text-foreground hover:border-primary/40"
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                  <span className={`text-xs font-bold ${activeFilter === category.name ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </motion.div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredJobs.map((job) => (
              <ListingCard
                key={job.slug}
                index={jobs.findIndex((j) => j.slug === job.slug)}
                icon={job.icon}
                badge="Open Role"
                badgeIcon={Briefcase}
                title={job.title}
                subtitle={job.employmentType}
                description={job.summary}
                highlights={[job.location, job.experience]}
                href={`/careers/${job.slug}`}
                image={CAREERS_IMAGE}
                ctaLabel="View Role & Apply"
              />
            ))}
          </motion.div>
        </div>
      </section>

      <DetailCTA
        heading="Don't see your role listed?"
        description="We're always looking for great people. Send us your resume and tell us how you'd like to contribute — we'll reach out when the right role opens up."
        ctaLabel="Send General Application"
        ctaHref="/careers/apply"
        checklist={["Open to referrals", "Quick response", "No account required"]}
      />
    </div>
  );
}
