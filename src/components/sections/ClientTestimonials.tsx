"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, LucideIcon } from "lucide-react";
import { clientTestimonialsData, Testimonial } from "@/lib/testimonials-data";

const testimonials: Testimonial[] = clientTestimonialsData;

interface ClientTestimonialsProps {
  icon?: LucideIcon;
  category?: string;
}

export default function ClientTestimonials({ icon: Icon, category }: ClientTestimonialsProps) {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [paused, setPaused] = React.useState(false);

  const next = React.useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % testimonials.length);
  }, []);

  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  };

  React.useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next]);

  const active = testimonials[index];

  return (
    <section className="py-24 sm:py-32 bg-background relative overflow-hidden border-b border-border/50">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-secondary/15 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {Icon && (
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-muted/40 border border-border/50 shadow-sm mb-6">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">{category ?? "Client Voices"}</p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">What our clients say.</h2>
        </motion.div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative min-h-[320px] sm:min-h-[280px] rounded-[2.5rem] bg-card border border-border/50 shadow-xl overflow-hidden">
            <Quote aria-hidden="true" className="absolute top-8 right-8 w-16 h-16 text-primary/10" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ x: direction * 60 }}
                animate={{ x: 0 }}
                exit={{ x: direction * -60 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) next();
                  else if (info.offset.x > 80) prev();
                }}
                className="relative z-10 p-8 sm:p-12 flex flex-col justify-between h-full cursor-grab active:cursor-grabbing"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed mb-8 max-w-2xl">
                    &ldquo;{active.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${active.color} flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}>
                    {active.initials}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{active.name}</div>
                    <div className="text-sm text-muted-foreground">{active.role}, {active.company}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-11 h-11 rounded-full border border-border/50 bg-muted/30 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="group min-w-6 min-h-6 flex items-center justify-center"
                >
                  <span className={`block h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-primary" : "w-2 bg-border group-hover:bg-primary/40"}`} />
                </button>
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-11 h-11 rounded-full border border-border/50 bg-muted/30 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
