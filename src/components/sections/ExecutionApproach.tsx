"use client";

import { motion } from "framer-motion";
import {
  Workflow,
  ClipboardList,
  Compass,
  GitCompare,
  PenTool,
  Database,
  Code2,
  Cpu,
  ShieldCheck,
  GitBranch,
  Rocket,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    title: "Business Requirement & Discovery",
    desc: "Deep dive into your context to extract core business objectives, define user personas, and understand the exact market problem we're solving.",
    icon: ClipboardList,
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Feasibility & PDA Analysis",
    desc: "Evaluating technical feasibility, budget constraints, risk assessment, and Product Domain Analysis (PDA) before we finalize scope of work.",
    icon: Compass,
    image: "https://images.unsplash.com/photo-1518183214770-9cffbec72538?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Gap Analysis & Strategy",
    desc: "Mapping the skills, tools, and data required to close the gap between where you are and where the roadmap needs to take you.",
    icon: GitCompare,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "UI/UX Architecture & Prototyping",
    desc: "Designing intuitive user journeys and interactive, clickable prototypes that earn stakeholder approval before a single line of code ships.",
    icon: PenTool,
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Architecture & System Design",
    desc: "Selecting the optimal tech stack, designing resilient database schemas, and architecting highly scalable, fault-tolerant infrastructure.",
    icon: Database,
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Agile Execution & Coding",
    desc: "Sprint-based development following strict coding standards, SRP principles, and highly maintainable architecture.",
    icon: Code2,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "AI Core Integration",
    desc: "Embedding advanced LLMs, custom algorithms, and intelligent automation seamlessly into the product's core fabric.",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "QA, Testing & Security",
    desc: "Rigorous automated and manual QA sweeps, plus comprehensive security vulnerability audits at enterprise-grade standards.",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "CI/CD & DevOps Automation",
    desc: "Establishing zero-downtime deployment pipelines with containerized infrastructure for fully automated, bulletproof releases.",
    icon: GitBranch,
    image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "UAT & Production Deployment",
    desc: "Final user acceptance testing in a staging environment, followed by a fully orchestrated, zero-error move to production.",
    icon: Rocket,
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Monitoring & Future Scaling",
    desc: "Post-launch monitoring, log tracking, and capacity planning to ensure your platform scales efficiently as demand grows.",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=200&auto=format&fit=crop",
  },
];

export default function ExecutionApproach() {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden border-b border-border/50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-[0.05] dark:opacity-[0.15] blur-[2px] scale-110"
        />
      </div>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/40 border border-border/50 mb-6 shadow-sm">
            <Workflow className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl mb-4">
            My Execution{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Approach
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A systematic, battle-tested pipeline designed to eliminate ambiguity, mitigate risk early, and guarantee robust, scalable product delivery.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 sm:left-1/2 top-2 bottom-2 w-px sm:-translate-x-1/2 bg-gradient-to-b from-primary via-secondary to-primary/20" />

          <div className="flex flex-col gap-10 sm:gap-6">
            {steps.map((step, idx) => {
              const isLeft = idx % 2 === 0;
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: 0.05 * (idx % 4) }}
                  className={`relative flex items-center gap-6 sm:gap-10 pl-16 sm:pl-0 ${
                    isLeft ? "sm:flex-row-reverse" : "sm:flex-row"
                  }`}
                >
                  <div className="absolute left-6 sm:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-md" />

                  <div className="hidden sm:block sm:w-1/2" />

                  <div className="w-full sm:w-1/2 group">
                    <div className="p-6 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/30 hover:bg-muted/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={step.image}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/35"></div>
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 mix-blend-overlay"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-white drop-shadow" />
                          </div>
                        </div>
                        <h3 className="font-bold text-foreground">{step.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
