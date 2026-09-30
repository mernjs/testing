import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { countCompaniesByPlan, getPlan } from "@/lib/platform/billing/plans";
import PlanForm from "../PlanForm";
import { planToFormValues } from "../planForm";

export const metadata: Metadata = { title: "Edit plan · Platform console", robots: { index: false, follow: false } };

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePlatformAdmin();
  const { id } = await params;
  const [plan, counts] = await Promise.all([getPlan(id), countCompaniesByPlan()]);
  if (!plan) notFound();
  const companies = counts.get(plan._id) ?? 0;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <Link href="/console/plans" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All plans
        </Link>
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-xl">Edit {plan.name}</CardTitle>
            <CardDescription>
              {companies === 0 ? "No company is on this plan yet." : `${companies} ${companies === 1 ? "company is" : "companies are"} on this plan.`} Panel and limit changes apply to them right away; price and trial changes apply to new subscriptions only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlanForm mode="update" initial={planToFormValues(plan)} lockedDefault={plan.isDefault && plan.active} />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
