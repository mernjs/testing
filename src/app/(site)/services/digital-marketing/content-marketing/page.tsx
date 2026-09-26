import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import ContentMarketingContent from "./Content";
import { contentMarketingFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Content Marketing Services | YashOrbit Digital Marketing";
const description =
  "Create valuable, search-friendly, and conversion-focused content that builds authority, attracts your target audience, and drives long-term business growth.";
const path = "/services/digital-marketing/content-marketing";
const image = "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["Content Marketing", "SEO Content", "Blog Writing", "Content Strategy", "Thought Leadership", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides(path, baseMetadata);

export default function ContentMarketingPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Content Marketing", description, path, category: "Digital Marketing" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Digital Marketing", path: "/digital-marketing" },
      { name: "Content Marketing", path },
    ]),
    faqJsonLd(contentMarketingFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ContentMarketingContent />
    </>
  );
}
