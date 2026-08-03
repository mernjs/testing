import type { Metadata } from "next";
import ARVRContent from "./Content";
import { siteUrl, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AR/VR Development Services | YashOrbit";
const description =
  "Augmented and virtual reality development — virtual showrooms, VR training simulations, mobile AR, and WebXR experiences built for real hardware performance.";
const path = "/services/ar-vr";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function ARVRPage() {
  const jsonLd = [
    serviceJsonLd({ name: "AR/VR Development", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "AR/VR", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ARVRContent />
    </>
  );
}
