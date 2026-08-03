import type { Metadata } from "next";
import CoFounderCeoContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Co-Founder & CEO | YashOrbit";
const description =
  "Meet Aditya Rao, Co-Founder & CEO of YashOrbit — his background, leadership philosophy, career journey, and vision for the company.";
const path = "/about/co-founder-ceo";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function CoFounderCeoPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Co-Founder & CEO", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <CoFounderCeoContent />
    </>
  );
}
