import type { Metadata } from "next";
import DesktopAppDevelopmentContent from "./Content";
import { desktopAppDevelopmentFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Desktop App Development Services | YashOrbit";
const description =
  "Cross-platform and native desktop application development with Electron, Tauri, and .NET — offline-first, auto-updating software for Windows, macOS, and Linux.";
const path = "/services/desktop-app-development";

const image = "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Desktop App Development Services", "Cross-Platform", "Auto-Updating", "Native Performance", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function DesktopAppDevelopmentPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Desktop App Development", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Desktop App Development", path },
    ]),
    faqJsonLd(desktopAppDevelopmentFaqs),
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
