import type { Metadata } from "next";
import AIConstructionPlatformContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI Construction Platform — AI Document Analyzer & RAG Chat | YashOrbit";
const description =
  "An AI-powered construction web app with subscription-based access, an AI document analyzer, and a RAG-based AI chat for project teams.";
const path = "/products/ai-construction-platform";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
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
