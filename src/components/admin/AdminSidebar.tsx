"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Code, Bot, GraduationCap, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";

const CATEGORY_ICONS: Record<CategorySlug, React.ComponentType<{ className?: string }>> = {
  "software-development": Code,
  "ai-automations": Bot,
  "industrial-training": GraduationCap,
  "resource-augmentation": Users,
  "internship-program": Briefcase,
};

function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname?.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
      <Icon className="relative size-4 shrink-0" />
      <span className="relative">{label}</span>
    </Link>
  );
}

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <NavLink href="/admin" label="Dashboard" icon={LayoutDashboard} exact onNavigate={onNavigate} />
      <div className="mt-4 mb-1 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        Submissions
      </div>
      {CATEGORIES.map((c) => (
        <NavLink
          key={c.slug}
          href={`/admin/submissions/${c.slug}`}
          label={c.label}
          icon={CATEGORY_ICONS[c.slug]}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
