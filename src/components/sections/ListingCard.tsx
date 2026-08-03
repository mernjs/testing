"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, CheckCircle2, LucideIcon } from "lucide-react";

interface ListingCardProps {
  icon: LucideIcon;
  index: number;
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  subtitle: React.ReactNode;
  description: React.ReactNode;
  highlights: string[];
  href: string;
  image: string;
  ctaLabel?: string;
}

export default function ListingCard({
  icon: Icon,
  index,
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  description,
  highlights,
  href,
  image,
  ctaLabel = "Explore More",
}: ListingCardProps) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group/card relative h-full"
    >
      <Link
        href={href}
        aria-label={`${title} — ${ctaLabel}`}
        className="relative flex flex-col h-full overflow-hidden rounded-3xl bg-muted/20 border border-border/50 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Image Banner */}
        <div className="relative h-52 overflow-hidden flex-none">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover scale-105 group-hover/card:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-secondary/30 mix-blend-overlay"></div>

          {/* Shine sweep */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover/card:translate-x-[350%] transition-transform duration-1000 ease-out" />
          </div>

          {/* Category badge */}
          <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-bold shadow-lg">
            <BadgeIcon className="w-3.5 h-3.5" />
            {badge}
          </div>

          {/* Icon container */}
          <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover/card:scale-110 group-hover/card:bg-primary group-hover/card:border-primary transition-all duration-500">
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col p-8">
          <h3 className="text-2xl font-bold text-foreground mb-2 leading-snug group-hover/card:text-primary transition-colors">{title}</h3>
          <p className="text-primary text-sm font-bold uppercase tracking-wider mb-4">{subtitle}</p>
          <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">{description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {highlights.map((h) => (
              <span
                key={h}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-background border border-border/60 px-2.5 py-1 rounded-full"
              >
                <CheckCircle2 className="w-3 h-3 text-primary flex-none" />
                {h}
              </span>
            ))}
          </div>

          <div className="pt-6 border-t border-border/50 mt-auto">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-foreground group-hover/card:text-primary group-hover/card:gap-3 transition-all">
              {ctaLabel} <ArrowRight className="w-4 h-4 group-hover/card:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
