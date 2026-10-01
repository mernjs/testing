import "server-only";
import { notFound } from "next/navigation";
import { getRecords } from "@/lib/cms/collections/store";
import { isPlatformOwnerContext } from "@/lib/platform/tenancy/context";
import { getSiteInfo } from "@/lib/cms/site-info";
import { getPublicPage } from "@/lib/cms/public";
import { resolveProductsText } from "@/lib/products/text";
import { isProductsHref, type StoredProduct } from "@/lib/products/shared";
import screenshotManifest from "../../../public/products/manifest.json";

/**
 * Products are the platform owner's OWN marketing content: they exist only on
 * the owner's site. Every public entry point goes through `requireProductsSite()`
 * / `loadProducts()`, so a tenant's host gets a 404 and never reads (or leaks
 * through a fallback) any YashOrbit product data.
 */

/** 404 unless this request is on the platform owner's site. */
export async function requireProductsSite(): Promise<void> {
  if (!(await isPlatformOwnerContext())) notFound();
}

/** Real screenshots written by scripts/capture-product-screenshots.mjs: { [slug]: [{ src, alt, caption }] }. */
const MANIFEST = screenshotManifest as Record<string, { src: string; alt: string; caption: string }[]>;

/** Adds captured screenshots to products that have none authored in the CMS. Pure, exported for tests. */
export function withManifestScreenshots(products: StoredProduct[], manifest: Record<string, { src: string; alt: string; caption: string }[]> = MANIFEST): StoredProduct[] {
  return products.map((p) => (p.screenshots?.length || !manifest[p.slug]?.length ? p : { ...p, screenshots: manifest[p.slug] }));
}

/**
 * The published products, in catalogue order. Returns `null` (not an empty
 * list) off the owner's site, so callers cannot mistake "not available here"
 * for "no products".
 */
export async function loadProducts(): Promise<StoredProduct[] | null> {
  if (!(await isPlatformOwnerContext())) return null;
  const records = (await getRecords("products")) as StoredProduct[];
  return withManifestScreenshots(records);
}

/** Like `loadProducts()` but a 404 off the owner's site. */
export async function requireProducts(): Promise<StoredProduct[]> {
  const products = await loadProducts();
  if (!products) notFound();
  return products;
}

export async function requireProduct(slug: string): Promise<{ product: StoredProduct; all: StoredProduct[] }> {
  const all = await requireProducts();
  const product = all.find((p) => p.slug === slug);
  if (!product) notFound();
  return { product, all };
}

/** The site's text dictionary for the Products pages: code defaults overlaid with CMS → Site Identity text. */
export async function getProductsText(): Promise<Record<string, string>> {
  return resolveProductsText((await getSiteInfo()).text);
}

/** Removes Products items from a header/footer list unless this is the owner's site (defence in depth for migrated/copied navigation). */
export async function dropProductsLinks<T extends { href: string }>(items: T[]): Promise<T[]> {
  return (await isPlatformOwnerContext()) ? items : items.filter((i) => !isProductsHref(i.href));
}

/**
 * The wording the interactive preview (`ProductMockup`) reads (`catalog.productMockup.*`). It lives in the catalogue
 * page's section config, so it is read from there — only those keys, to keep the page payload small.
 */
export async function getMockupText(): Promise<Record<string, string>> {
  const page = await getPublicPage("/services/our-saas-product");
  const section = page?.sections.find((s) => s.type === "saas-product-catalog");
  const dict = (section?.config as { text?: Record<string, string> } | undefined)?.text ?? {};
  return Object.fromEntries(Object.entries(dict).filter(([k]) => k.startsWith("catalog.productMockup.")));
}
