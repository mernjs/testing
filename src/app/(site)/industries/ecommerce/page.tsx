import type { Metadata } from "next";
import EcommerceContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Ecommerce Software Development | YashOrbit";
const description =
  "Custom Ecommerce development — high-performance storefronts, headless commerce, and checkout systems engineered to convert traffic into revenue at scale.";
const path = "/industries/ecommerce";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function EcommercePage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Ecommerce", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <EcommerceContent />
    </>
  );
}
