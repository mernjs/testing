import type { Metadata } from "next";
import SoftwareDevelopmentContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

const title = "Software Development — Web, Mobile & Cloud Engineering | YashOrbit";
const description =
  "Custom web app development, mobile applications, desktop software, AI agents, AI/ML solutions, vision intelligence, prediction & forecasting, and AR/VR — engineered for scale by YashOrbit Technologies.";
const path = "/software-development";
const image = "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit software development",
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

export default function SoftwareDevelopmentPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Software Development", path },
  ]);

  const service = serviceJsonLd({
    name: "Software Development",
    description,
    path,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <SoftwareDevelopmentContent />
    </>
  );
}
