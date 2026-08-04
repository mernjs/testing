import type { Metadata } from "next";
import TravelContent, { travelFaqs } from "./Content";
import { socialMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Travel Software Development | YashOrbit";
const description =
  "Custom Travel technology — multi-supplier booking engines, itinerary platforms, and disruption-ready travel management tools built for real-world travel chaos.";
const path = "/industries/travel";

const image = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Travel Software Development", "Multi-supplier Booking", "Disruption Handling", "Unified Itineraries", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function TravelPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: "Travel", path },
    ]),
    faqJsonLd(travelFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <TravelContent />
    </>
  );
}
