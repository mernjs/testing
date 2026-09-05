import type { CategorySlug } from "@/lib/categories";

export interface ThemedColor {
  light: string;
  dark: string;
}

/**
 * Fixed-order categorical ramp built only from the YashOrbit brand palette —
 * blue -> coral -> coral-light -> blue-light -> slate — so category-comparison
 * charts match the rest of the admin panel. Distinct enough to read apart at a
 * glance; single-series charts keep the plain brand-coral treatment.
 */
export const CATEGORY_CHART_COLORS: Record<CategorySlug, ThemedColor> = {
  "software-development": { light: "#1D428A", dark: "#3b6fd4" },
  "ai-automations": { light: "#E56043", dark: "#E56043" },
  "industrial-training": { light: "#ff8e75", dark: "#ff8e75" },
  "resource-augmentation": { light: "#7ba0d9", dark: "#5f84c2" },
  "internship-program": { light: "#94a3b8", dark: "#94a3b8" },
};
