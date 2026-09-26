import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import LocalDigitalMarketingContent from "./Content";
import { localDigitalMarketingFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Local Digital Marketing Services | YashOrbit";
const description =
  "Dominate local search, optimize your Google Business Profile, and attract nearby customers with targeted local SEO and digital marketing.";
const path = "/services/digital-marketing/local-digital-marketing";
const image = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Local Digital Marketing", "Local SEO", "Google Business Profile", "Local Citations", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function LocalDigitalMarketingPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Local Digital Marketing", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Local Digital Marketing", path },
    ]),
    faqJsonLd(localDigitalMarketingFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <LocalDigitalMarketingContent />
    </>
  );
}
