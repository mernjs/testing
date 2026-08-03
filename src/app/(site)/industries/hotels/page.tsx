import type { Metadata } from "next";
import HotelsContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Hotel & Hospitality Software Development | YashOrbit";
const description =
  "Custom Hotel technology — reservation engines, property management systems, and guest experience apps engineered for multi-channel, multi-property operations.";
const path = "/industries/hotels";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function HotelsPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Hotels", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <HotelsContent />
    </>
  );
}
