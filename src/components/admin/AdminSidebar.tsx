"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Bell, Target, Building2, Briefcase, FolderKanban, Clock, GraduationCap, ShoppingCart, Globe, CheckSquare, Flag, BookOpen, Layers, Award, Wallet, FileText, PackageCheck, Boxes, Warehouse, Receipt, ShieldCheck, History, Bot, Mic, IndianRupee, CreditCard, FolderOpen, MessageSquare, Hash, Video } from "lucide-react";
import { cn } from "@/lib/utils";
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

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="admin-nav-active"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/15 to-secondary/10"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className="relative size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      {!collapsed && <span className="relative truncate">{label}</span>}
    </>
  );

  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        active ? "text-primary" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
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

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return <div className="mt-4 mb-1 border-t border-border/50" />;
  return (
    <div className="mt-4 mb-1 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{children}</div>
  );
}

/**
 * Phase 3 added CRM & Lead Management; Phase 4 added Careers; Phase 5 adds
 * PMS Projects. Global Search, Reports and System Health are later phases;
 * no placeholder items for them here.
 */
export default function AdminSidebar({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const nav = (props: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean }) => (
    <NavLink {...props} collapsed={collapsed} onNavigate={onNavigate} />
  );

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      {nav({ href: "/admin", label: "Command Center", icon: LayoutDashboard, exact: true })}
      {nav({ href: "/admin/notifications", label: "Notifications", icon: Bell })}
      {nav({ href: "/admin/activity-log", label: "Activity Log", icon: History })}
      {nav({ href: "/admin/documents", label: "Documents", icon: FolderOpen })}

      <SectionLabel collapsed={collapsed}>CRM &amp; Lead Management</SectionLabel>
      {nav({ href: "/admin/crm/leads", label: "Leads", icon: Target })}
      {nav({ href: "/admin/crm/clients", label: "Clients", icon: Building2 })}

      <SectionLabel collapsed={collapsed}>Careers</SectionLabel>
      {nav({ href: "/admin/careers/applicants", label: "Applicants", icon: Briefcase })}

      <SectionLabel collapsed={collapsed}>Project Management</SectionLabel>
      {nav({ href: "/admin/pms/projects", label: "Projects", icon: FolderKanban })}
      {nav({ href: "/admin/pms/tasks", label: "Tasks", icon: CheckSquare })}
      {nav({ href: "/admin/pms/milestones", label: "Milestones", icon: Flag })}
      {nav({ href: "/admin/pms/timesheets", label: "Timesheets", icon: Clock })}

      <SectionLabel collapsed={collapsed}>Training Management</SectionLabel>
      {nav({ href: "/admin/tms/students", label: "Students", icon: GraduationCap })}
      {nav({ href: "/admin/tms/programs", label: "Programs", icon: BookOpen })}
      {nav({ href: "/admin/tms/batches", label: "Batches", icon: Layers })}
      {nav({ href: "/admin/tms/certificates", label: "Certificates", icon: Award })}
      {nav({ href: "/admin/tms/payments", label: "Payments", icon: Wallet })}

      <SectionLabel collapsed={collapsed}>Procurement</SectionLabel>
      {nav({ href: "/admin/prms/vendors", label: "Vendors", icon: ShoppingCart })}
      {nav({ href: "/admin/prms/requisitions", label: "Requisitions", icon: FileText })}
      {nav({ href: "/admin/prms/purchase-orders", label: "Purchase Orders", icon: PackageCheck })}
      {nav({ href: "/admin/prms/assets", label: "Assets", icon: Boxes })}
      {nav({ href: "/admin/prms/inventory", label: "Inventory", icon: Warehouse })}
      {nav({ href: "/admin/prms/expenses", label: "Expenses", icon: Receipt })}

      <SectionLabel collapsed={collapsed}>Finance</SectionLabel>
      {nav({ href: "/admin/prms/invoices", label: "Vendor Invoices", icon: IndianRupee })}
      {nav({ href: "/admin/prms/payments", label: "Payments", icon: CreditCard })}

      <SectionLabel collapsed={collapsed}>External Portal</SectionLabel>
      {nav({ href: "/admin/portal/users", label: "Portal Users", icon: Globe })}

      <SectionLabel collapsed={collapsed}>AI &amp; Communication</SectionLabel>
      {nav({ href: "/admin/chatbot/conversations", label: "Chat Conversations", icon: Bot })}
      {nav({ href: "/admin/chatbot/voice-conversations", label: "Voice Conversations", icon: Mic })}
      {nav({ href: "/admin/yashchat/direct-messages", label: "Direct Messages", icon: MessageSquare })}
      {nav({ href: "/admin/yashchat/channels", label: "Channels", icon: Hash })}
      {nav({ href: "/admin/yashchat/meetings", label: "Meetings", icon: Video })}

      <SectionLabel collapsed={collapsed}>Access Control</SectionLabel>
      {nav({ href: "/admin/users", label: "Users & Roles", icon: ShieldCheck })}
    </nav>
  );
}
