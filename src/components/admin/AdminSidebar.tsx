"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  collapsed = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname?.startsWith(href);

  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active ? "text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId="admin-nav-active"
          className="absolute inset-0 rounded-lg bg-primary/10"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className="relative size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      {!collapsed && <span className="relative truncate">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return <div className="mt-4 mb-1 border-t border-border/50" />;
  return (
    <div className="mt-4 mb-1 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
      {children}
    </div>
  );
}

export default function AdminSidebar({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <NavLink href="/admin" label="Dashboard" icon={LayoutDashboard} exact collapsed={collapsed} onNavigate={onNavigate} />
      <SectionLabel collapsed={collapsed}>Submissions</SectionLabel>
      {CATEGORIES.map((c) => (
        <NavLink
          key={c.slug}
          href={`/admin/submissions/${c.slug}`}
          label={c.label}
          icon={CATEGORY_ICONS[c.slug]}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
      <SectionLabel collapsed={collapsed}>Careers</SectionLabel>
      <NavLink href="/admin/careers" label="Applicants" icon={Briefcase} collapsed={collapsed} onNavigate={onNavigate} />
    </nav>
  );
}
