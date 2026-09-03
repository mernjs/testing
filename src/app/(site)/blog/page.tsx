import type { Metadata } from "next";
import BlogContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, siteUrl } from "@/lib/seo";
import { blogPosts } from "@/lib/blog";

const title = "Blog | Web, Mobile & AI Development Insights | YashOrbit";
const description =
  "Practical, engineering-led articles on web development, mobile apps, AI/ML, cloud infrastructure, and product strategy — from the YashOrbit team.";
const path = "/blog";
const image = "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["YashOrbit blog", "software development blog", "web development insights", "AI/ML articles", "tech blog"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function BlogPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "YashOrbit Blog",
      description,
      url: `${siteUrl}${path}`,
      numberOfItems: blogPosts.length,
      itemListElement: blogPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <BlogContent />
    </>
  );
}
