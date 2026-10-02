import fs from "node:fs";
import path from "node:path";
import { productsCollection } from "@/lib/cms/collections/products-def";
import { buildProductsNav, PRODUCTS_PATH, type StoredProduct } from "@/lib/products/shared";

/**
 * The built-in product catalogue is `cms-seed/collections/products.json`
 * (the website has no content in code; the seed is what the migration loads
 * into the CMS). Scripts and tests read it through here.
 */

export const PRODUCTS_SEED_FILE = path.resolve("cms-seed/collections/products.json");

/** The seed records, parsed with the CMS's own parser (invalid ones are dropped, so tests also catch those). */
export function loadSeedProducts(file = PRODUCTS_SEED_FILE): StoredProduct[] {
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as unknown[];
  return raw.map((r) => productsCollection.parse(r)).filter((p): p is StoredProduct => p !== null);
}

/** Fields the Products pages added to the catalogue. A migration fills these in on existing records, only where they are still empty. */
export const PRODUCT_PAGE_FIELDS = [
  "shortName", "valueLine", "pitch", "overview", "outcome", "facts", "features", "aiFeatures", "benefits", "useCases",
  "automationWorkflows", "integrations", "scenarios", "faq", "audience",
  // round 2: "The problem it solves"
  "problemIntro", "problems", "beforeAfter",
] as const;

const isEmpty = (v: unknown) => v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

/** `current` with any empty page field taken from `seed`; null when nothing needed filling. Never changes a field that has content. */
export function fillProductPageFields(current: Record<string, unknown>, seed: Record<string, unknown>): Record<string, unknown> | null {
  const out = { ...current };
  let changed = false;
  for (const k of PRODUCT_PAGE_FIELDS) {
    if (isEmpty(out[k]) && !isEmpty(seed[k])) {
      out[k] = seed[k];
      changed = true;
    }
  }
  return changed ? out : null;
}

/** The Products entry of the header navigation, built from the seed catalogue. */
export const seedProductsNav = (products = loadSeedProducts()) => buildProductsNav(products);

export const PRODUCTS_FOOTER_LINK = { label: "Products", href: PRODUCTS_PATH, emphasized: true } as const;
