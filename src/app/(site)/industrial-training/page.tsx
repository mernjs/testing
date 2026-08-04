import type { Metadata } from "next";
import IndustrialTrainingContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Industrial Training Programs | YashOrbit";
const description =
  "Hands-on, mentor-led industrial training in MERN Stack, MEAN Stack, Generative AI, Agentic AI, Conversational AI, and Computer Vision — with live projects and internship exposure.";
const path = "/industrial-training";
const image = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Industrial Training Programs",
    "MERN Stack training",
    "MEAN Stack training",
    "Generative AI training",
    "Agentic AI training",
    "Conversational AI training",
    "Computer Vision training",
    "YashOrbit",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function IndustrialTrainingPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industrial Training", path: "/industrial-training" },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <IndustrialTrainingContent />
    </>
  );
}
