"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import AdminSidebar from "@/components/admin/AdminSidebar";
import BrandMark from "@/components/BrandMark";
import { brandify } from "@/lib/brand";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)} aria-label="Open navigation menu">
        <Menu className="size-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0 sm:max-w-72">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Admin panel navigation menu</SheetDescription>
          <div className="flex h-14 items-center gap-2 border-b border-border/60 px-4">
            <BrandMark className="size-6 shrink-0" />
            <span className="text-sm font-bold">
              {brandify("YashOrbit")} <span className="text-foreground"></span>
            </span>
          </div>
          <AdminSidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
