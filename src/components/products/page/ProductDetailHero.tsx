"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, Layers, LogIn, Sparkles } from "lucide-react";
import ProductIcon from "@/components/products/page/ProductIcon";
import { ctaTarget, pageContent, resolveCtas, type StoredProduct } from "@/lib/products/shared";
import type { ProductCtaKind } from "@/types/content";
import ProductTour from "@/components/products/page/ProductTour";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const PRIMARY = "group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background shadow-lg shadow-foreground/10 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const SECONDARY = "inline-flex items-center justify-center gap-2 rounded-full border border-border/50 bg-muted/30 px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const CTA_TEXT_KEY: Record<Exclude<ProductCtaKind, "none">, string> = {
  "get-started": "products.cta.getStarted",
  "request-demo": "products.cta.requestDemo",
  "start-using": "products.cta.startUsing",
};

/** The product's CTAs: primary + secondary (Get Started / Request Demo unless overridden) and, for existing customers, Start Using. */
export function ProductCtas({ product, text }: { product: StoredProduct; text: Record<string, string> }) {
  const { primary, secondary, startUsing } = resolveCtas(product);
  const render = (kind: ProductCtaKind, cls: string) => {
    const t = ctaTarget(kind, startUsing);
    if (!t || kind === "none") return null;
    const content = (
      <>
        {text[CTA_TEXT_KEY[kind]]}
        {cls === PRIMARY && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />}
      </>
    );
    return t.href.startsWith("#") ? (
      <a href={t.href} className={cls}>{content}</a>
    ) : (
      <Link href={t.href} className={cls}>{content}</Link>
    );
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        {render(primary, PRIMARY)}
        {render(secondary, SECONDARY)}
      </div>
      {startUsing && primary !== "start-using" && secondary !== "start-using" && (
        <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          <LogIn className="h-4 w-4 text-primary" aria-hidden="true" />
          {text["products.cta.startUsingHint"]}
          <Link href={startUsing} className="font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            {text["products.cta.startUsing"]}
          </Link>
        </p>
      )}
    </div>
  );
}

export default function ProductDetailHero({ product, text, mockupText }: { product: StoredProduct; text: Record<string, string>; mockupText: Record<string, string> }) {
  const reduce = useReducedMotion();
  const c = pageContent(product);
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[10%] -top-[20%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply animate-blob dark:mix-blend-screen" />
        <div className="absolute right-[5%] top-[10%] h-[50%] w-[50%] rounded-full bg-secondary/15 blur-[100px] mix-blend-multiply animate-blob animation-delay-2000 dark:mix-blend-screen" />
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] [mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-grid-slate-400/[0.04]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-6">
            <motion.nav initial="hidden" animate="visible" variants={fadeIn} aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-primary">{text["products.breadcrumb.home"]}</Link>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <Link href="/products" className="transition-colors hover:text-primary">{text["products.breadcrumb.products"]}</Link>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span aria-current="page" className="text-foreground">{product.shortName || product.name}</span>
            </motion.nav>
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeIn} className="mb-6 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-md">
                  <ProductIcon name={product.iconName} className="h-4 w-4 text-primary" aria-hidden="true" />
                  {product.category}
                </span>
                {product.badge && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/25 bg-secondary/15 px-3 py-1.5 text-xs font-bold text-secondary-foreground">
                    <Layers className="h-3 w-3" aria-hidden="true" />
                    {product.badge}
                  </span>
                )}
                {Boolean(product.aiFeatures?.length) && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    {text["products.card.ai"]}
                  </span>
                )}
              </motion.div>
              <motion.h1 variants={fadeIn} className="mb-4 text-4xl font-black leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl [overflow-wrap:anywhere]">
                {product.name}
              </motion.h1>
              <motion.p variants={fadeIn} className="mb-4 text-xl font-medium leading-8 text-primary">{product.tagline}</motion.p>
              <motion.p variants={fadeIn} className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground">{c.pitch}</motion.p>
              <motion.div variants={fadeIn}>
                <ProductCtas product={product} text={text} />
              </motion.div>
            </motion.div>
          </div>
          <motion.div initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative min-w-0 lg:col-span-6">
            <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-60 blur-2xl" aria-hidden="true" />
            <div className="relative">
              <ProductTour product={product} mockupText={mockupText} selector={false} compact />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
