import { ImageResponse } from "next/og";
import { getCompanyBrand } from "@/lib/platform/branding";
import { getActiveThemeState } from "@/lib/cms/theme";
import { brandInitials } from "@/lib/platform/branding/types";
import { companySiteUrl } from "@/lib/platform/tenancy/site-url";

/**
 * The browser-tab / home-screen icon of the CURRENT company: its own logo when
 * it has one, else its initials on the active theme's primary colour.
 */
export async function renderCompanyIcon(size: number): Promise<ImageResponse> {
  const [brand, { tokens }] = await Promise.all([getCompanyBrand(), getActiveThemeState()]);
  const logo = brand.logoUrl ? new URL(brand.logoUrl, await companySiteUrl()).toString() : null;
  const c = tokens.colors;
  return new ImageResponse(
    logo ? (
      <img src={logo} width={size} height={size} style={{ objectFit: "contain" }} />
    ) : (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: c.primary, color: c.primaryForeground, fontSize: Math.round(size * 0.46), fontWeight: 800, borderRadius: Math.round(size * 0.22) }}>
        {brandInitials(brand.name || `${brand.namePrimary} ${brand.nameAccent}`) || "•"}
      </div>
    ),
    { width: size, height: size }
  );
}
