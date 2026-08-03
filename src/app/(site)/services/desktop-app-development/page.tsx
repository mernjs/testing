import type { Metadata } from "next";
import DesktopAppDevelopmentContent from "./Content";
import { siteUrl, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Desktop App Development Services | YashOrbit";
const description =
  "Cross-platform and native desktop application development with Electron, Tauri, and .NET — offline-first, auto-updating software for Windows, macOS, and Linux.";
const path = "/services/desktop-app-development";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function DesktopAppDevelopmentPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Desktop App Development", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Desktop App Development", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <DesktopAppDevelopmentContent />
    </>
  );
}
