import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import ARVRContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getBlogPost } from "@/lib/blog";

const post = getBlogPost("ar-vr-reshaping-training-retail-real-estate")!;
const path = `/blog/${post.slug}`;

const baseMetadata: Metadata = {
  title: post.seoTitle,
  description: post.description,
  keywords: post.keywords,
  alternates: { canonical: path },
  ...socialMetadata({ title: post.seoTitle, description: post.description, path, image: post.image, imageAlt: post.imageAlt }),
};

export const generateMetadata = () => withSeoOverrides("/blog/ar-vr-reshaping-training-retail-real-estate", baseMetadata);

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
      <ARVRContent />
    </>
  );
}
