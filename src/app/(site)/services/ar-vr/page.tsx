import type { Metadata } from "next";
import ARVRContent from "./Content";
import { arVrFaqs } from "./faqs";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "AR/VR Development Services | YashOrbit";
const description =
  "Augmented and virtual reality development — virtual showrooms, VR training simulations, mobile AR, and WebXR experiences built for real hardware performance.";
const path = "/services/ar-vr";

const image = "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["AR/VR Development Services", "Immersive UX", "Cross-Platform", "Interactive 3D", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ARVRPage() {
  const jsonLd = [
    serviceJsonLd({ name: "AR/VR Development", description, path, category: "AR & VR Development" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "AR/VR", path },
    ]),
    faqJsonLd(arVrFaqs),
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
