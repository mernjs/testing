import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import SeoServicesContent from "./Content";
import { seoFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "SEO Services | YashOrbit Digital Marketing";
const description =
  "Improve your search visibility, attract qualified organic traffic, and build long-term online growth with a comprehensive SEO strategy — technical SEO, on-page, off-page, local, and e-commerce SEO.";
const path = "/services/digital-marketing/seo";
const image = "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["SEO Services", "Technical SEO", "On-Page SEO", "Off-Page SEO", "Local SEO", "Link Building", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function SeoServicesPage() {
  const jsonLd = [
    serviceJsonLd({ name: "SEO Services", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "SEO Services", path },
    ]),
    faqJsonLd(seoFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SeoServicesContent />
    </>
  );
}
