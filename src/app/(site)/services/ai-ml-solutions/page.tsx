import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import AIMLSolutionsContent from "./Content";
import { aiMlSolutionsFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "AI/ML Solutions Services | YashOrbit";
const description =
  "Custom machine learning solutions — predictive models, NLP, and recommendation engines designed, trained, and deployed with production-grade MLOps.";
const path = "/services/ai-ml-solutions";

const image = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: ["AI/ML Solutions Services", "Custom Models", "AI Powered", "Production-Grade", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export const generateMetadata = () => withSeoOverrides("/services/ai-ml-solutions", baseMetadata);

export default function AIMLSolutionsPage() {
  const jsonLd = [
    serviceJsonLd({ name: "AI/ML Solutions", description, path, category: "AI & Machine Learning" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "AI/ML Solutions", path },
    ]),
    faqJsonLd(aiMlSolutionsFaqs),
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
