"use client";

import { useTransition } from "react";
import Link from "next/link";
import { LogOut, ShieldCheck, UserRound, KeyRound } from "lucide-react";
import { useSidebarCollapse } from "@/components/lms/SidebarCollapseContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { portalLogoutAction } from "@/app/portal/(app)/actions";
import { cn } from "@/lib/utils";
import { PORTAL_ROLE_META, type PortalRole } from "@/lib/portal-roles";

export default function PortalProfileMenu({
  displayName,
  email,
  role,
}: {
  displayName: string;
  email: string;
  role: PortalRole;
}) {
  const { collapsed } = useSidebarCollapse();
  const [isPending, startTransition] = useTransition();
  const initials = displayName.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";

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
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-medium text-foreground">{displayName}</span>
              <span className="block text-[11px] text-muted-foreground">{PORTAL_ROLE_META[role].label}</span>
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-60">
          <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
            <Avatar className="size-9 ring-2 ring-primary/15">
              <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{email}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                <ShieldCheck className="size-3" />
                {PORTAL_ROLE_META[role].label}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/portal/profile" />}>
            <UserRound className="size-3.5" data-icon="inline-start" />
            Profile &amp; settings
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/portal/change-password" />}>
            <KeyRound className="size-3.5" data-icon="inline-start" />
            Change password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" disabled={isPending} onClick={() => startTransition(() => portalLogoutAction())}>
            <LogOut className="size-3.5" data-icon="inline-start" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
