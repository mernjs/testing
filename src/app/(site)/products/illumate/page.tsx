import type { Metadata } from "next";
import IllumateContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Illumate — IoT Smart Lighting Platform | YashOrbit";
const description =
  "Illumate is an IoT smart lighting platform for facility and property managers — zone control, adaptive scheduling, and energy usage analytics.";
const path = "/products/illumate";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function IllumatePage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "Illumate", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "Illumate", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <IllumateContent />
    </>
  );
}
