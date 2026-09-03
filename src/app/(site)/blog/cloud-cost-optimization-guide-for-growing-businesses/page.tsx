import type { Metadata } from "next";
import CloudCostContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getBlogPost } from "@/lib/blog";

const post = getBlogPost("cloud-cost-optimization-guide-for-growing-businesses")!;
const path = `/blog/${post.slug}`;

export const metadata: Metadata = {
  title: post.seoTitle,
  description: post.description,
  keywords: post.keywords,
  alternates: { canonical: path },
  ...socialMetadata({ title: post.seoTitle, description: post.description, path, image: post.image, imageAlt: post.imageAlt }),
};

export default function Page() {
  const jsonLd = [
    articleJsonLd({ title: post.title, description: post.description, path, image: post.image, imageAlt: post.imageAlt, datePublished: post.date, author: post.author, keywords: post.keywords, articleSection: post.category }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CloudCostContent />
    </>
  );
}
