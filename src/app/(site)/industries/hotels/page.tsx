import type { Metadata } from "next";
import HotelsContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Hotel & Hospitality Software Development | YashOrbit";
const description =
  "Custom Hotel technology — reservation engines, property management systems, and guest experience apps engineered for multi-channel, multi-property operations.";
const path = "/industries/hotels";

const image = "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Hotel & Hospitality Software Development", "Channel Manager", "Direct Booking Engine", "Guest Experience Apps", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
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
