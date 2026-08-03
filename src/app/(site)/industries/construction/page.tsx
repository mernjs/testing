import type { Metadata } from "next";
import ConstructionContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Construction Software Development | YashOrbit";
const description =
  "Custom Construction technology — project management platforms, offline-first field apps, and site monitoring tools built for real job-site conditions.";
const path = "/industries/construction";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function ConstructionPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Construction", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <ConstructionContent />
    </>
  );
}
