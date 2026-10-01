"use client";

import { useMemo, useState } from "react";
import { fillText } from "@/lib/products/text";
import { groupByCategory, type StoredProduct } from "@/lib/products/shared";
import ProductCardLink from "@/components/products/page/ProductCardLink";

/** The category-filterable product grid. Every product is in the server-rendered HTML; the tabs only narrow the view. */
export default function ProductsGrid({ products, text }: { products: StoredProduct[]; text: Record<string, string> }) {
  const groups = useMemo(() => groupByCategory(products), [products]);
  const [active, setActive] = useState<string>("");
  const shown = active ? groups.filter((g) => g.category === active) : groups;
  const count = shown.reduce((n, g) => n + g.products.length, 0);
  const tab = (value: string, label: string) => (
    <button
      key={value || "all"}
      type="button"
      aria-pressed={active === value}
      onClick={() => setActive(value)}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        active === value ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div>
      <div role="group" aria-label={text["products.listing.filterLabel"]} className="mb-10 flex flex-wrap gap-2">
        {tab("", text["products.listing.filterAll"])}
        {groups.map((g) => tab(g.category, g.category))}
      </div>
      <p className="sr-only" aria-live="polite">{fillText(text["products.listing.count"], { n: count })}</p>
      <div className="space-y-14">
        {shown.map((g) => (
          <section key={g.category} aria-labelledby={`cat-${g.category.replace(/\W+/g, "-")}`}>
            <h3 id={`cat-${g.category.replace(/\W+/g, "-")}`} className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary to-secondary" aria-hidden="true" />
              {g.category}
              <span className="h-px flex-1 bg-border/60" aria-hidden="true" />
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {g.products.map((p) => (
                <ProductCardLink key={p.slug} product={p} text={text} level={4} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
