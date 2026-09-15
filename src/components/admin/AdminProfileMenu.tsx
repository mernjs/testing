"use client";

import { useTransition } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import { useSidebarCollapse } from "@/components/lms/SidebarCollapseContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { adminLogoutAction } from "@/app/admin/(protected)/actions";
import { formatDateTime, cn } from "@/lib/utils";
import { primaryAdminRoleLabel, type AdminRole } from "@/lib/admin-roles";

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const words = local.replace(/[._-]+/g, " ").replace(/\d+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return email;
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function initialsFor(email: string) {
  return email.split("@")[0].slice(0, 2).toUpperCase();
}

export default function AdminProfileMenu({
  email,
  roles,
  lastLoginAt,
}: {
  email: string;
  roles: AdminRole[];
  lastLoginAt: string | null;
}) {
  const { collapsed } = useSidebarCollapse();
  const [isPending, startTransition] = useTransition();
  const displayName = nameFromEmail(email);
  const initials = initialsFor(email);
  const roleLabel = primaryAdminRoleLabel(roles);

  return (
    <div className="shrink-0 border-t border-border/60 p-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-muted",
            collapsed && "justify-center px-0"
          )}
        >
          <Avatar className="size-8 shrink-0 ring-2 ring-primary/15">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
              <p className="truncate text-[11px] text-muted-foreground">{roleLabel}</p>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-3.5 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{displayName}</p>
                  <p className="truncate text-xs font-normal text-muted-foreground">{email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            {lastLoginAt ? `Last sign-in ${formatDateTime(lastLoginAt)}` : "First sign-in"}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onClick={() => startTransition(() => void adminLogoutAction())}
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
