import type { Metadata } from "next";
import AIJobBoardPortalContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI Job Board Portal — Job Listings, ATS & AI Matching | YashOrbit";
const description =
  "A full-featured job portal with an integrated ATS, subscription-based employer plans, and OpenAI-powered job matching and resume parsing.";
const path = "/products/ai-job-board-portal";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function AIJobBoardPortalPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "AI Job Board Portal", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "AI Job Board Portal", path },
    ]),
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
