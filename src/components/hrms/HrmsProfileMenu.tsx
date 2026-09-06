"use client";

import { useState, useTransition } from "react";
import { LogOut, Settings, ShieldCheck, UserRound, Clock } from "lucide-react";
import { useSidebarCollapse } from "@/components/admin/SidebarCollapseContext";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { hrmsLogoutAction } from "@/app/hrms/(protected)/actions";
import { formatDateTime, cn } from "@/lib/utils";
import { HRMS_ROLE_META, primaryRoleLabel, type HrmsRole } from "@/lib/hrms-roles";

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const words = local.replace(/[._-]+/g, " ").replace(/\d+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return email;
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function initialsFor(email: string) {
  return email.split("@")[0].slice(0, 2).toUpperCase();
}

export default function HrmsProfileMenu({
  email,
  roles,
  createdAt,
  lastLoginAt,
}: {
  email: string;
  roles: HrmsRole[];
  createdAt: string;
  lastLoginAt: string | null;
}) {
  const { collapsed } = useSidebarCollapse();
  const [isPending, startTransition] = useTransition();
  const [profileOpen, setProfileOpen] = useState(false);
  const displayName = nameFromEmail(email);
  const initials = initialsFor(email);
  const roleLabel = primaryRoleLabel(roles);

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
              <span className="block text-[11px] text-muted-foreground">{roleLabel}</span>
            </span>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="top" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
              <Avatar className="size-9 ring-2 ring-primary/15">
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{email}</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                  <ShieldCheck className="size-3" />
                  {roleLabel}
                </p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            <UserRound className="size-3.5" data-icon="inline-start" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="size-3.5" data-icon="inline-start" />
            Settings
            <span className="ml-auto text-[10px] text-muted-foreground">Phase 2</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" disabled={isPending} onClick={() => startTransition(() => hrmsLogoutAction())}>
            <LogOut className="size-3.5" data-icon="inline-start" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent>
          <SheetHeader className="border-b border-border/60">
            <SheetTitle>Your Profile</SheetTitle>
            <SheetDescription>Account details for this HRMS session.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-14 ring-2 ring-primary/15">
                <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
                <p className="truncate text-sm text-muted-foreground">{email}</p>
              </div>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>
                  {roles.map((r) => HRMS_ROLE_META[r].label).join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-muted-foreground" />
                <span>Member since {formatDateTime(createdAt)}</span>
              </div>
              {lastLoginAt && (
                <div className="flex items-center gap-2">
                  <Clock className="size-4 shrink-0 text-muted-foreground" />
                  <span>Last login {formatDateTime(lastLoginAt)}</span>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
