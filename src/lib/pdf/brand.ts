import "server-only";
import fs from "node:fs";
import path from "node:path";
import { organizationInfo, siteUrl } from "@/lib/seo";

/**
 * Shared brand constants for every generated PDF (payslips, invoices, purchase
 * orders, receipts, reports, certificates). Import these instead of redefining
 * colours / logo loaders per document so every PDF looks like the same
 * letterhead. Pairs with `src/lib/pdf/layout.tsx`.
 *
 * Server-only — the logo loader reads from disk.
 */

export const PDF_COLORS = {
  navy: "#1D428A",
  coral: "#E56043",
  ink: "#1f2937",
  mute: "#6b7280",
  line: "#e2e8f0",
  soft: "#f4f6fb",
  white: "#ffffff",
  gold: "#b8860b",
} as const;

/**
 * The one canonical company identity printed on every PDF letterhead. Derived
 * from `organizationInfo` (`src/lib/seo.ts`) so it stays in sync with the rest
 * of the site. Per-panel settings still drive signatory names, statutory
 * numbers and doc-specific notes — but never the name/address block.
 */
const addr = organizationInfo.address;
export const PDF_ORG = {
  name: organizationInfo.name,
  legalName: organizationInfo.legalName,
  addressLine: addr.streetAddress,
  cityLine: [addr.addressLocality, addr.addressRegion, addr.postalCode].filter(Boolean).join(", "),
  email: organizationInfo.email,
  phone: organizationInfo.telephone,
  website: siteUrl.replace(/^https?:\/\//, ""),
  tagline: "Tech Solutions Built Around Your Business",
} as const;

/** `email · phone · website` — the single contact line under the address. */
export const PDF_ORG_CONTACT = [PDF_ORG.email, PDF_ORG.phone, PDF_ORG.website].filter(Boolean).join("  ·  ");

/** Shared numeric tokens so spacing / sizing is identical across every document. */
export const PDF_TYPO = {
  pagePadding: 40,
  pagePaddingLandscape: 30,
  baseFont: 9.5,
  logoIcon: 26,
  logoIconCompact: 22,
  wordmark: 15,
  wordmarkCompact: 12,
  rule: 2,
  accentWidth: 90,
  title: 16,
  titleLandscape: 14,
  sectionTitle: 9,
  footer: 7.5,
} as const;

let logoCache: string | null | undefined;

/**
 * Cached base64 data-URI for the transparent brand icon
 * (`public/brand/icon-transparent.png`). Returns `null` if the file can't be
 * read so the caller can render text-only. Extracted from the 5 copies of this
 * helper that used to live in each PDF component.
 */
export function loadPdfLogo(): string | null {
  if (logoCache !== undefined) return logoCache ?? null;
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public/brand/icon-transparent.png"));
    logoCache = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    logoCache = null;
  }
  return logoCache;
}
