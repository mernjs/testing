import "server-only";
import type { Metadata } from "next";
import { getCompanyBrand } from "@/lib/platform/branding";

/**
 * Page metadata whose title carries the current company's name — `{brand}`
 * in the title is replaced per request ("Attendance · {brand} Portal" →
 * "Attendance · Acme Labs Portal"). Use as
 * `export const generateMetadata = () => brandedMetadata("…", { robots })`.
 */
export async function brandedMetadata(title: string, extra: Omit<Metadata, "title"> = {}): Promise<Metadata> {
  const { name } = await getCompanyBrand();
  return { ...extra, title: title.replaceAll("{brand}", name).replace(/\s{2,}/g, " ").replace(/^ · | · $/g, "").trim() };
}
