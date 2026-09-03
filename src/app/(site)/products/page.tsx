import type { Metadata } from "next";
import ProductsContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, siteUrl } from "@/lib/seo";

const title = "Our Products — AI Platforms & Software Solutions | YashOrbit";
const description =
  "Explore YashOrbit's proprietary products: an AI construction platform, smart spam filter, AI voice assistant, predictive analytics engine, image recognition system, and AI job board portal.";
const path = "/products";
const image = "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit products",
    "AI construction platform",
    "smart spam filter",
    "AI voice assistant",
    "predictive analytics engine",
    "image recognition system",
    "AI job board portal",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

const productsList = [
  { name: "AI Construction Platform", path: "/products/ai-construction-platform" },
  { name: "Smart Spam Filter", path: "/products/smart-spam-filter" },
  { name: "AI Voice Assistant", path: "/products/ai-voice-assistant" },
  { name: "Predictive Analytics Engine", path: "/products/predictive-analytics-engine" },
  { name: "Image Recognition System", path: "/products/image-recognition-system" },
  { name: "AI Job Board Portal", path: "/products/ai-job-board-portal" },
];

export default function ProductsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "YashOrbit Software Products",
      description,
      url: `${siteUrl}${path}`,
      numberOfItems: productsList.length,
      itemListElement: productsList.map((prod, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}${prod.path}`,
        name: prod.name,
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ProductsContent />
    </>
  );
}
