import type { ComponentType } from "react";
import AIPageHero from "@/components/sections/ai-theme/AIPageHero";
import { SECTION_REGISTRY } from "@/lib/cms/section-registry";

/**
 * Section type -> variant key -> alternate renderer, for the variants listed
 * in `component-variants.ts`. Which variant a theme uses is CMS data
 * (`cms_theme.components.sections`), not code. "default" (or anything
 * unmapped) is the base `SECTION_REGISTRY[type].Renderer`.
 * `config.parse`/`toProps` always stay on the base registry entry; only
 * which component renders the resolved props differs.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SECTION_VARIANT_RENDERERS: Record<string, Record<string, ComponentType<any>>> = {
  "page-hero": { terminal: AIPageHero },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveSectionRenderer(type: string, variantKey?: string): ComponentType<any> | null {
  return (variantKey ? SECTION_VARIANT_RENDERERS[type]?.[variantKey] : undefined) ?? SECTION_REGISTRY[type]?.Renderer ?? null;
}
