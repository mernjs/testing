import Link from "next/link";
import { cn } from "@/lib/utils";

/** Tab strip for the Portal's Tests area (My Tests · My Results · Certificates). */
export default function PortalTestsNav({ active }: { active: "tests" | "results" | "certificates" }) {
  const tabs = [
    { key: "tests", label: "My Tests", href: "/portal/tests" },
    { key: "results", label: "My Results", href: "/portal/tests/results" },
    { key: "certificates", label: "Certificates", href: "/portal/tests/certificates" },
  ] as const;
  return (
    <div className="flex w-fit rounded-xl border border-border/60 bg-background/80 p-1">
      {tabs.map((t) => (
        <Link key={t.key} href={t.href} className={cn("rounded-lg px-3 py-1.5 text-sm", active === t.key ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:text-foreground")}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}
