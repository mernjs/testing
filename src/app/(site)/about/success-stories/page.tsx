import type { Metadata } from "next";
import SuccessStoriesContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Success Stories | YashOrbit";
const description =
  "Explore case studies, client wins, and project statistics behind the software YashOrbit has delivered for startups and enterprises across industries.";
const path = "/about/success-stories";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function SuccessStoriesPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Success Stories", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <SuccessStoriesContent />
    </>
  );
}
