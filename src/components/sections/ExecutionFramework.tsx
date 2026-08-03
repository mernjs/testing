"use client";

import { motion } from "framer-motion";
import { Compass, Lightbulb, Hammer, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Think: Strategic Alignment",
    desc: "Technology must serve your business. Before writing code, we dive deep into your domain to uncover bottlenecks and map user journeys — ensuring we build solutions that align perfectly with your goals and eliminate costly technical debt.",
    icon: Lightbulb,
    color: "text-sky-500",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
  },
  {
    num: "02",
    title: "Build: AI-Native Value",
    desc: "We future-proof your product by architecting API-first microservices. By seamlessly integrating powerful generative AI directly into the core, your application becomes an intelligent, highly engaging platform that naturally delights users.",
    icon: Hammer,
    color: "text-primary",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=800&auto=format&fit=crop",
  },
  {
    num: "03",
    title: "Scale: Market Dominance",
    desc: "Growth should never break your product. We deploy cloud-native, self-healing infrastructure designed to expand dynamically. As your audience grows, uncompromised performance turns your vision into an undeniable market leader.",
    icon: Rocket,
    color: "text-emerald-500",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
  },
];

export default function ExecutionFramework() {
  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/40 border border-border/50 mb-6 shadow-sm">
            <Compass className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl mb-4">
            The Execution:{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Think. Build. Scale.
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            While the SDLC defines the process, this framework defines the outcome — our execution strategy for turning complex ideas into scalable, self-sustaining market leaders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group/card relative rounded-[2rem] bg-muted/20 border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.image}
                    alt={step.title}
                    className="absolute inset-0 w-full h-full object-cover scale-105 group-hover/card:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-secondary/30 mix-blend-overlay"></div>

                  {/* Shine sweep */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover/card:translate-x-[350%] transition-transform duration-1000 ease-out" />
                  </div>

                  <span className="absolute top-3 right-5 text-7xl font-black text-white/10 select-none leading-none pointer-events-none">
                    {step.num}
                  </span>

                  <div
                    className={`absolute bottom-4 left-5 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 shadow-lg group-hover/card:scale-110 transition-transform duration-500 ${step.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="relative z-10 p-8">
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover/card:text-primary transition-colors">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
