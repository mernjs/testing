"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, CheckCircle2, Users, LucideIcon } from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

interface PageHeroProps {
  category: string;
  categoryLabel: string;
  title: string;
  subtitle: React.ReactNode;
  description: React.ReactNode;
  icon: LucideIcon;
  image: string;
  /** Overrides the default "Start a Project" → /contact primary CTA. Set `external: true` for mailto/tel/off-site links. */
  primaryCta?: { label: string; href: string; external?: boolean };
}

export default function PageHero({
  category,
  categoryLabel,
  title,
  subtitle,
  description,
  icon: Icon,
  image,
  primaryCta = { label: "Start a Project", href: "/contact", external: false },
}: PageHeroProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 border-b border-border/50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* Mobile / single-column: strong uniform scrim since text spans full width */}
        <div className="absolute inset-0 bg-background/90 lg:hidden"></div>
        {/* Desktop / two-column: solid on the text side, photo revealed on the visual side */}
        <div
          className="absolute inset-0 bg-background hidden lg:block"
          style={{
            maskImage: "linear-gradient(to right, black 0%, black 45%, transparent 92%)",
            WebkitMaskImage: "linear-gradient(to right, black 0%, black 45%, transparent 92%)",
          }}
        ></div>
        <div
          className="absolute inset-0 bg-background hidden lg:block"
          style={{
            maskImage: "linear-gradient(to top, black 0%, transparent 40%)",
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 40%)",
          }}
        ></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
        <div className="absolute top-[10%] right-[5%] w-[50%] h-[50%] rounded-full bg-secondary/15 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] rounded-full bg-[#ff8e75]/15 blur-[140px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-slate-400/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
        <div
          className="absolute inset-0 bg-grid-slate-900/[0.08] dark:bg-grid-slate-400/[0.08]"
          style={{
            WebkitMaskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 80%)`,
            maskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 80%)`,
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-6"
            >
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={`/${category}`} className="hover:text-primary transition-colors capitalize">
                {categoryLabel}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{title}</span>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/40 border border-border/50 text-sm font-medium text-foreground backdrop-blur-md mb-6 shadow-sm w-fit"
              >
                <Icon className="w-4 h-4 text-primary" />
                <span className="capitalize">{categoryLabel}</span>
              </motion.div>
              <motion.h1
                variants={fadeIn}
                className="text-5xl font-black tracking-tight text-foreground sm:text-6xl mb-6 leading-[1.1]"
              >
                {title}
              </motion.h1>
              <motion.p variants={fadeIn} className="text-xl leading-8 font-medium text-primary mb-4">
                {subtitle}
              </motion.p>
              <motion.p variants={fadeIn} className="text-lg leading-relaxed text-muted-foreground max-w-xl mb-10">
                {description}
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-4">
                {primaryCta.external ? (
                  <a
                    href={primaryCta.href}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background hover:scale-105 active:scale-95 transition-all shadow-lg shadow-foreground/10"
                  >
                    {primaryCta.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                ) : (
                  <Link
                    href={primaryCta.href}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background hover:scale-105 active:scale-95 transition-all shadow-lg shadow-foreground/10"
                  >
                    {primaryCta.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <Link
                  href={`/${category}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-foreground bg-muted/30 border border-border/50 hover:bg-muted/60 transition-all capitalize"
                >
                  View all {categoryLabel}
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[3rem] blur-2xl opacity-60 animate-pulse"></div>
              <div className="relative h-full w-full rounded-[3rem] shadow-2xl border border-border/60 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-secondary/30 mix-blend-overlay"></div>
                <div className="absolute top-6 left-6 w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-6 top-10 p-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm font-bold">Trusted Process</div>
                  <div className="text-xs text-muted-foreground">Proven at scale</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute -left-8 bottom-12 p-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-bold">Dedicated Experts</div>
                  <div className="text-xs text-muted-foreground">On every project</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
