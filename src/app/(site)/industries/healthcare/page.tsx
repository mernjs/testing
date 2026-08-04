import type { Metadata } from "next";
import HealthcareContent from "./Content";
import { healthcareFaqs } from "./faqs";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Healthcare Software Development | YashOrbit";
const description =
  "Custom Healthcare technology — patient portals, telehealth platforms, and clinical decision tools engineered for HIPAA compliance and HL7/FHIR interoperability.";
const path = "/industries/healthcare";

const image = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Healthcare Software Development", "HIPAA Compliant", "Telehealth Platforms", "EHR Integration", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function HealthcarePage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Healthcare", path },
    ]),
    faqJsonLd(healthcareFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <HealthcareContent />
    </>
  );
}
