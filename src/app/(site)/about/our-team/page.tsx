import type { Metadata } from "next";
import OurTeamContent from "./Content";
import { siteUrl, breadcrumbJsonLd } from "@/lib/seo";

const title = "Our Team | YashOrbit";
const description =
  "Meet the engineers, designers, and AI specialists behind YashOrbit — our leadership, teams, culture, and what it's like to work with us.";
const path = "/about/our-team";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function OurTeamPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Our Team", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <OurTeamContent />
    </>
  );
}
