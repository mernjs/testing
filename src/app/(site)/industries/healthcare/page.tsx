import type { Metadata } from "next";
import HealthcareContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Healthcare Software Development | YashOrbit";
const description =
  "Custom Healthcare technology — patient portals, telehealth platforms, and clinical decision tools engineered for HIPAA compliance and HL7/FHIR interoperability.";
const path = "/industries/healthcare";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function HealthcarePage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Healthcare", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <HealthcareContent />
    </>
  );
}
