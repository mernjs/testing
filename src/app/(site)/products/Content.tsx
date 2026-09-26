"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS_DATA, PRODUCT_CATEGORIES, ProductItem } from "@/lib/products-data";
import ProductCard from "@/components/products/ProductCard";
import ProductDetailModal from "@/components/products/ProductDetailModal";
import ProductMockup from "@/components/products/ProductMockup";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Bot,
  Lock,
  Database,
  ChevronDown,
  X,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ProductsContent() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Products");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Filter products by search query & category
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" || product.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.shortDescription.toLowerCase().includes(q) ||
        product.tagline.toLowerCase().includes(q) ||
        product.primaryPurpose.toLowerCase().includes(q) ||
        product.keyFeatures.some(
          (f) => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
        ) ||
        product.targetDepartments.some((d) => d.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredSuites = useMemo(() => {
    return [
      {
        id: "ai-suite",
        title: "Autonomous Enterprise AI & Bots Suite",
        subtitle: "No-Code Vector RAG Bots & Multi-Channel AI Reels",
        description: "Empower every department with purpose-built AI agents. From OpenAI Retrieval-Augmented Generation (RAG) vector stores in AI Bots Studio, to autonomous 24/7 lead qualification and AI reel video generation.",
        products: PRODUCTS_DATA.filter((p) => p.id === "aibots-studio" || p.id === "smms-social-engine"),
        accent: "from-purple-600/20 via-primary/10 to-pink-600/20",
      },
      {
        id: "talent-suite",
        title: "Workforce, HR & Assessment Engine",
        subtitle: "End-to-End HR, Automated Biometric Payroll & 17-Type Exam Engine",
        description: "Transform human capital management with automated attendance-linked payroll calculation, single-click career candidate conversion, and server-proctored skill examinations.",
        products: PRODUCTS_DATA.filter((p) => p.id === "hrms-suite" || p.id === "ots-exam-engine"),
        accent: "from-teal-600/20 via-primary/10 to-indigo-600/20",
      },
      {
        id: "exec-suite",
        title: "Executive Governance & Financial Control",
        subtitle: "Real-Time 15-Module Command Center & Multi-Tier Procurement",
        description: "Gain complete executive visibility over live revenue streams, RBAC security access matrix, and multi-tier procurement approvals without data silos.",
        products: PRODUCTS_DATA.filter((p) => p.id === "admin-command-center" || p.id === "prms-procurement"),
        accent: "from-blue-600/20 via-secondary/10 to-amber-600/20",
      },
    ];
  }, []);

  const faqs = [
    {
      q: "Are all 15 applications included in the YashOrbit ecosystem?",
      a: "Yes. All 15 applications are built around a shared single sign-on (SSO) identity store, a unified design system, and a central permission matrix. You can deploy the complete platform or license specific application modules based on your business requirements.",
    },
    {
      q: "How does Single Sign-On (SSO) work across the panels?",
      a: "Logging into the Staff Hub or any individual panel automatically provisions authorized sessions across all other modules where your account has a designated role. No second passwords or URL juggling required.",
    },
    {
      q: "Can we train custom AI bots on our own company documents?",
      a: "Absolutely. The AI Bots Studio allows you to upload proprietary PDFs, Word documents, and text files into isolated OpenAI vector stores. Each bot operates under strict role-level access rules with per-token spend ledger oversight.",
    },
    {
      q: "Can the products be customized to fit our business workflows?",
      a: "Yes. Because every application in the ecosystem was engineered in-house by YashOrbit, we offer custom feature extensions, API integrations, and workflow adaptations tailored to your enterprise needs.",
    },
    {
      q: "How is security and data isolation handled for external users?",
      a: "External stakeholders (clients, job candidates, trainees) interact strictly through the External Portal (`/portal`), which operates on a structurally isolated identity database. External accounts can never reach internal staff tooling by design.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Radial Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute top-[35%] -left-[10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px]" />
        <div className="absolute top-[70%] -right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 border-b border-border/50 z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-bold text-primary mb-6 backdrop-blur-md shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>15 INTEGRATED APPLICATIONS • ONE AI-POWERED ECOSYSTEM</span>
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-4xl sm:text-6xl font-black tracking-tight text-foreground mb-6 leading-[1.1]"
              >
                Our AI-Powered <span className="text-primary">Product Ecosystem</span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10"
              >
                Explore 15 purpose-built, standalone enterprise products unified by a single identity store, real-time executive analytics, and embedded AI automation.
              </motion.p>

              {/* Search & Quick Filter Bar */}
              <motion.div variants={fadeIn} className="max-w-2xl mx-auto mb-10">
                <div className="relative flex items-center rounded-2xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-xl p-2 transition-all focus-within:border-primary/60">
                  <Search className="w-5 h-5 text-muted-foreground ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 15 products by name, AI feature, or department..."
                    className="w-full bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-muted-foreground hover:text-foreground mr-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const el = document.getElementById("products-grid");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95 shrink-0"
                  >
                    Search Products
                  </button>
                </div>
              </motion.div>

              {/* Ecosystem Metrics Bar */}
              <motion.div
                variants={fadeIn}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              >
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-center backdrop-blur-md">
                  <div className="text-2xl font-black text-foreground">15 Products</div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">Complete Suite</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-center backdrop-blur-md">
                  <div className="text-2xl font-black text-primary">1 Login (SSO)</div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">Zero Friction</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-center backdrop-blur-md">
                  <div className="text-2xl font-black text-purple-400">Embedded AI</div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">OpenAI Vector RAG</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 text-center backdrop-blur-md">
                  <div className="text-2xl font-black text-emerald-500">100% Audited</div>
                  <div className="text-xs font-medium text-muted-foreground mt-0.5">Central RBAC</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Architecture Value Pillar Band */}
      <section className="py-16 border-b border-border/50 bg-muted/20 backdrop-blur-md z-10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">The Platform Advantage</span>
            <h2 className="text-3xl font-black tracking-tight text-foreground mt-2">
              Why One Integrated Ecosystem Beats 15 Separate SaaS Subscriptions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-base">Unified Single Sign-On</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                One identity provisions sessions across all authorized panels. No second passwords or forgotten URLs.
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-base">Embedded AI Intelligence</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Purpose-built OpenAI bots, 24/7 lead voice agents, resume matching, and AI reel creation built-in natively.
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-base">Super Admin Governance</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Centralized RBAC permissions, immutable secret reveal logs, and real-time executive revenue oversight.
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center font-bold">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-foreground text-base">Zero Data Silos</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hired candidate in HRMS flows to PMS & TMS immediately. Marketing leads in public site feed straight to CRM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Products Directory Section */}
      <section id="products-grid" className="py-20 z-10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
          {/* Header & Category Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Browse All Applications</span>
              <h2 className="text-3xl font-black tracking-tight text-foreground mt-1">
                Product Ecosystem Directory ({filteredProducts.length})
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                      : "bg-muted/40 border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Product Cards */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setActiveModalProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border/60 bg-card/60 p-12 text-center max-w-lg mx-auto space-y-4">
              <Search className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-bold text-foreground">No Products Found</h3>
              <p className="text-xs text-muted-foreground">
                No application matches &quot;{searchQuery}&quot; under &quot;{selectedCategory}&quot;. Try adjusting your search query or reset filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Products");
                }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Flagship Product Showcases (Alternating Layouts) */}
      <section className="py-20 border-t border-border/50 bg-muted/10 z-10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-24">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Flagship Deep-Dive</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mt-2">
              Featured Enterprise Product Showcases
            </h2>
            <p className="text-sm text-muted-foreground mt-3">
              Explore highlighted product suites with live browser previews and capability breakdowns.
            </p>
          </div>

          {featuredSuites.map((suite, suiteIdx) => (
            <div key={suite.id} className="space-y-12">
              <div className="border-l-4 border-primary pl-6 space-y-1">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Suite {suiteIdx + 1}</span>
                <h3 className="text-2xl font-black text-foreground">{suite.title}</h3>
                <p className="text-sm text-muted-foreground max-w-3xl">{suite.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {suite.products.map((prod, pIdx) => (
                  <div
                    key={prod.id}
                    className={`space-y-6 ${
                      (suiteIdx + pIdx) % 2 === 1 ? "lg:order-last" : ""
                    }`}
                  >
                    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-2xl space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <prod.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-lg">{prod.name}</h4>
                            <span className="text-xs text-primary font-medium">{prod.tagline}</span>
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-bold text-purple-400">
                          {prod.badge}
                        </span>
                      </div>

                      <ProductMockup product={prod} showTabSelector={true} compact={false} />

                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-muted-foreground max-w-md line-clamp-2">
                          {prod.shortDescription}
                        </p>
                        <button
                          onClick={() => setActiveModalProduct(prod)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition-all shrink-0"
                        >
                          Explore Details <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 border-t border-border/50 bg-background z-10 relative">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Got Questions?</span>
            <h2 className="text-3xl font-black tracking-tight text-foreground mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-bold text-foreground text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-primary transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground border-t border-border/30 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* High-Converting CTA Banner */}
      <section className="py-20 border-t border-border/50 z-10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-[#1a1533] to-background border border-primary/30 p-10 md:p-16 shadow-2xl text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Sparkles className="w-3.5 h-3.5" /> Ready for Next-Gen Tech?
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Transform Your Business with YashOrbit Products
              </h2>
              <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                Schedule a live demonstration of our 15-product AI ecosystem with a solutions architect today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30"
              >
                Schedule Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 px-8 py-4 text-base font-bold text-white hover:bg-white/20 transition-all backdrop-blur-md"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
}
