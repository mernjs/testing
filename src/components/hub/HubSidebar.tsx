"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ShoppingCart,
  GraduationCap,
  MessagesSquare,
  LayoutGrid,
  Landmark,
  ShieldCheck,
  BarChart3,
  KeyRound,
  Globe,
  Globe2,
  ExternalLink,
  BookText,
  SearchCheck,
  Vault,
  Bot,
  Megaphone,
  FileCheck2,
  PanelsTopLeft,
  Building2,
  CreditCard,
  ReceiptText,
  Gauge,
  Palette,
  Wallet,
  Plug,
  Zap,
  FileUp,
  History,
  Lock,
  Bell,
  FileText,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { NavIcon, NavSection } from "@/lib/workspace/nav";

const ICONS: Record<NavIcon, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  users: Users,
  projects: FolderKanban,
  cart: ShoppingCart,
  training: GraduationCap,
  finance: Landmark,
  book: BookText,
  search: SearchCheck,
  vault: Vault,
  bot: Bot,
  megaphone: Megaphone,
  test: FileCheck2,
  chat: MessagesSquare,
  grid: LayoutGrid,
  website: PanelsTopLeft,
  shield: ShieldCheck,
  chart: BarChart3,
  globe: Globe,
  building: Building2,
  card: CreditCard,
  receipt: ReceiptText,
  gauge: Gauge,
  palette: Palette,
  bank: Wallet,
  plug: Plug,
  zap: Zap,
  upload: FileUp,
  history: History,
  lock: Lock,
  bell: Bell,
  key: KeyRound,
  file: FileText,
  platform: Globe2,
};

/** Long sections start closed; they open by themselves on one of their own pages. */
const CLOSED_BY_DEFAULT = new Set(["manage", "company"]);

function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  collapsed = false,
  external = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  collapsed?: boolean;
  external?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname?.startsWith(href);

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="hub-nav-active"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/15 to-secondary/10"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className="relative size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      {!collapsed && <span className="relative truncate flex-1">{label}</span>}
      {!collapsed && external && <ExternalLink className="relative size-3 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />}
    </>
  );

  const link = (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active ? "text-primary font-semibold" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
    >
      {inner}
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

function isActive(pathname: string | null, href: string): boolean {
  return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
}

/**
 * The Workspace sidebar. It renders exactly the sections and items the server
 * resolved for this user (`resolveWorkspaceNav`) — no access rule lives here.
 */
export default function HubSidebar({
  nav,
  onNavigate,
  collapsed = false,
}: {
  nav: NavSection[];
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  return (
    <nav aria-label="Workspace" className="flex h-full flex-col gap-1 p-3 overflow-y-auto">
      {nav.map((section) => {
        const links = (
          <>
            {section.items.map((item, i) => (
              <div key={item.key} className="contents">
                {!collapsed && item.group && item.group !== section.items[i - 1]?.group && (
                  <div className="mt-2 px-3 text-[10px] font-semibold tracking-wide text-muted-foreground/70 uppercase">{item.group}</div>
                )}
                <NavLink
                  href={item.href}
                  label={item.label}
                  icon={ICONS[item.icon]}
                  exact={item.href === "/workspace" || item.href === "/settings/billing"}
                  external={item.external}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                />
              </div>
            ))}
          </>
        );
        if (!section.label) return <div key={section.key} className="contents">{links}</div>;

        const hasActive = section.items.some((item) => isActive(pathname, item.href));
        const open = toggled[section.key] ?? (hasActive || !CLOSED_BY_DEFAULT.has(section.key));
        // The icon-only sidebar has no room for a section header: show a divider and the open sections' icons.
        if (collapsed) {
          return (
            <div key={section.key} className="contents" data-nav-section={section.key}>
              <div className="mt-4 mb-1 border-t border-border/50" />
              {open && links}
            </div>
          );
        }
        return (
          <div key={section.key} className="contents" data-nav-section={section.key}>
            <div className="mt-4 mb-1 flex items-center gap-1 px-3">
              {section.href ? (
                <Link
                  href={section.href}
                  onClick={onNavigate}
                  className={cn("flex-1 text-xs font-semibold tracking-wide uppercase hover:text-primary", pathname === section.href ? "text-primary" : "text-muted-foreground")}
                >
                  {section.label}
                </Link>
              ) : (
                <span className="flex-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{section.label}</span>
              )}
              <button
                type="button"
                aria-expanded={open}
                aria-label={`${open ? "Hide" : "Show"} ${section.label} menu`}
                onClick={() => setToggled((t) => ({ ...t, [section.key]: !open }))}
                className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-primary/8 hover:text-primary"
              >
                <ChevronDown className={cn("size-3.5 transition-transform", !open && "-rotate-90")} />
              </button>
            </div>
            {open && links}
          </div>
        );
      })}
    </nav>
  );
}
