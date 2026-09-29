import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Building2, Globe, Palette, Users } from "lucide-react";
import GlassCard from "@/components/lms/GlassCard";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { getCompanyBrand } from "@/lib/platform/branding";

export const metadata: Metadata = { title: "Company settings", robots: { index: false, follow: false } };

/** The company owner's settings hub. Later phases add Billing, Integrations here. */
const SECTIONS = [
  { href: "/onboarding", icon: Building2, title: "Company setup", description: "Profile, departments, invitations and which panels your team uses." },
  { href: "/settings/branding", icon: Palette, title: "Branding", description: "Logo, name and colour across panels, emails and PDFs." },
  { href: "/settings/domains", icon: Globe, title: "Domains", description: "Your workspace address and your own custom domains, with automatic SSL." },
  { href: "/admin/users", icon: Users, title: "Users & roles", description: "Who can sign in and which panels each person can use." },
];

export default async function CompanySettingsPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");
  const brand = await getCompanyBrand();

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{brand.name} settings</h1>
          <p className="text-sm text-muted-foreground">Company-wide configuration. Only Super Admins see this.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {SECTIONS.map(({ href, icon: Icon, title, description }) => (
            <Link key={href} href={href} className="group">
              <GlassCard className="h-full transition-colors group-hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="size-5 text-primary" />
                    <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
