import type { Metadata } from "next";
import AIMLSolutionsContent from "./Content";
import { siteUrl, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI/ML Solutions Services | YashOrbit";
const description =
  "Custom machine learning solutions — predictive models, NLP, and recommendation engines designed, trained, and deployed with production-grade MLOps.";
const path = "/services/ai-ml-solutions";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function AIMLSolutionsPage() {
  const jsonLd = [
    serviceJsonLd({ name: "AI/ML Solutions", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "AI/ML Solutions", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AIMLSolutionsContent />
    </>
  );
}
