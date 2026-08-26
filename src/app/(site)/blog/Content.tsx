"use client";

import { Newspaper } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import BlogCard from "@/components/sections/BlogCard";
import DetailCTA from "@/components/sections/DetailCTA";
import { blogPosts } from "@/lib/blog";

export default function BlogContent() {
  const [featured, ...rest] = blogPosts;

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="insights & resources"
        title="The YashOrbit Blog"
        description="Practical, engineering-led perspectives on web, mobile, and AI development — written for founders and technical leaders making real build decisions."
        icon={Newspaper}
        image="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1400&auto=format&fit=crop"
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <BlogCard post={featured} index={0} featured />
            {rest.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Have a project this reminded you of?"
        description="Tell us what you're building. We'll give you a straight answer on scope, timeline, and the right approach — no sales fluff."
      />
    </div>
  );
}
