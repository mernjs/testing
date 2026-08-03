import type { Metadata } from "next";
import TechnologiesContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Technologies | YashOrbit";
const description =
  "Explore the frontend, backend, mobile, AI, cloud, and data technologies YashOrbit uses to design, build, and ship production software.";
const path = "/about/technologies";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function TechnologiesPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Technologies", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <TechnologiesContent />
    </>
  );
}
