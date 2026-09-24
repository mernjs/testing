"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Megaphone, Share2, Images, Sparkles, BarChart3, ScrollText, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

/** Which sections this viewer may see — computed on the server from the real permission model. */
export interface SmmsNavFlags {
  campaigns: boolean;
  posts: boolean;
  media: boolean;
  ai: boolean;
  analytics: boolean;
  audit: boolean;
  settings: boolean;
}

function NavLink({ href, label, icon, exact = false, collapsed = false, onNavigate }: { href: string; label: string; icon: React.ReactNode; exact?: boolean; collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);
  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active ? "text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
    >
      {active && <motion.span layoutId="smms-nav-active" className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/15 to-secondary/10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
      <span className="relative flex shrink-0 items-center transition-transform duration-200 group-hover:scale-110">{icon}</span>
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

export default function SmmsSidebar({ flags, onNavigate, collapsed = false }: { flags: SmmsNavFlags; onNavigate?: () => void; collapsed?: boolean }) {
  const common = { collapsed, onNavigate };
  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <NavLink {...common} href="/smms" label="Dashboard" icon={<LayoutDashboard className="size-4" />} exact />
      {flags.campaigns && <NavLink {...common} href="/smms/campaigns" label="Campaigns & Ads" icon={<Megaphone className="size-4" />} />}
      {flags.posts && <NavLink {...common} href="/smms/posts" label="Social Media Posts" icon={<Share2 className="size-4" />} />}
      {flags.media && <NavLink {...common} href="/smms/media" label="Media Library" icon={<Images className="size-4" />} />}
      {flags.ai && <NavLink {...common} href="/smms/ai" label="AI Content Generator" icon={<Sparkles className="size-4" />} />}
      {flags.analytics && <NavLink {...common} href="/smms/analytics" label="Analytics" icon={<BarChart3 className="size-4" />} />}
      {flags.audit && <NavLink {...common} href="/smms/activity" label="Activity Logs" icon={<ScrollText className="size-4" />} />}
      {flags.settings && <NavLink {...common} href="/smms/settings" label="Settings" icon={<Settings className="size-4" />} />}
    </nav>
  );
}
