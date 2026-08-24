import type { Metadata } from "next";
import LeadershipContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, personJsonLd } from "@/lib/seo";

const title = "Our Founders & Leadership Team | YashOrbit";
const description =
  "Meet the co-founders and leadership team behind YashOrbit — [NAME_OF_CEO] (CEO), Priyanka Singh (COO), Tej Pratap Singh (CTO), Shikha Singh (CFO), and Pooja Singh (CHRO).";
const path = "/about/leadership";

const image = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["YashOrbit founders", "YashOrbit leadership team", "Co-Founder & CEO", "Co-Founder & COO", "CTO", "CFO", "CHRO", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function LeadershipPage() {
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Founders & Leadership", path },
    ]),
    personJsonLd({
      name: "[NAME_OF_CEO]",
      jobTitle: "Co-Founder & CEO",
      path: "/about/co-founder-ceo",
      description: "Co-Founder & CEO of YashOrbit, leading company strategy, culture, and long-term vision.",
    }),
    personJsonLd({
      name: "Priyanka Singh",
      jobTitle: "Co-Founder & COO",
      path: "/about/co-founder-coo",
      description: "Co-Founder & COO of YashOrbit, leading delivery operations, hiring, and cross-team coordination.",
    }),
    personJsonLd({
      name: "Tej Pratap Singh",
      jobTitle: "Chief Technology Officer",
      path: "/about/cto",
      description: "Chief Technology Officer at YashOrbit, leading engineering strategy and applied AI direction.",
    }),
    personJsonLd({
      name: "Shikha Singh",
      jobTitle: "Chief Financial Officer",
      path: "/about/cfo",
      description: "Chief Financial Officer at YashOrbit, leading financial strategy, compliance, and reporting.",
    }),
    personJsonLd({
      name: "Pooja Singh",
      jobTitle: "Chief Human Resources Officer",
      path: "/about/chro",
      description: "Chief Human Resources Officer at YashOrbit, leading talent acquisition, culture, and people operations.",
    }),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <LeadershipContent />
    </>
  );
}
