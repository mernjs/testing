import type { Metadata } from "next";
import MeanStackContent from "./Content";
import { socialMetadata, courseJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "MEAN Stack Training | YashOrbit";
const description =
  "Structured MEAN Stack training covering MongoDB, Express, Angular, and Node.js — build enterprise-grade single-page applications with mentor-led, project-based learning.";
const path = "/industrial-training/mean-stack";

const image = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["MEAN Stack Training", "Angular", "TypeScript", "RxJS", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function MeanStackTrainingPage() {
  const jsonLd = [
    courseJsonLd({ name: "MEAN Stack Training", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industrial Training", path: "/industrial-training" },
      { name: "MEAN Stack", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <MeanStackContent />
    </>
  );
}
