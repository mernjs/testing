import type { Metadata } from "next";
import TravelContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Travel Software Development | YashOrbit";
const description =
  "Custom Travel technology — multi-supplier booking engines, itinerary platforms, and disruption-ready travel management tools built for real-world travel chaos.";
const path = "/industries/travel";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function TravelPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Travel", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <TravelContent />
    </>
  );
}
