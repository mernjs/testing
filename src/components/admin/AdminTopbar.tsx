"use client";

import { useTransition } from "react";
import { LogOut, User } from "lucide-react";
import MobileSidebar from "@/components/admin/MobileSidebar";
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
import { logoutAction } from "@/app/admin/(protected)/actions";

function initialsFor(email: string) {
  const name = email.split("@")[0];
  return name.slice(0, 2).toUpperCase();
}

export default function AdminTopbar({ adminEmail }: { adminEmail: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm">
      <MobileSidebar />
      <div className="flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 text-sm transition-colors hover:bg-muted focus-visible:outline-none">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initialsFor(adminEmail)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[160px] truncate text-muted-foreground sm:inline">{adminEmail}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 font-normal text-muted-foreground">
              <User className="size-3.5" />
              <span className="truncate">{adminEmail}</span>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onClick={() => startTransition(() => logoutAction())}
          >
            <LogOut className="size-3.5" data-icon="inline-start" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
