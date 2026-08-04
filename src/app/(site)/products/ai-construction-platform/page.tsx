import type { Metadata } from "next";
import AIConstructionPlatformContent from "./Content";
import { socialMetadata, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI Construction Platform — AI Document Analyzer & RAG Chat | YashOrbit";
const description =
  "An AI-powered construction web app with subscription-based access, an AI document analyzer, and a RAG-based AI chat for project teams.";
const path = "/products/ai-construction-platform";

const image = "https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["AI Construction Platform", "AI Document Analyzer", "RAG AI Chat", "Subscriptions", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AIConstructionPlatformPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "AI Construction Platform", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "AI Construction Platform", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AIConstructionPlatformContent />
    </>
  );
}
