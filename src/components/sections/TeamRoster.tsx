"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RosterMember {
  name: string;
  role: string;
  department: string;
  description: string;
  photo: string;
}

interface TeamRosterProps {
  title?: string;
  description?: string;
  members: RosterMember[];
  departments: readonly string[];
  tone?: "default" | "muted";
}

function TeamCard({ member }: { member: RosterMember }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="group relative"
    >
      <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-primary/30 via-primary/0 to-secondary/30 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none" />

      <div className="relative h-full flex flex-col items-center text-center rounded-3xl border border-border/50 bg-background p-7 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary/30 transition-all duration-300">
        <div className="relative mb-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-muted/30 group-hover:ring-primary/25 shadow-md transition-all duration-300">
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background ring-2 ring-background shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-1">
            {member.department}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 text-muted-foreground text-[11px] font-semibold px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Remote
          </span>
        </div>

        <h3 className="font-bold text-foreground leading-snug">{member.name}</h3>
        <p className="text-sm font-semibold text-primary mb-3">{member.role}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>
      </div>
    </motion.div>
  );
}

export default function TeamRoster({ title, description, members, departments, tone = "default" }: TeamRosterProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = useMemo(
    () => ["All", ...departments].map((d) => ({ label: d, count: d === "All" ? members.length : members.filter((m) => m.department === d).length })),
    [departments, members]
  );
  const visibleMembers = activeFilter === "All" ? members : members.filter((m) => m.department === activeFilter);

  return (
    <section id="team" className={`py-24 sm:py-32 relative overflow-hidden ${tone === "muted" ? "bg-muted/10" : "bg-background"}`}>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-10"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">{title}</h2>
            {description && <p className="text-lg leading-8 text-muted-foreground">{description}</p>}
          </motion.div>
        )}

        <div className="flex flex-wrap gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => setActiveFilter(filter.label)}
              className="relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
            >
              {activeFilter === filter.label && (
                <motion.span
                  layoutId="active-filter-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-foreground"
                />
              )}
              <span
                className={`relative flex items-center gap-1.5 ${
                  activeFilter === filter.label ? "text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter.label}
                <span
                  className={`text-[11px] rounded-full px-1.5 py-0.5 ${
                    activeFilter === filter.label ? "bg-background/20" : "bg-muted/60"
                  }`}
                >
                  {filter.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleMembers.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
