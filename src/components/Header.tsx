"use client";

import * as React from "react";
import Link from "next/link";
import PortalAuthLink from "@/components/PortalAuthLink";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Menu, X, ChevronDown, Moon, Sun, ArrowRight, Zap, Monitor, Smartphone, Cpu, Box, Code2, Database, Sparkles, Bot, MessageSquare, ScanEye, Compass, Briefcase, Layers, Glasses, Eye, GraduationCap, Building2, Landmark, Calendar, Mail, Phone, Globe, HeartPulse, ShoppingCart, Umbrella, Tractor, Share2, Plane, Hotel, Palette, Handshake, Users, UserPlus, UserCheck, Clock, Target, Newspaper, Workflow, BarChart3, FileSearch, TrendingUp, Plug, BrainCircuit, Megaphone, FileQuestion, Kanban, Filter, ShieldCheck, FileText } from "lucide-react";
import { useTheme } from "next-themes";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { socialIconFor } from "@/components/icons/social-icon-for";
import { useSiteInfo } from "@/components/cms/SiteInfoContext";
import type { SiteInfo } from "@/lib/cms/site-info-shared";
import { loadAndToggleTawk } from "@/lib/tawk";
import { resolveIcon } from "@/lib/cms/icon-map";
import type { PublicNavTop } from "@/lib/cms/nav";

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M4,50 C0,60 40,38 50,26" fill="none" stroke="#ECF2FD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <circle cx="32" cy="32" r="25.5" fill="#1D428A" />
      <g fill="#ECF2FD" opacity="0.4">
        <circle cx="29.4" cy="24.6" r="0.92" />
        <circle cx="34.6" cy="24.6" r="0.92" />
        <circle cx="26.8" cy="29.8" r="0.98" />
        <circle cx="32.0" cy="29.8" r="1.09" />
        <circle cx="37.2" cy="29.8" r="0.98" />
        <circle cx="24.2" cy="35.0" r="0.9" />
        <circle cx="29.4" cy="35.0" r="1.03" />
        <circle cx="34.6" cy="35.0" r="1.03" />
        <circle cx="39.8" cy="35.0" r="0.9" />
        <circle cx="21.6" cy="19.4" r="0.75" />
        <circle cx="32.0" cy="19.4" r="0.78" />
        <circle cx="42.4" cy="19.4" r="0.75" />
        <circle cx="19.0" cy="45.4" r="0.6" />
        <circle cx="29.4" cy="45.4" r="0.75" />
        <circle cx="34.6" cy="45.4" r="0.75" />
        <circle cx="45.0" cy="45.4" r="0.6" />
      </g>
      <path d="M17.6,17.6 L32,33.6" fill="none" stroke="#ECF2FD" strokeWidth="8" strokeLinecap="round" />
      <path d="M32,33.6 L32,48" fill="none" stroke="#ECF2FD" strokeWidth="8" strokeLinecap="round" />
      <path d="M46.4,17.6 L36,29.2" fill="none" stroke="#ECF2FD" strokeWidth="8" strokeLinecap="round" />
      <circle cx="34.4" cy="30.4" r="4.8" fill="#E56043" />
      <path d="M8,44 C2,57 45,31 56,12" fill="none" stroke="#E56043" strokeWidth="3" strokeLinecap="round" />
      <polygon points="58.6,15.8 51.4,11.6 59.8,5.5" fill="#E56043" />
    </svg>
  );
}

/** The brand logo: the CMS Site Identity logo image when one is set, else the built-in SVG. */
function SiteLogo({ className, logoUrl }: { className: string; logoUrl: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- CMS logo URL (any host)
  return logoUrl ? <img src={logoUrl} alt="" className={`${className} object-contain`} /> : <Logo className={className} />;
}

const mobileContactLinksFor = (header: SiteInfo["header"], whatsappHref: string) => [
  { name: header.consultLabel, type: "link" as const, href: header.consultHref, icon: Calendar },
  { name: header.liveChatLabel, type: "action" as const, icon: MessageSquare },
  { name: header.whatsappLabel, type: "external" as const, href: whatsappHref, icon: WhatsAppIcon },
];

/** A desktop mega-menu column, resolved from the CMS navigation. */
interface NavColumn {
  name: string;
  href: string;
  featured: { title: string; description: string; image: string };
  items: { name: string; href: string; description: string; icon: React.ComponentType<{ className?: string }> }[];
}

function FeaturedCard({ item, featuredLabel }: { item: NavColumn; featuredLabel: string }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), springConfig);

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
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="col-span-2 group/card"
    >
      <Link
        href={item.href}
        className="block h-full p-6 rounded-2xl relative overflow-hidden isolate ring-1 ring-border/50 hover:ring-primary/40 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/25"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.featured.image}
          alt={item.featured.title}
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover/card:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 group-hover/card:from-black/95 transition-colors duration-500" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-secondary/30 mix-blend-overlay opacity-80" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-y-0 -left-1/2 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover/card:translate-x-[350%] transition-transform duration-1000 ease-out" />
        </div>

        <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          {featuredLabel}
        </span>

        <div className="relative z-10 h-full min-h-[200px] flex flex-col justify-end" style={{ transform: "translateZ(20px)" }}>
          <h3 className="text-xl font-bold text-white mb-2 group-hover/card:translate-x-0.5 transition-transform duration-300">
            {item.featured.title}
          </h3>
          <p className="text-sm text-white/70 mb-4">{item.featured.description}</p>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            View all {item.name}
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover/card:bg-primary transition-colors duration-300">
              <ArrowRight className="w-3.5 h-3.5 group-hover/card:translate-x-0.5 transition-transform" />
            </span>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * `variant` is chosen per theme in the CMS (src/lib/cms/component-variants.ts):
 * "default" is the site's standard header; "menu" drops the desktop nav bar
 * and uses the slide-out menu at every screen width.
 */
export default function Header({ cmsNavigation, variant = "default" }: { cmsNavigation: PublicNavTop[]; variant?: "default" | "menu" }) {
  const menuOnly = variant === "menu";
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  // Brand, CTA, contact details and social links: CMS → Site Identity.
  const { brand, header, contact, social } = useSiteInfo();
  const mobileContactLinks = React.useMemo(() => mobileContactLinksFor(header, contact.whatsappHref), [header, contact.whatsappHref]);
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = React.useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount flag to avoid next-themes SSR/client icon mismatch
    setMounted(true);
  }, []);
  const isDark = mounted && theme === "dark";

  // The header menu — CMS → Navigation. Desktop and mobile menus share one source.
  const navigation = React.useMemo(
    () =>
      cmsNavigation.map((top) => ({
        name: top.name,
        href: top.href,
        featured: top.featured,
        items: top.items.map((i) => ({ name: i.name, href: i.href, description: i.description ?? "", icon: resolveIcon(i.iconKey) })),
      })),
    [cmsNavigation]
  );
  const mobileNavigation = React.useMemo(
    () =>
      cmsNavigation.map((top) => ({
        name: top.name,
        href: top.href,
        icon: resolveIcon(top.iconKey),
        items: top.items.map((i) => ({ name: i.name, href: i.href, icon: resolveIcon(i.iconKey) })),
      })),
    [cmsNavigation]
  );

  return (
    <>
    <header className="fixed inset-x-0 top-[var(--offer-strip-h,0px)] z-50 h-[88px] bg-background/80 dark:bg-muted/20 backdrop-blur-xl border-b border-border/50">
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
        <div className="flex shrink-0">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2.5 group">
            <SiteLogo logoUrl={brand.logoUrl} className="w-9 h-9 shrink-0 transition-transform duration-300 group-hover:scale-105" />
            <span className="flex flex-col leading-none">
              <span className="font-extrabold text-2xl tracking-tight">
                <span className="text-foreground">{brand.namePrimary}</span><span className="text-primary">{brand.nameAccent}</span>
              </span>
              <span className="mt-0.5 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.15em] text-foreground/80">
                {brand.subtitle}
              </span>
            </span>
          </Link>
        </div>

        <div className={`${menuOnly ? "flex" : "flex xl:hidden"} gap-4 items-center ml-auto`}>
          <button
            type="button"
            aria-label="Open main menu"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => {
              const activeSection = mobileNavigation.find(
                (section) => pathname === section.href || pathname?.startsWith(section.href + "/")
              );
              setOpenMobileSection(activeSection ? activeSection.name : null);
              setMobileMenuOpen(true);
            }}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2.5 rounded-full hover:bg-muted/80 backdrop-blur-sm transition-all"
          >
            {isDark ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
          </button>
        </div>

        <div className={`${menuOnly ? "hidden" : "hidden xl:flex"} xl:items-center xl:gap-x-3 ml-auto relative h-full`}>
          <div className="flex items-center gap-x-0.5 relative h-full">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
              <div
                key={item.name}
                className="relative py-2"
                onMouseEnter={() => setActiveMenu(item.name)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-2 text-sm font-semibold transition-colors duration-200 xl:px-2.5 ${isActive || activeMenu === item.name ? "text-primary" : "text-foreground hover:text-primary hover:bg-muted/40"
                    }`}
                >
                  {activeMenu === item.name && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 -z-10 rounded-full bg-muted/60"
                    />
                  )}
                  {item.name}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeMenu === item.name ? "rotate-180" : ""}`} />
                </Link>

                <AnimatePresence>
                  {activeMenu === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute left-1/2 z-50 mt-4 flex w-screen max-w-5xl -translate-x-1/2 px-4"
                    >
                      <div className="relative w-full flex-auto">
                        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-primary/0 to-secondary/20 blur-2xl pointer-events-none" />

                        <div className="relative w-full flex-auto overflow-hidden rounded-3xl bg-background/95 dark:bg-muted/20 backdrop-blur-2xl shadow-2xl ring-1 ring-border border border-border/50">
                          <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                          <div className="grid grid-cols-5 p-2">
                            <FeaturedCard item={item} featuredLabel={header.featuredLabel} />
                            <div className="col-span-3 p-5 grid grid-cols-2 gap-x-6 gap-y-2.5">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="group relative flex items-start gap-3.5 rounded-xl p-2.5 hover:bg-muted/50 transition-colors"
                                >
                                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/50 group-hover:from-primary group-hover:to-[#ff8e75] group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                    <subItem.icon className="h-4.5 w-4.5 text-muted-foreground group-hover:text-white transition-colors duration-300" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-foreground text-sm mb-0.5 group-hover:text-primary transition-colors whitespace-nowrap">
                                      {subItem.name}
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{subItem.description}</p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              );
            })}

            <Link
              href={header.askAiHref}
              className={`relative ml-1 flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold transition-colors duration-200 ${
                pathname === header.askAiHref
                  ? "text-primary"
                  : "text-foreground hover:text-primary hover:bg-muted/40"
              }`}
            >
              <Bot className="h-4 w-4 text-primary" />
              {header.askAiLabel}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <PortalAuthLink variant="desktop" />
            <Link
              href={header.ctaHref}
              className="group relative inline-flex flex-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                {header.ctaLabel} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2.5 rounded-full bg-muted/30 hover:bg-muted/80 backdrop-blur-sm transition-all border border-border/50"
            >
              {isDark ? <Sun className="w-4 h-4 text-foreground" /> : <Moon className="w-4 h-4 text-foreground" />}
            </button>
          </div>
        </div>
      </nav>
    </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] ${menuOnly ? "" : "xl:hidden"}`}
          >
            <div className="fixed inset-0 bg-background/80 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-[100] w-full overflow-y-auto bg-background dark:bg-muted/20 backdrop-blur-2xl px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border/50"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <SiteLogo logoUrl={brand.logoUrl} className="w-8 h-8 shrink-0" />
                  <span className="flex flex-col leading-none">
                    <span className="font-extrabold text-xl tracking-tight">
                      <span className="text-foreground">{brand.namePrimary}</span><span className="text-primary">{brand.nameAccent}</span>
                    </span>
                    <span className="mt-0.5 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.13em] text-foreground/80">
                      {brand.subtitle}
                    </span>
                  </span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-full p-2.5 text-muted-foreground hover:bg-muted/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-8 flow-root">
                <div className="border-b border-border/50 pb-2">
                  {mobileNavigation.map((section) => {
                    const isSectionActive = pathname === section.href || pathname?.startsWith(section.href + "/");
                    const isOpen = openMobileSection === section.name;
                    return (
                      <div key={section.name} className="border-t border-border/50 first:border-t-0">
                        <button
                          type="button"
                          onClick={() => setOpenMobileSection(isOpen ? null : section.name)}
                          className="flex w-full items-center justify-between gap-3 py-4"
                          aria-expanded={isOpen}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg border transition-colors ${
                                isSectionActive ? "border-primary/30 bg-primary/5 text-primary" : "border-border/50 text-muted-foreground"
                              }`}
                            >
                              <section.icon className="h-4 w-4" />
                            </span>
                            <span className={`text-base font-bold transition-colors ${isSectionActive ? "text-primary" : "text-foreground"}`}>
                              {section.name}
                            </span>
                          </span>
                          <ChevronDown
                            className={`h-5 w-5 flex-none text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="pb-4 pl-[3.25rem] space-y-1">
                                {section.items.map((item) => {
                                  const isItemActive = pathname === item.href;
                                  return (
                                    <Link
                                      key={item.name}
                                      href={item.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={`flex items-center gap-3 rounded-r-lg border-l-2 py-2.5 pl-3 pr-3 text-sm transition-colors ${
                                        isItemActive
                                          ? "border-primary bg-primary/5 font-semibold text-primary"
                                          : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-primary"
                                      }`}
                                    >
                                      <item.icon className="h-4 w-4 flex-none" />
                                      {item.name}
                                    </Link>
                                  );
                                })}
                                <Link
                                  href={section.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center gap-1.5 py-2 mt-1 pt-2 border-t border-border/30 text-sm font-semibold text-primary"
                                >
                                  View All {section.name}
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}

                  <Link
                    href={header.askAiHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 border-t border-border/50 py-4 ${
                      pathname === header.askAiHref ? "text-primary" : "text-foreground"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg border transition-colors ${
                        pathname === header.askAiHref
                          ? "border-primary/30 bg-primary/5 text-primary"
                          : "border-border/50 text-muted-foreground"
                      }`}
                    >
                      <Bot className="h-4 w-4" />
                    </span>
                    <span className="text-base font-bold">{header.askAiLabel}</span>
                  </Link>
                </div>

                <div className="border-b border-border/50 py-4">
                  <div className="grid grid-cols-3 gap-2">
                    {mobileContactLinks.map((link) => {
                      const tileContent = (
                        <>
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <link.icon className="h-4 w-4" />
                          </span>
                          <span className="text-xs font-medium leading-tight text-muted-foreground">{link.name}</span>
                        </>
                      );
                      const tileClassName = "flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition-colors hover:bg-muted/50";

                      if (link.type === "action") {
                        return (
                          <button
                            key={link.name}
                            type="button"
                            onClick={() => {
                              loadAndToggleTawk();
                              setMobileMenuOpen(false);
                            }}
                            className={tileClassName}
                          >
                            {tileContent}
                          </button>
                        );
                      }

                      if (link.type === "external") {
                        return (
                          <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMobileMenuOpen(false)}
                            className={tileClassName}
                          >
                            {tileContent}
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={tileClassName}
                        >
                          {tileContent}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-5 pt-6">
                  <div className="grid grid-cols-1 gap-3">
                    <PortalAuthLink variant="mobile" onNavigate={() => setMobileMenuOpen(false)} />
                    <Link
                      href={header.ctaHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3.5 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                    >
                      {header.ctaLabel} <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  <div className="flex flex-col gap-3">
                    <a href={`mailto:${contact.email}`} className="group flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
                        <Mail className="h-4 w-4 text-primary transition-colors group-hover:text-primary-foreground" />
                      </span>
                      <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {contact.email}
                      </span>
                    </a>
                    <a href={contact.phoneHref} className="group flex items-center gap-3">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary">
                        <Phone className="h-4 w-4 text-primary transition-colors group-hover:text-primary-foreground" />
                      </span>
                      <span className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {contact.phoneDisplay}
                      </span>
                    </a>
                  </div>

                  <div className="pt-1">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{header.followLabel}</p>
                    <div className="flex items-center gap-3">
                      {social.map((link) => {
                        const Icon = socialIconFor(link.name);
                        return (
                        <a
                          key={link.name}
                          href={link.href}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-muted/50 text-muted-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          <span className="sr-only">{link.name}</span>
                          <Icon className="h-4 w-4" />
                        </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
