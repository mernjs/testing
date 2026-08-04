import type { Metadata } from "next";
import ProductsContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

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

export default function ProductsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <ProductsContent />
    </>
  );
}
