import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import EcommerceMarketingContent from "./Content";
import { ecommerceMarketingFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "E-commerce Marketing Services | YashOrbit";
const description =
  "Increase product visibility, store traffic, conversions, and customer retention with comprehensive e-commerce marketing strategies.";
const path = "/services/digital-marketing/ecommerce-marketing";
const image = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Ecommerce Marketing", "Google Shopping Ads", "Shopify Marketing", "Cart Recovery", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function EcommerceMarketingPage() {
  const jsonLd = [
    serviceJsonLd({ name: "E-commerce Marketing", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "E-commerce Marketing", path },
    ]),
    faqJsonLd(ecommerceMarketingFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <EcommerceMarketingContent />
    </>
  );
}
