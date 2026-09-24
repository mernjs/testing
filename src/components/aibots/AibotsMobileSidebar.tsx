"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import AibotsSidebar from "@/components/aibots/AibotsSidebar";
import BrandMark from "@/components/BrandMark";
import { brandify } from "@/lib/brand";
import type { AibotsNavFlags, SidebarBot } from "@/components/aibots/AibotsSidebar";

export default function AibotsMobileSidebar({ flags, bots }: { flags: AibotsNavFlags; bots: SidebarBot[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Open navigation menu">
        <Menu className="size-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="flex w-72 flex-col p-0 sm:max-w-72">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">AI Bots panel navigation menu</SheetDescription>
          <div className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
            <BrandMark className="size-6 shrink-0" />
            <span className="text-sm font-bold">
              {brandify("YashOrbit")} <span className="text-foreground">AI Bots</span>
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <AibotsSidebar flags={flags} bots={bots} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
