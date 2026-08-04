import type { Metadata } from "next";
import EducationContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Education Software Development | YashOrbit";
const description =
  "Custom Education technology — LMS platforms, live classrooms, adaptive learning, and analytics engineered for engagement, accessibility, and FERPA/COPPA compliance.";
const path = "/industries/education";

const image = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Education Software Development", "LMS Platforms", "Live Classrooms", "Adaptive Learning", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function EducationPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Education", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <EducationContent />
    </>
  );
}
