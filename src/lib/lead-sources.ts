// The two forms that actually create leads set exactly these values —
// kept centralized so the filter dropdown can't drift from what's real.
export const LEAD_SOURCES = [
  { value: "contact-page", label: "Contact Page" },
  { value: "homepage-hero", label: "Homepage Hero" },
] as const;
