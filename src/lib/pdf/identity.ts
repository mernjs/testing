import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import type { ReactElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDF_ORG, PDF_ORG_CONTACT, loadPdfLogo } from "@/lib/pdf/brand";
import { isPlatformOwnerContext } from "@/lib/platform/tenancy/context";
import { getCompanyBrand } from "@/lib/platform/branding";
import { getCompanyDetails } from "@/lib/hrms/company";
import { LOGO_ROUTE, readCompanyLogo } from "@/lib/platform/branding/logo";

/**
 * Whose letterhead a generated PDF carries. Resolved per company before
 * rendering and held in an AsyncLocalStorage scope around the render (React
 * `createContext` isn't allowed in server code), so every document component
 * reads the CURRENT company's name, address and logo — never a hard-coded one.
 */
export interface PdfIdentity {
  name: string;
  legalName: string;
  addressLine: string;
  cityLine: string;
  /** `email · phone · website` */
  contactLine: string;
  /** Two-tone wordmark next to the logo. */
  wordPrimary: string;
  wordAccent: string;
  /** Small caps line under the wordmark (e.g. "TECHNOLOGIES PVT. LTD."), or "". */
  capsLine: string;
  /** Logo as a data URI, or null for text-only. */
  logo: string | null;
}

/** The platform owner's letterhead — exactly what every PDF printed before multi-tenancy. */
function ownerIdentity(): PdfIdentity {
  return {
    name: PDF_ORG.name,
    legalName: PDF_ORG.legalName,
    addressLine: PDF_ORG.addressLine,
    cityLine: PDF_ORG.cityLine,
    contactLine: PDF_ORG_CONTACT,
    wordPrimary: "Yash",
    wordAccent: "Orbit",
    capsLine: "TECHNOLOGIES PVT. LTD.",
    logo: loadPdfLogo(),
  };
}

const pdfIdentityScope = new AsyncLocalStorage<PdfIdentity>();

/** The letterhead identity of the PDF being rendered (by `renderPdf`). */
export function usePdfIdentity(): PdfIdentity {
  const identity = pdfIdentityScope.getStore();
  if (!identity) throw new Error("PDF rendered without an identity — render it with renderPdf()");
  return identity;
}

/** The company's uploaded logo as a data URI (react-pdf embeds it). Null → the PDF renders text-only. */
async function logoDataUri(url: string | null): Promise<string | null> {
  if (!url?.startsWith(LOGO_ROUTE)) return null;
  const logo = await readCompanyLogo(url.slice(LOGO_ROUTE.length)).catch(() => null);
  // react-pdf embeds PNG and JPEG only.
  if (!logo || !/^image\/(png|jpeg)$/.test(logo.contentType)) return null;
  return `data:${logo.contentType};base64,${logo.body.toString("base64")}`;
}

export async function resolvePdfIdentity(): Promise<PdfIdentity> {
  const brand = await getCompanyBrand();
  if ((await isPlatformOwnerContext()) && !brand.logoUrl) return ownerIdentity();
  const c = await getCompanyDetails();
  return {
    name: c.name || brand.name,
    legalName: c.legalName || c.name || brand.name,
    addressLine: [c.addressLine1, c.addressLine2].filter((s) => s?.trim()).join(", "),
    cityLine: [c.city, c.state, c.postalCode].filter((s) => s?.trim()).join(", "),
    contactLine: [c.email, c.phone, c.website?.replace(/^https?:\/\//, "")].filter((s) => s?.trim()).join("  ·  "),
    wordPrimary: brand.namePrimary,
    wordAccent: brand.nameAccent,
    capsLine: "",
    logo: await logoDataUri(brand.logoUrl),
  };
}

/**
 * `renderToBuffer`, with the current company's letterhead identity provided. Use for every PDF.
 * `override` replaces parts of that identity for documents whose issuer isn't
 * the company as set up in HRMS (e.g. SaaS invoices print the platform's
 * billing-settings seller details).
 */
export async function renderPdf(document: ReactElement, override?: Partial<PdfIdentity>): Promise<Buffer> {
  const identity = { ...(await resolvePdfIdentity()), ...override };
  return pdfIdentityScope.run(identity, () => renderToBuffer(document as Parameters<typeof renderToBuffer>[0]) as Promise<Buffer>);
}
