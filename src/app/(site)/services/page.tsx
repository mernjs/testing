import type { Metadata } from "next";
import ServicesContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Our Services — Web, Mobile & AI Development | YashOrbit";
const description =
  "Custom web, mobile, and desktop app development, AI agents, AI/ML solutions, vision intelligence, prediction & forecasting, and AR/VR — engineered for scale.";
const path = "/services";
const image = "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit services",
    "web app development",
    "mobile app development",
    "desktop app development",
    "AI agent development",
    "AI/ML solutions",
    "vision intelligence",
    "prediction and forecasting",
    "AR/VR development",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ServicesPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <ServicesContent />
    </>
  );
}
