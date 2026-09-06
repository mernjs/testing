"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import ThemeToggle from "@/components/admin/ThemeToggle";
import HrmsNotificationsBell, { type BellItem } from "@/components/hrms/HrmsNotificationsBell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { brandify } from "@/lib/brand";
import { cn } from "@/lib/utils";
import { hrmsLogoutAction } from "@/app/hrms/(protected)/actions";

const NAV = [
  { href: "/hrms/me", label: "Home", exact: true },
  { href: "/hrms/me/attendance", label: "Attendance" },
  { href: "/hrms/me/leave", label: "Leave" },
  { href: "/hrms/me/salary", label: "Salary" },
  { href: "/hrms/me/documents", label: "Documents" },
  { href: "/hrms/me/profile", label: "Profile" },
];

export default function PortalShell({
  name,
  email,
  notifications,
  unread,
  children,
}: {
  name: string;
  email: string;
  notifications: BellItem[];
  unread: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const initials = name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || email.slice(0, 2).toUpperCase();

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <div className="admin-shell min-h-screen bg-[#e9ebee] text-foreground dark:bg-background">
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/85 backdrop-blur-md print:hidden dark:bg-card/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link href="/hrms/me" className="flex items-center gap-2 text-sm font-bold">
            <BrandMark className="size-6 shrink-0" />
            <span className="hidden sm:inline">
              {brandify("YashOrbit")} <span className="text-foreground">HR</span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive(n.href, n.exact) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />
            <HrmsNotificationsBell items={notifications} unread={unread} basePath="/hrms/me/notifications" />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-muted">
                <Avatar className="size-8 ring-2 ring-primary/15">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-medium text-foreground">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">{email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/hrms/change-password">Change password</Link>} />
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" disabled={pending} onClick={() => startTransition(() => hrmsLogoutAction())}>
                  <LogOut className="size-3.5" data-icon="inline-start" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <nav className="flex flex-col gap-0.5 border-t border-border/50 px-3 py-2 md:hidden">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium",
                  isActive(n.href, n.exact) ? "bg-primary/10 text-primary" : "text-muted-foreground"
                )}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
