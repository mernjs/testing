import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import ProductsContent from "./Content";
import { socialMetadata, defaultOgImage } from "@/lib/seo";
import { PRODUCTS_DATA } from "@/lib/products-data";

const title = "Our Products — AI-Powered Enterprise Application Ecosystem | YashOrbit";
const description =
  "Explore YashOrbit's complete ecosystem of 15 specialized, AI-powered enterprise products spanning HRMS, PMS, PRMS, TMS, AI Bots Studio, Sales CRM, SEO Intelligence, and Online Examination systems.";
const path = "/products";

const baseMetadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit Products",
    "Enterprise AI Applications",
    "AI SaaS Platform",
    "HRMS Software",
    "Project Management System",
    "Procurement Software",
    "AI Bots Studio",
    "Sales CRM",
    "SEO Software",
    "Online Assessment Engine",
    "Single Sign-On Enterprise Suite",
    "AI Business Software",
  ],
  alternates: { canonical: path },
  ...socialMetadata({
    title,
    description,
    path,
    image: defaultOgImage,
    imageAlt: "YashOrbit Products — AI-Powered Enterprise Application Ecosystem",
  }),
};

export const generateMetadata = () => withSeoOverrides("/products", baseMetadata);

export default function ProductsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "YashOrbit AI-Powered Enterprise Products",
    description: description,
    itemListElement: PRODUCTS_DATA.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.shortDescription,
        category: product.category,
        url: `https://yashorbit.com/products#${product.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductsContent />
    </>
  );
}
