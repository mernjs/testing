"use client";

import Link from "next/link";
import { Users, FolderKanban, ShoppingCart, GraduationCap, LayoutGrid, MessagesSquare, Globe, LayoutDashboard } from "lucide-react";
import AdminMobileSidebar from "@/components/admin/AdminMobileSidebar";
import AdminNotificationsBell, { type BellItem } from "@/components/admin/AdminNotificationsBell";
import ThemeToggle from "@/components/lms/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { primaryAdminRoleLabel, type AdminRole } from "@/lib/admin-roles";

const MODULE_LINKS = [
  { href: "/workspace", label: "Hub", icon: LayoutDashboard },
  { href: "/lms", label: "CRM", icon: LayoutGrid },
  { href: "/pms", label: "PMS", icon: FolderKanban },
  { href: "/tms", label: "TMS", icon: GraduationCap },
  { href: "/prms", label: "Procurement", icon: ShoppingCart },
  { href: "/hrms", label: "HRMS", icon: Users },
  { href: "/messenger", label: "YashChat", icon: MessagesSquare },
] as const;

export default function AdminTopbar({
  roles,
  notifications,
  unread,
}: {
  roles: AdminRole[];
  notifications: BellItem[];
  unread: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 px-3 sm:gap-3 sm:px-4">
      <AdminMobileSidebar />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Super Admin Command Center</p>
        <p className="truncate text-[11px] text-muted-foreground">Signed in as {primaryAdminRoleLabel(roles)}</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        {MODULE_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "hidden transition-transform duration-200 hover:scale-105 lg:inline-flex",
            })}
            aria-label={`Open ${label}`}
          >
            <Icon className="size-3.5" data-icon="inline-start" />
            {label}
          </Link>
        ))}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "sm", className: "transition-transform duration-200 hover:scale-105" })}
          aria-label="Visit website"
        >
          <Globe className="size-3.5" data-icon="inline-start" />
          <span className="hidden sm:inline">Website</span>
        </a>
        <ThemeToggle />
        <AdminNotificationsBell items={notifications} unread={unread} />
      </div>
    </header>
  );
}
