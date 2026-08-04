import type { Metadata } from "next";
import InsuranceContent from "./Content";
import { insuranceFaqs } from "./faqs";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Insurance Software Development | YashOrbit";
const description =
  "Custom Insurance technology — automated underwriting, digital claims platforms, and policyholder portals built to speed up processing without cutting corners on risk.";
const path = "/industries/insurance";

const image = "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Insurance Software Development", "Automated Underwriting", "Digital Claims", "Fraud Detection", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function InsurancePage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Insurance", path },
    ]),
    faqJsonLd(insuranceFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <InsuranceContent />
    </>
  );
}
