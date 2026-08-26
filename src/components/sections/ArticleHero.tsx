"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Calendar, Clock, User } from "lucide-react";
import type { BlogPostMeta } from "@/lib/blog";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function ArticleHero({ post }: { post: BlogPostMeta }) {
  return (
    <section className="relative overflow-hidden bg-background pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 border-b border-border/50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
        <div className="absolute top-[10%] right-[5%] w-[50%] h-[50%] rounded-full bg-secondary/15 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-6"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-4 h-4 hidden sm:block" />
          <span className="text-foreground hidden sm:inline line-clamp-1">{post.title}</span>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.span
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/40 border border-border/50 text-sm font-medium text-foreground backdrop-blur-md mb-6 shadow-sm w-fit"
          >
            {post.category}
          </motion.span>

          <motion.h1 variants={fadeIn} className="text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6 leading-[1.1]">
            {post.title}
          </motion.h1>

          <motion.p variants={fadeIn} className="text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-3xl mb-8">
            {post.excerpt}
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-10">
            <span className="inline-flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {post.readTime}
            </span>
          </motion.div>

          <motion.div
            variants={fadeIn}
            className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border/50 shadow-2xl"
          >
            <Image src={post.image} alt={post.imageAlt} fill sizes="900px" priority className="object-cover" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
