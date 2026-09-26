import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import CroContent from "./Content";
import { croFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Conversion Rate Optimization (CRO) Services | YashOrbit";
const description =
  "Turn more website visitors into customers by identifying conversion barriers and continuously optimizing user journeys through A/B testing and UX analytics.";
const path = "/services/digital-marketing/conversion-rate-optimization";
const image = "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Conversion Rate Optimization", "CRO Services", "A/B Testing", "Funnel Optimization", "UX Audit", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function CroPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Conversion Rate Optimization", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Conversion Rate Optimization", path },
    ]),
    faqJsonLd(croFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CroContent />
    </>
  );
}
