import type { Metadata } from "next";
import MernStackContent, { mernStackFaqs } from "./Content";
import { socialMetadata, courseJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "MERN Stack Training | YashOrbit";
const description =
  "Hands-on MERN Stack training covering MongoDB, Express, React, and Node.js — build and deploy real full-stack applications with mentor-led, project-based learning.";
const path = "/industrial-training/mern-stack";

const image = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["MERN Stack Training", "MongoDB", "React", "Node.js", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function MernStackTrainingPage() {
  const jsonLd = [
    courseJsonLd({ name: "MERN Stack Training", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industrial Training", path: "/industrial-training" },
      { name: "MERN Stack", path },
    ]),
    faqJsonLd(mernStackFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <MernStackContent />
    </>
  );
}
