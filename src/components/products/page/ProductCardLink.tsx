import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductIcon from "@/components/products/page/ProductIcon";
import { capabilityChips, productHref, valueLine, type StoredProduct } from "@/lib/products/shared";

/**
 * A product on the listing (and in "related products"): icon, name, tagline,
 * 2-3 capability chips and "Explore Product". The title is the one real link;
 * its pseudo-element stretches over the card so the whole card is clickable
 * with a single tab stop.
 */
export default function ProductCardLink({ product, text, compact = false, level = 3 }: { product: StoredProduct; text: Record<string, string>; compact?: boolean; level?: 3 | 4 }) {
  const Heading = level === 4 ? "h4" : "h3";
  const chips = capabilityChips(product, 3);
  const hasAi = Boolean(product.aiFeatures?.length);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/15 via-secondary/15 to-primary/5 shadow-md transition-transform duration-300 group-hover:scale-105">
          <ProductIcon name={product.iconName} className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <Heading className="text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            <Link href={productHref(product.slug)} className="outline-none after:absolute after:inset-0 after:content-['']">
              {product.name}
            </Link>
          </Heading>
          {product.badge && <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{product.badge}</p>}
        </div>
      </div>
      <p className="relative mt-4 text-sm font-medium leading-relaxed text-foreground/90">{valueLine(product)}</p>
      {!compact && product.shortDescription && <p className="relative mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{product.shortDescription}</p>}
      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {hasAi && (
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            {text["products.card.ai"]}
          </span>
        )}
        {chips.map((c) => (
          <span key={c} className="rounded-full border border-border/50 bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            {c}
          </span>
        ))}
      </div>
      <span className="relative mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-primary">
        {text["products.card.explore"]}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true" />
      </span>
    </article>
  );
}
