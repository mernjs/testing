"use client";

import { useState, useTransition } from "react";
import { LogOut, Settings, ShieldCheck, UserRound, Clock } from "lucide-react";
import { useSidebarCollapse } from "@/components/lms/SidebarCollapseContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { messengerLogoutAction } from "@/app/messenger/(protected)/actions";
import { formatDateTime, cn } from "@/lib/utils";
import { CHAT_ROLE_META, primaryChatRoleLabel, type ChatRole } from "@/lib/messenger-roles";

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function MessengerProfileMenu({
  email,
  displayName,
  roles,
  createdAt,
  lastLoginAt,
  avatarUrl,
}: {
  email: string;
  displayName: string;
  roles: ChatRole[];
  createdAt: string;
  lastLoginAt: string | null;
  avatarUrl?: string | null;
}) {
  const { collapsed } = useSidebarCollapse();
  const [isPending, startTransition] = useTransition();
  const [profileOpen, setProfileOpen] = useState(false);
  const initials = initialsFor(displayName);
  const roleLabel = primaryChatRoleLabel(roles);

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
            {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
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
                {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
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
          <DropdownMenuItem render={<a href="/messenger/settings" />}>
            <Settings className="size-3.5" data-icon="inline-start" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onClick={() => startTransition(() => messengerLogoutAction())}
          >
            <LogOut className="size-3.5" data-icon="inline-start" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent>
          <SheetHeader className="border-b border-border/60">
            <SheetTitle>Your Profile</SheetTitle>
            <SheetDescription>Account details for this Messenger session.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-14 ring-2 ring-primary/15">
                {avatarUrl && <AvatarImage src={avatarUrl} alt="" />}
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
                <span>{roles.map((r) => CHAT_ROLE_META[r].label).join(", ")}</span>
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
