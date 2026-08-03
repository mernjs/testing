import type { Metadata } from "next";
import WhatWeDoContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "What We Do | YashOrbit";
const description =
  "YashOrbit is a full-stack product engineering company building web, mobile, and AI-native software — explore our expertise, services, and development process.";
const path = "/about/what-we-do";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function WhatWeDoPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "What We Do", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <WhatWeDoContent />
    </>
  );
}
