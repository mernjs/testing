import type { Metadata } from "next";
import EducationContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Education Software Development | YashOrbit";
const description =
  "Custom Education technology — LMS platforms, live classrooms, adaptive learning, and analytics engineered for engagement, accessibility, and FERPA/COPPA compliance.";
const path = "/industries/education";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
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
