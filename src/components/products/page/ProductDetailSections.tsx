import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Cog, Sparkles, Target, TrendingUp, Users } from "lucide-react";
import SectionHeader from "@/components/sections/SectionHeader";
import FAQAccordion from "@/components/sections/FAQAccordion";
import Reveal from "@/components/products/page/Reveal";
import ProductCardLink from "@/components/products/page/ProductCardLink";
import ProductTour from "@/components/products/page/ProductTour";
import { resolveIcon } from "@/lib/cms/icon-map";
import { neighbours, pageContent, productHref, relatedProducts, type StoredProduct } from "@/lib/products/shared";

type Text = Record<string, string>;

const CARD = "rounded-2xl border border-border/50 bg-muted/20 p-6";
const TILE = "flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary/10";

function Section({ id, tone = "default", children }: { id?: string; tone?: "default" | "muted"; children: React.ReactNode }) {
  return (
    <section id={id} className={`relative scroll-mt-24 py-24 sm:py-32 ${tone === "muted" ? "bg-muted/10" : "bg-background"}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function ProblemSection({ product, text }: { product: StoredProduct; text: Text }) {
  const c = pageContent(product);
  if (!c.problem) return null;
  return (
    <Section id="problem">
      <Reveal className="max-w-4xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">{text["products.detail.problem"]}</p>
        <h2 className="text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">{c.problem}</h2>
      </Reveal>
    </Section>
  );
}

export function WhatItDoesSection({ product, text }: { product: StoredProduct; text: Text }) {
  const c = pageContent(product);
  if (!c.overview && !c.purpose) return null;
  return (
    <Section id="overview" tone="muted">
      <SectionHeader heading={text["products.detail.whatItDoes"]} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            {c.overview.split(/\n{2,}/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Reveal>
        {c.purpose && (
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className="h-full rounded-2xl border border-primary/25 bg-primary/5 p-6">
              <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Target className="h-4 w-4" aria-hidden="true" />
                {text["products.detail.purpose"]}
              </p>
              <p className="text-base font-medium leading-relaxed text-foreground">{c.purpose}</p>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

export function FeaturesSection({ product, text }: { product: StoredProduct; text: Text }) {
  const { features } = pageContent(product);
  if (!features.length) return null;
  return (
    <Section id="features">
      <SectionHeader heading={text["products.detail.features"]} description={text["products.detail.featuresDescription"]} />
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => {
          const Icon = resolveIcon(f.icon || "CheckCircle2");
          return (
            <li key={f.title}>
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <div className={`${CARD} h-full transition-colors hover:border-primary/40`}>
                  <span className={`${TILE} mb-4`}>
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 text-base font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function AiSection({ product, text }: { product: StoredProduct; text: Text }) {
  const { ai } = pageContent(product);
  if (!ai.length) return null;
  return (
    <Section id="ai" tone="muted">
      <SectionHeader category={text["products.card.ai"]} heading={text["products.detail.ai"]} description={text["products.detail.aiDescription"]} />
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {ai.map((f, i) => {
          const Icon = resolveIcon(f.icon || "Sparkles");
          return (
            <li key={f.title}>
              <Reveal delay={(i % 2) * 0.06} className="h-full">
                <div className="flex h-full gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
                  <span className={TILE}>
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="mb-1.5 text-base font-bold text-foreground">{f.title}</h3>
                    {f.description && <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>}
                  </div>
                </div>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

export function AutomationSection({ product, text }: { product: StoredProduct; text: Text }) {
  const { workflows } = pageContent(product);
  if (!workflows.length) return null;
  return (
    <Section id="automation">
      <SectionHeader heading={text["products.detail.automation"]} description={text["products.detail.automationDescription"]} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {workflows.map((w, i) => (
          <Reveal key={w.title} delay={(i % 2) * 0.08} className="h-full">
            <div className={`${CARD} h-full`}>
              <div className="mb-5 flex items-start gap-4">
                <span className={TILE}>
                  <Cog className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">{w.title}</h3>
                  {w.description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{w.description}</p>}
                </div>
              </div>
              {w.steps.length > 0 && (
                <ol className="ml-2.5 space-y-3 border-l border-border/60 pl-6" aria-label={text["products.detail.steps"]}>
                  {w.steps.map((s, j) => (
                    <li key={j} className="relative text-sm leading-relaxed text-foreground/90">
                      <span className="absolute -left-[2.2rem] top-0 flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 bg-background text-[10px] font-bold text-primary">{j + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function UseCasesSection({ product, text }: { product: StoredProduct; text: Text }) {
  const { useCases, scenarios } = pageContent(product);
  if (!useCases.length && !scenarios.length) return null;
  return (
    <Section id="use-cases" tone="muted">
      <SectionHeader heading={text["products.detail.useCases"]} description={text["products.detail.useCasesDescription"]} />
      {useCases.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {useCases.map((u, i) => {
            const Icon = resolveIcon(u.icon || "Target");
            return (
              <li key={u.title}>
                <Reveal delay={(i % 2) * 0.06} className="h-full">
                  <div className={`${CARD} h-full bg-background/60`}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className={TILE}>
                        <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      </span>
                      <h3 className="text-base font-bold text-foreground">{u.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{u.description}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      )}
      {scenarios.length > 0 && (
        <Reveal className="mt-10">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">{text["products.detail.scenarios"]}</h3>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {scenarios.map((s) => (
              <li key={s} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-primary" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </Section>
  );
}

export function BenefitsSection({ product, text }: { product: StoredProduct; text: Text }) {
  const { benefits, outcome, facts } = pageContent(product);
  if (!benefits.length && !outcome && !facts.length) return null;
  return (
    <Section id="benefits">
      <SectionHeader heading={text["products.detail.benefits"]} description={text["products.detail.benefitsDescription"]} />
      {outcome && (
        <Reveal className="mb-8">
          <div className="flex items-start gap-4 rounded-2xl border border-primary/25 bg-primary/5 p-6">
            <span className={TILE}>
              <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <p className="text-base font-medium leading-relaxed text-foreground">{outcome}</p>
          </div>
        </Reveal>
      )}
      {facts.length > 0 && (
        <dl className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className={`${CARD} text-center`}>
              <dd className="text-2xl font-black text-foreground">{f.value}</dd>
              <dt className="mt-1 text-xs font-medium text-muted-foreground">{f.label}</dt>
            </div>
          ))}
        </dl>
      )}
      {benefits.length > 0 && (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={(i % 4) * 0.06} className="h-full">
                <div className={`${CARD} h-full`}>
                  <CheckCircle2 className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
                  <h3 className="mb-1.5 text-base font-bold text-foreground">{b.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

export function WhoForSection({ product, text }: { product: StoredProduct; text: Text }) {
  const { audience } = pageContent(product);
  if (!audience && !product.targetDepartments.length && !product.targetUsers.length) return null;
  const chips = (items: string[]) => (
    <ul className="flex flex-wrap gap-2">
      {items.map((d) => (
        <li key={d} className="rounded-full border border-border/50 bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground">
          {d}
        </li>
      ))}
    </ul>
  );
  return (
    <Section id="audience" tone="muted">
      <SectionHeader heading={text["products.detail.whoFor"]} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {audience && (
          <Reveal className="lg:col-span-6">
            <div className="flex items-start gap-4">
              <span className={TILE}>
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              </span>
              <p className="text-lg leading-relaxed text-muted-foreground">{audience}</p>
            </div>
          </Reveal>
        )}
        <Reveal delay={0.1} className={audience ? "space-y-6 lg:col-span-6" : "space-y-6 lg:col-span-12"}>
          {product.targetDepartments.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">{text["products.detail.departments"]}</h3>
              {chips(product.targetDepartments)}
            </div>
          )}
          {product.targetUsers.length > 0 && (
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">{text["products.detail.users"]}</h3>
              {chips(product.targetUsers)}
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

export function IntegrationsSection({ product, text }: { product: StoredProduct; text: Text }) {
  const { integrations } = pageContent(product);
  if (!integrations.length) return null;
  return (
    <Section id="integrations">
      <SectionHeader heading={text["products.detail.integrations"]} description={text["products.detail.integrationsDescription"]} />
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((it, i) => {
          const inner = (
            <div className={`${CARD} h-full transition-colors ${it.href ? "hover:border-primary/40" : ""}`}>
              <h3 className="mb-1.5 flex items-center gap-2 text-base font-bold text-foreground">
                {it.name}
                {it.href && <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{it.description}</p>
            </div>
          );
          return (
            <li key={it.name}>
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                {it.href ? (
                  <Link href={it.href} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/** Real screenshots, when the product has any. Local files go through next/image (lazy, responsive); remote CMS URLs use a plain lazy <img>. */
function Screenshots({ product, text }: { product: StoredProduct; text: Text }) {
  const shots = product.screenshots ?? [];
  if (!shots.length) return null;
  return (
    <div className="mt-16">
      <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-primary">{text["products.detail.screenshots"]}</h3>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {shots.map((s) => (
          <li key={s.src}>
            <figure className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xl">
              {s.src.startsWith("/") ? (
                <Image src={s.src} alt={s.alt || s.caption || product.name} width={1440} height={900} sizes="(min-width: 1024px) 560px, 100vw" loading="lazy" className="h-auto w-full" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- CMS-authored image on any host
                <img src={s.src} alt={s.alt || s.caption || product.name} loading="lazy" decoding="async" className="h-auto w-full" />
              )}
              {s.caption && <figcaption className="border-t border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">{s.caption}</figcaption>}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TourSection({ product, text, mockupText }: { product: StoredProduct; text: Text; mockupText: Text }) {
  const hasScreens = product.screens.length > 0;
  if (!hasScreens && !product.screenshots?.length) return null;
  return (
    <Section id="tour" tone="muted">
      <SectionHeader heading={text["products.detail.tour"]} description={text["products.detail.tourDescription"]} />
      {hasScreens && (
        <Reveal>
          <ProductTour product={product} mockupText={mockupText} />
        </Reveal>
      )}
      <Screenshots product={product} text={text} />
    </Section>
  );
}

export function FaqSection({ product, text }: { product: StoredProduct; text: Text }) {
  const { faq } = pageContent(product);
  if (!faq.length) return null;
  return <FAQAccordion title={text["products.detail.faq"]} faqs={faq.map((f) => ({ question: f.q, answer: f.a }))} />;
}

export function RelatedSection({ product, all, text }: { product: StoredProduct; all: StoredProduct[]; text: Text }) {
  const related = relatedProducts(product, all, 3);
  const nav = neighbours(product, all);
  if (!related.length && !nav) return null;
  return (
    <Section id="related" tone="muted">
      <SectionHeader heading={text["products.detail.related"]} />
      {related.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {related.map((p) => (
            <ProductCardLink key={p.slug} product={p} text={text} compact />
          ))}
        </div>
      )}
      {nav && (
        <nav aria-label="Product navigation" className="mt-10 flex flex-col items-stretch justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row sm:items-center">
          <Link href={productHref(nav.prev.slug)} rel="prev" className="group inline-flex items-center gap-3 rounded-xl p-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span>
              <span className="block text-xs text-muted-foreground">{text["products.detail.prev"]}</span>
              <span className="font-semibold text-foreground group-hover:text-primary">{nav.prev.shortName || nav.prev.name}</span>
            </span>
          </Link>
          <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full border border-border/50 bg-muted/30 px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            {text["products.detail.allProducts"]}
          </Link>
          <Link href={productHref(nav.next.slug)} rel="next" className="group inline-flex items-center justify-end gap-3 rounded-xl p-2 text-right text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <span>
              <span className="block text-xs text-muted-foreground">{text["products.detail.next"]}</span>
              <span className="font-semibold text-foreground group-hover:text-primary">{nav.next.shortName || nav.next.name}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </nav>
      )}
    </Section>
  );
}
