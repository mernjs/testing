import type { Metadata } from "next";
import AIJobBoardPortalContent, { aiJobBoardPortalFaqs } from "./Content";
import { socialMetadata, softwareApplicationJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "AI Job Board Portal — Job Listings, ATS & AI Matching | YashOrbit";
const description =
  "A full-featured job portal with an integrated ATS, subscription-based employer plans, and OpenAI-powered job matching and resume parsing.";
const path = "/products/ai-job-board-portal";

const image = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["AI Job Board Portal", "Integrated ATS", "Job Board", "OpenAI Powered", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AIJobBoardPortalPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "AI Job Board Portal", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "AI Job Board Portal", path },
    ]),
    faqJsonLd(aiJobBoardPortalFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AIJobBoardPortalContent />
    </>
  );
}
