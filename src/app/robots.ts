import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/lms", "/tms", "/verify"],
    },
    sitemap: "https://www.yashorbit.com/sitemap.xml",
  };
}
