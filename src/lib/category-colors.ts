import type { CategorySlug } from "@/lib/categories";

export interface ThemedColor {
  light: string;
  dark: string;
}

/**
 * Fixed-order categorical palette (dataviz-skill validated: CVD Delta E >= 8,
 * normal-vision Delta E >= 15 on adjacent pairs, both light AND dark steps
 * validated against their respective surfaces). Used only for charts/cards
 * that compare categories against each other — single-series charts keep the
 * existing brand-orange treatment.
 */
export const CATEGORY_CHART_COLORS: Record<CategorySlug, ThemedColor> = {
  "software-development": { light: "#2a78d6", dark: "#3987e5" },
  "ai-automations": { light: "#eb6834", dark: "#d95926" },
  "industrial-training": { light: "#1baf7a", dark: "#199e70" },
  "resource-augmentation": { light: "#eda100", dark: "#c98500" },
  "internship-program": { light: "#e87ba4", dark: "#d55181" },
};
