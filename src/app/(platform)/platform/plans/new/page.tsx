import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { DEFAULT_TRIAL_DAYS } from "@/lib/platform/billing/types";
import PlanForm from "../PlanForm";
import { EMPTY_PLAN_FORM } from "../planForm";

export const metadata: Metadata = { title: "New plan · Platform console", robots: { index: false, follow: false } };

export default async function NewPlanPage() {
  await requirePlatformAdmin();
  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <Link href="/console/plans" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> All plans
        </Link>
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-xl">New plan</CardTitle>
            <CardDescription>Plans are never deleted — archive one to stop offering it.</CardDescription>
          </CardHeader>
          <CardContent>
            <PlanForm mode="create" initial={{ ...EMPTY_PLAN_FORM, trialDays: String(DEFAULT_TRIAL_DAYS) }} />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
