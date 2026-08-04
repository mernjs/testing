import type { Metadata } from "next";
import TechnologiesContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Technologies | YashOrbit";
const description =
  "Explore the frontend, backend, mobile, AI, cloud, and data technologies YashOrbit uses to design, build, and ship production software.";
const path = "/about/technologies";

const image = "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Technologies", "14 Categories", "Production-tested", "AI-native", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
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
