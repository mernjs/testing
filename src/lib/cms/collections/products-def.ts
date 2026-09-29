import type { ProductItem } from "@/types/content";
import { str, bool, strArr, objArr, record } from "@/lib/cms/parse-helpers";
import { resolveIcon } from "@/lib/cms/icon-map";
import { slugOf, TITLE_DESC } from "./defs";
import type { CollectionDef } from "./types";

/**
 * SaaS products — its own module (not in `defs.ts`) so the large product
 * catalogue only ships to the one page that shows it, not to every page
 * that renders CMS sections.
 */

type StoredProduct = Omit<ProductItem, "icon">;
const PRODUCT_CATEGORY_OPTIONS = ["Executive & Operations", "HR & Talent", "Project & Delivery", "Procurement & Finance", "Sales & Marketing", "AI & Intelligence", "Assessment & Security"] as const;

export const productsCollection: CollectionDef<StoredProduct, ProductItem> = {
  key: "products",
  label: "SaaS Products",
  singular: "Product",
  // Products open in a modal on /services/our-saas-product — no page of their own.
  parse: (raw) => {
    const r = record(raw);
    const slug = slugOf(r.slug);
    const name = str(r.name, 120);
    if (!slug || !name) return null;
    const category = (PRODUCT_CATEGORY_OPTIONS as readonly string[]).includes(r.category as string) ? (r.category as ProductItem["category"]) : "AI & Intelligence";
    const p: StoredProduct = {
      id: str(r.id, 120) || slug,
      slug,
      name,
      badge: str(r.badge, 60),
      tagline: str(r.tagline, 200),
      category,
      panelPath: str(r.panelPath, 200),
      iconName: str(r.iconName, 60) || "Sparkles",
      shortDescription: str(r.shortDescription, 600),
      fullDescription: str(r.fullDescription, 3000),
      primaryPurpose: str(r.primaryPurpose, 1000),
      problemSolved: str(r.problemSolved, 1000),
      businessOutcome: str(r.businessOutcome, 1000),
      targetDepartments: strArr(r.targetDepartments, 20, 80),
      targetUsers: strArr(r.targetUsers, 20, 80),
      aiCapabilities: strArr(r.aiCapabilities, 20, 300),
      keyFeatures: objArr(r.keyFeatures, (x) => {
        const o = record(x);
        const t = str(o.title, 160);
        return t ? ({ ...o, title: t, description: str(o.description, 1000) } as ProductItem["keyFeatures"][number]) : null;
      }, 30),
      metrics: objArr(r.metrics, (x) => {
        const o = record(x);
        const label = str(o.label, 80);
        return label ? { label, value: str(o.value, 40) } : null;
      }, 12),
      // Screens & hotspots drive the interactive mockup; kept as authored (validated shallowly).
      screens: Array.isArray(r.screens) ? (r.screens as ProductItem["screens"]) : [],
      hotspots: Array.isArray(r.hotspots) ? (r.hotspots as ProductItem["hotspots"]) : [],
      accentColor: str(r.accentColor, 200),
    };
    // Keep an explicit `false` too — the built-in catalogue sets it on some products.
    if (typeof r.isFeatured === "boolean") p.isFeatured = r.isFeatured;
    return p;
  },
  toRuntime: (r) => ({ ...r, icon: resolveIcon(r.iconName) }),
  titleOf: (r) => r.name,
  fields: [
    { key: "name", label: "Name", kind: "text" },
    { key: "badge", label: "Badge", kind: "text" },
    { key: "tagline", label: "Tagline", kind: "text" },
    { key: "category", label: "Category", kind: "select", options: [...PRODUCT_CATEGORY_OPTIONS] },
    { key: "iconName", label: "Icon", kind: "icon" },
    { key: "panelPath", label: "Product panel link", kind: "text" },
    { key: "isFeatured", label: "Featured", kind: "boolean" },
    { key: "shortDescription", label: "Short description", kind: "textarea" },
    { key: "fullDescription", label: "Full description", kind: "textarea" },
    { key: "primaryPurpose", label: "Primary purpose", kind: "textarea" },
    { key: "problemSolved", label: "Problem solved", kind: "textarea" },
    { key: "businessOutcome", label: "Business outcome", kind: "textarea" },
    { key: "targetDepartments", label: "Target departments", kind: "list" },
    { key: "targetUsers", label: "Target users", kind: "list" },
    { key: "aiCapabilities", label: "AI capabilities", kind: "list" },
    { key: "keyFeatures", label: "Key features", kind: "items", fields: TITLE_DESC },
    { key: "metrics", label: "Metrics", kind: "items", fields: [{ key: "label", label: "Label", kind: "text" }, { key: "value", label: "Value", kind: "text" }] },
    { key: "accentColor", label: "Accent colour classes", kind: "text" },
  ],
  blank: (slug) => ({ id: slug, slug, name: "", badge: "", tagline: "", category: "AI & Intelligence", panelPath: "", iconName: "Sparkles", shortDescription: "", fullDescription: "", primaryPurpose: "", problemSolved: "", businessOutcome: "", targetDepartments: [], targetUsers: [], aiCapabilities: [], keyFeatures: [], metrics: [], screens: [], hotspots: [], accentColor: "" }),
};

