/**
 * The catalogue of component variants a theme can choose between, per slot
 * (header, footer, and each section type that has alternates). Metadata only
 * — no components — so it's safe to import from server code, client code and
 * the admin UI alike. The components behind each key live in
 * `theme-components.ts` (sections) and `(site)/layout.tsx` (header/footer).
 *
 * A variant is code (it's a component), but which variant each theme uses is
 * CMS data (`cms_theme.components`), chosen in the theme editor. Every slot's
 * first entry is "default" — the site's standard component — and anything
 * unselected or unknown falls back to it.
 */

export interface VariantOption {
  key: string;
  label: string;
  description: string;
}

export interface ThemeComponentSelections {
  header?: string;
  footer?: string;
  /** Section type -> variant key. */
  sections?: Record<string, string>;
}

export const HEADER_VARIANTS: VariantOption[] = [
  { key: "default", label: "Standard", description: "Full navigation bar with dropdown menus on desktop." },
  { key: "menu", label: "Menu only", description: "Logo and a menu button at every screen size; navigation opens in a side panel." },
];

export const FOOTER_VARIANTS: VariantOption[] = [
  { key: "default", label: "Standard", description: "Call-to-action band, company details, social links and link columns." },
  { key: "compact", label: "Compact", description: "Slim footer: logo, contact, link columns and a small bottom bar." },
];

export const SECTION_VARIANTS: Record<string, VariantOption[]> = {
  "page-hero": [
    { key: "default", label: "Standard", description: "Split hero with photo card and floating badges." },
    { key: "terminal", label: "Terminal", description: "Centered dark hero on a grid, with code-style breadcrumbs and badge." },
  ],
};

const known = (options: VariantOption[], key: string | undefined) => (key && options.some((o) => o.key === key) ? key : "default");

/** Drops unknown keys so a stale or hand-edited selection can never reference a variant that doesn't exist. */
export function normalizeSelections(raw: ThemeComponentSelections | undefined | null): Required<ThemeComponentSelections> {
  const sections: Record<string, string> = {};
  for (const [type, options] of Object.entries(SECTION_VARIANTS)) {
    const key = known(options, raw?.sections?.[type]);
    if (key !== "default") sections[type] = key;
  }
  return { header: known(HEADER_VARIANTS, raw?.header), footer: known(FOOTER_VARIANTS, raw?.footer), sections };
}
