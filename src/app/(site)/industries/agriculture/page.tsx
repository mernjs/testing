import type { Metadata } from "next";
import AgricultureContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Agriculture Software Development | YashOrbit";
const description =
  "Custom Agriculture technology — farm management platforms, IoT sensor integration, and yield prediction tools engineered for field conditions and offline reliability.";
const path = "/industries/agriculture";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function AgriculturePage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: "Agriculture", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <AgricultureContent />
    </>
  );
}
