"use client";

import React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ProductItem } from "@/lib/products-data";
import ProductMockup from "./ProductMockup";
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

interface ProductCardProps {
  product: ProductItem;
  onSelect: (product: ProductItem) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const Icon = product.icon || ShieldCheck;
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 250, damping: 25 };
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group relative flex flex-col justify-between rounded-3xl border border-border/60 bg-card/80 p-6 md:p-8 backdrop-blur-xl transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
    >
      {/* Background Gradient Blob */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div>
        {/* Header Badge Strip */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border/50 text-xs font-semibold text-muted-foreground backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {product.category}
          </span>
          {product.aiCapabilities && product.aiCapabilities.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[11px] font-bold text-purple-400">
              <Sparkles className="w-3 h-3 text-purple-400" />
              AI-Powered
            </span>
          )}
        </div>

        {/* Product Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/15 border border-primary/20 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs font-medium text-primary mt-0.5">{product.tagline}</p>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-sm leading-relaxed text-muted-foreground mb-6 line-clamp-3">
          {product.shortDescription}
        </p>

        {/* Embedded UI Preview Mockup */}
        <div className="mb-6 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300">
          <ProductMockup product={product} showTabSelector={false} compact={true} />
        </div>

        {/* Key Feature Chips */}
        <div className="space-y-2 mb-6">
          {product.keyFeatures.slice(0, 3).map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span className="font-medium text-foreground/90">{feat.title}:</span>
              <span className="line-clamp-1">{feat.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target Departments & Explore CTA */}
      <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1">
          {product.targetDepartments.slice(0, 2).map((dept, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-muted/40 text-[10px] font-medium text-muted-foreground">
              {dept}
            </span>
          ))}
        </div>

        <button
          onClick={() => onSelect(product)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-primary/20 shrink-0"
        >
          Explore Product
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
