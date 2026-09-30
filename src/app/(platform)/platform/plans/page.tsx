import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import GlassCard from "@/components/lms/GlassCard";
import { cn } from "@/lib/utils";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { countCompaniesByPlan, listPlans } from "@/lib/platform/billing/plans";
import { formatMoney, type Plan } from "@/lib/platform/billing/types";
import { MODULES } from "@/lib/platform/onboarding/catalog";
import { countAwaitingApproval } from "@/lib/platform/signup";
import ConsoleNav from "../ConsoleNav";
import PlanActiveControl from "./PlanActiveControl";

export const metadata: Metadata = { title: "Plans · Platform console", robots: { index: false, follow: false } };

const LABELS = new Map<string, string>(MODULES.map((m) => [m.key, m.label]));
const nf = new Intl.NumberFormat("en-IN");

function limit(value: number | null, unit: string): string {
  return value === null ? "Unlimited" : `${nf.format(value)} ${unit}`;
}

function panels(plan: Plan): string {
  if (plan.modules === "all") return "Every panel";
  return plan.modules.map((m) => LABELS.get(m) ?? m).join(", ");
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm break-words text-foreground">{children}</dd>
    </div>
  );
}

export default async function ConsolePlansPage() {
  await requirePlatformAdmin();
  const [plans, counts, pendingApprovals] = await Promise.all([listPlans(), countCompaniesByPlan(), countAwaitingApproval()]);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <ConsoleNav active="plans" pendingApprovals={pendingApprovals} />

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl space-y-1">
            <h2 className="text-lg font-semibold">Plans</h2>
            <p className="text-sm text-muted-foreground">
              What companies can subscribe to. Price and trial changes apply to new subscriptions only — companies already subscribed keep what they bought. Prices exclude GST.
            </p>
          </div>
          <Link href="/console/plans/new" className={cn(buttonVariants())}>
            <Plus className="size-4" data-icon="inline-start" /> New plan
          </Link>
        </div>

        {plans.length === 0 ? (
          <p className="text-sm text-muted-foreground">No plans yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2" aria-label="Plans">
            {plans.map((plan) => {
              const companies = counts.get(plan._id) ?? 0;
              return (
                <li key={plan._id} data-plan-id={plan._id}>
                  <GlassCard interactive={false} className={cn("h-full", !plan.active && "opacity-80")}>
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0 space-y-1">
                          <CardTitle className="text-base">{plan.name}</CardTitle>
                          <CardDescription className="break-words">
                            <code className="text-xs">{plan._id}</code>
                            {plan.description && <> · {plan.description}</>}
                          </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {plan.isDefault && <Badge>Default</Badge>}
                          {plan.active ? <Badge variant="secondary">Active</Badge> : <Badge variant="outline">Archived</Badge>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <Field label="Monthly">{formatMoney(plan.priceMonthly, plan.currency)}</Field>
                        <Field label="Yearly">{formatMoney(plan.priceYearly, plan.currency)}</Field>
                        <Field label="Seats">{limit(plan.limits.seats, "users")}</Field>
                        <Field label="AI tokens / month">{limit(plan.limits.aiTokensPerMonth, "tokens")}</Field>
                        <Field label="Storage">{limit(plan.limits.storageMb, "MB")}</Field>
                        <Field label="Free trial">{plan.trialDays === 0 ? "No trial" : `${plan.trialDays} days`}</Field>
                        <div className="col-span-2">
                          <Field label="Panels (plus the core panels)">{panels(plan)}</Field>
                        </div>
                        <Field label="Companies on it">{companies}</Field>
                        <Field label="Sort order">{plan.sortOrder}</Field>
                      </dl>
                      <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                        <Link href={`/console/plans/${encodeURIComponent(plan._id)}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))} aria-label={`Edit ${plan.name}`}>
                          <Pencil className="size-3.5" data-icon="inline-start" /> Edit
                        </Link>
                        <PlanActiveControl planId={plan._id} planName={plan.name} active={plan.active} isDefault={plan.isDefault} companies={companies} />
                      </div>
                    </CardContent>
                  </GlassCard>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
