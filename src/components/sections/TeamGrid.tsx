"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  color: string;
}

interface TeamGridProps {
  title?: string;
  description?: string;
  members: TeamMember[];
  tone?: "default" | "muted";
  icon?: LucideIcon;
  category?: string;
  align?: "left" | "center";
}

export default function TeamGrid({ title, description, members, tone = "default", icon: Icon, category, align = "left" }: TeamGridProps) {
  const enhanced = Boolean(Icon || category);
  const centered = align === "center";

  return (
    <section id="leadership" className={`py-24 sm:py-32 relative ${tone === "muted" ? "bg-muted/10" : "bg-background"}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className={`max-w-2xl mb-14 ${centered ? "text-center mx-auto" : ""}`}
          >
            {Icon && (
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/40 border border-border/50 shadow-sm mb-6">
                <Icon className="w-6 h-6 text-primary" />
              </div>
            )}
            {category && (
              <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{category}</p>
            )}
            <h2 className={`font-bold tracking-tight text-foreground mb-4 ${enhanced ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"}`}>{title}</h2>
            {description && <p className="text-lg leading-8 text-muted-foreground">{description}</p>}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-lg shadow-lg mb-4`}
              >
                {member.initials}
              </div>
              <h4 className="font-bold text-foreground mb-1">{member.name}</h4>
              <p className="text-sm font-semibold text-primary mb-3">{member.role}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
