import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/** Header + tabs shared by the console pages. */
export default function ConsoleNav({ active, pendingApprovals }: { active: "companies" | "signups"; pendingApprovals: number }) {
  const tabs = [
    { key: "companies", href: "/console", label: "Companies" },
    { key: "signups", href: "/console/signups", label: "Sign-ups" },
  ] as const;
  return (
    <div className="space-y-4">
      <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Company settings
      </Link>
      <div>
        <h1 className="text-2xl font-black tracking-tight">Platform console</h1>
        <p className="text-sm text-muted-foreground">Every company on the platform. Only the platform owner&apos;s Super Admins see this.</p>
      </div>
      <nav className="flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.href}
            className={cn(
              "-mb-px inline-flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium",
              active === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {t.key === "signups" && pendingApprovals > 0 && (
              <span className="rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">{pendingApprovals}</span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
