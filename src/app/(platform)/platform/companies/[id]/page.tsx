import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GlassCard from "@/components/lms/GlassCard";
import { formatDate, formatDateTime } from "@/lib/utils";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { getCompanyDetail } from "@/lib/platform/console/companies";
import { companyBaseUrl } from "@/lib/platform/tenancy/provisioning";
import { requestOrigin } from "@/lib/platform/request";
import StatusBadge from "../StatusBadge";
import StatusControl from "./StatusControl";
import Link from "next/link";
import { listDomainsForCompany } from "@/lib/platform/domains/overview";
import DomainActions from "../../domains/DomainActions";
import { DnsBadge, SslBadge } from "../../domains/DomainBadges";

export const metadata: Metadata = { title: "Company" };

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{children}</dd>
    </div>
  );
}

export default async function ConsoleCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePlatformAdmin();
  const company = await getCompanyDetail((await params).id);
  if (!company) notFound();
  const domains = await listDomainsForCompany(company.id);
  const { host } = await requestOrigin();
  const base = companyBaseUrl(company.slug, host);
  const { onboarding: ob } = company;

  return (
    <div className="space-y-4 p-1">
        <Breadcrumbs items={[{ label: "Platform", href: "/platform" }, { label: "Companies", href: "/platform/companies" }, { label: company.name }]} />

        <GlassCard interactive={false}>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl">{company.name}</CardTitle>
                <CardDescription>
                  <a href={base} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                    {base.replace(/^https?:\/\//, "")} <ExternalLink className="size-3" />
                  </a>
                </CardDescription>
                <StatusBadge status={company.status} isPlatformOwner={company.isPlatformOwner} />
              </div>
              {company.isPlatformOwner ? (
                <p className="max-w-56 text-xs text-muted-foreground">The platform owner company runs the platform and can&apos;t be suspended.</p>
              ) : (
                <StatusControl companyId={company.id} companyName={company.name} status={company.status} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-3">
              <Field label="Owner">{company.ownerEmail ?? "—"}</Field>
              <Field label="Users">{company.userCount}</Field>
              <Field label="Last sign-in">{company.lastSignInAt ? formatDateTime(company.lastSignInAt) : "Never"}</Field>
              <Field label="Created">{formatDate(company.createdAt)}</Field>
              <Field label="Industry">{company.profile?.industry ?? "—"}</Field>
              <Field label="Country · currency">{company.profile ? `${company.profile.country} · ${company.profile.currency}` : "—"}</Field>
              {company.statusChangedAt && <Field label={company.status === "suspended" ? "Suspended on" : "Status changed"}>{formatDateTime(company.statusChangedAt)}</Field>}
            </dl>
          </CardContent>
        </GlassCard>

        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard interactive={false}>
            <CardHeader>
              <CardTitle className="text-base">Setup progress</CardTitle>
              <CardDescription>
                {company.isPlatformOwner
                  ? "The platform owner doesn't go through onboarding."
                  : ob.completedAt
                    ? `Finished ${formatDate(ob.completedAt)}.`
                    : ob.dismissedAt
                      ? `${ob.done} of ${ob.total} steps; the rest skipped ${formatDate(ob.dismissedAt)}.`
                      : `${ob.done} of ${ob.total} steps done.`}
              </CardDescription>
            </CardHeader>
            {!company.isPlatformOwner && (
              <CardContent>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((ob.done / ob.total) * 100)}%` }} />
                </div>
              </CardContent>
            )}
          </GlassCard>

          <GlassCard interactive={false}>
            <CardHeader>
              <CardTitle className="text-base">Branding</CardTitle>
              <CardDescription>{company.branding.wordmark || company.branding.logoUrl || company.branding.primaryColor ? "Customised." : "Using the defaults."}</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-3 gap-4">
                <Field label="Wordmark">{company.branding.wordmark ?? "—"}</Field>
                <Field label="Logo">{company.branding.logoUrl ? "Uploaded" : "—"}</Field>
                <Field label="Colour">
                  {company.branding.primaryColor ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="size-3.5 rounded-full border border-border" style={{ background: company.branding.primaryColor }} />
                      {company.branding.primaryColor}
                    </span>
                  ) : (
                    "—"
                  )}
                </Field>
              </dl>
            </CardContent>
          </GlassCard>
        </div>

        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-base">Panels</CardTitle>
            <CardDescription>{company.enabledPanels ? `${company.enabledPanels.length} enabled.` : "No choice recorded, so every panel is on."}</CardDescription>
          </CardHeader>
          {company.enabledPanels && (
            <CardContent className="flex flex-wrap gap-1.5">
              {company.enabledPanels.map((p) => (
                <Badge key={p} variant="outline">
                  {p}
                </Badge>
              ))}
            </CardContent>
          )}
        </GlassCard>

        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-base">Domains</CardTitle>
            <CardDescription>
              {domains.length ? "Addresses this workspace answers on (when active)." : "No domain records — it answers on its subdomain only."}{" "}
              <Link href={`/platform/domains?q=${encodeURIComponent(company.slug)}`} className="underline-offset-2 hover:underline">
                All domains
              </Link>
            </CardDescription>
          </CardHeader>
          {domains.length > 0 && (
            <CardContent>
              <ul className="divide-y divide-border text-sm" id="company-domains">
                {domains.map((d) => (
                  <li key={d.host} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span className="min-w-0 font-medium break-all">{d.host}</span>
                    <span className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline">{d.kind === "subdomain" ? "Subdomain" : "Custom"}</Badge>
                      {d.isPrimary && <Badge variant="outline">Primary</Badge>}
                      <DnsBadge status={d.status} />
                      <SslBadge ssl={d.hosting.ssl} error={d.hosting.error} />
                      {d.hosting.error && (
                        <Badge variant="destructive" title={d.hosting.error}>
                          Hosting error
                        </Badge>
                      )}
                      <DomainActions
                        domain={{ host: d.host, companyName: company.name, kind: d.kind, status: d.status, isPrimary: d.isPrimary, removable: d.removable, localOnly: d.hosting.providerId === null }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </GlassCard>
    </div>
  );
}
