"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { resolveIcon } from "@/lib/cms/icon-map";
import { label, productHref, type StoredProduct } from "@/lib/products/shared";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

/** The /products hero: what the suite is, Get Started + Request Demo, and a live tile map of the products. */
export default function ProductsHero({ products, text }: { products: StoredProduct[]; text: Record<string, string> }) {
  const reduce = useReducedMotion();
  const tiles = products.slice(0, 12);
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply animate-blob dark:mix-blend-screen" />
        <div className="absolute right-[5%] top-[10%] h-[50%] w-[50%] rounded-full bg-secondary/15 blur-[100px] mix-blend-multiply animate-blob animation-delay-2000 dark:mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] [mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-grid-slate-400/[0.04]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.nav initial="hidden" animate="visible" variants={fadeIn} aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-primary">{text["products.breadcrumb.home"]}</Link>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span aria-current="page" className="text-foreground">{text["products.breadcrumb.products"]}</span>
            </motion.nav>
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeIn} className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                {text["products.listing.badge"]}
              </motion.div>
              <motion.h1 variants={fadeIn} className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-foreground sm:text-6xl">
                {text["products.listing.title"]}{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{text["products.listing.titleAccent"]}</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {text["products.listing.description"]}
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-4">
                <Link href="/signup" className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background shadow-lg shadow-foreground/10 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                  {text["products.cta.getStarted"]}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <a href="#demo" className="inline-flex items-center justify-center gap-2 rounded-full border border-border/50 bg-muted/30 px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {text["products.cta.requestDemo"]}
                </a>
              </motion.div>
            </motion.div>
          </div>

          <motion.div initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative lg:col-span-5">
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-60 blur-2xl" aria-hidden="true" />
            <ul className="relative grid grid-cols-3 gap-3 rounded-[2rem] border border-border/60 bg-card/70 p-4 shadow-2xl backdrop-blur-xl sm:grid-cols-4 sm:gap-4 sm:p-5 lg:grid-cols-3">
              {tiles.map((p) => {
                const Icon = resolveIcon(p.iconName);
                return (
                  <li key={p.slug}>
                    <Link href={productHref(p.slug)} className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-border/50 bg-background/70 p-3 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-[11px] font-semibold leading-tight text-foreground">{label(p)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
