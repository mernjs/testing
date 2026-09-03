import type { Metadata } from "next";
import EcommerceContent from "./Content";
import { ecommerceFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Ecommerce Software Development | YashOrbit";
const description =
  "Custom Ecommerce development — high-performance storefronts, headless commerce, and checkout systems engineered to convert traffic into revenue at scale.";
const path = "/industries/ecommerce";

const image = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Ecommerce Software Development", "Headless Commerce", "One-page Checkout", "Peak-traffic Ready", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function EcommercePage() {
  const jsonLd = [
    serviceJsonLd({ name: "E-Commerce Software Development", description, path, category: "E-Commerce & Retail Technology" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Ecommerce", path },
    ]),
    faqJsonLd(ecommerceFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <EcommerceContent />
    </>
  );
}
