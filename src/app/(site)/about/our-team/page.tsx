import type { Metadata } from "next";
import OurTeamContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Our Team | YashOrbit";
const description =
  "Meet the 16 engineers, designers, AI specialists, and business leads behind YashOrbit — a remote-first, senior-led team.";
const path = "/about/our-team";

const image = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Our Team", "16 Specialists", "Senior-Led Team", "Remote-first", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function OurTeamPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Our Team", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <OurTeamContent />
    </>
  );
}
