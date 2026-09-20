import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import UsageRuleForm from "@/components/lms/wallet/UsageRuleForm";
import DeleteEntityButton from "@/components/lms/offers/DeleteEntityButton";
import { getUsageRule, serializeUsageRule } from "@/lib/wallet/usage-rules";
import { USAGE_MODULE_LABELS, AUDIENCE_LABELS } from "@/lib/wallet/constants";
import { deleteUsageRuleAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditUsageRulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rule = await getUsageRule(id);
  if (!rule) notFound();
  const title = `${USAGE_MODULE_LABELS[rule.module]} · ${AUDIENCE_LABELS[rule.appliesToRole]}`;
  return (
    <div className="relative mx-auto max-w-2xl space-y-4">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/lms" }, { label: "Wallet", href: "/lms/wallet" }, { label: "Usage rules", href: "/lms/wallet/usage-rules" }, { label: title }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h1>
        <DeleteEntityButton label="rule" confirmText="Credits fall back to the default for this module (Festival Offers: allowed up to 100%; others: not allowed)." onDelete={deleteUsageRuleAction.bind(null, id)} redirectTo="/lms/wallet/usage-rules" />
      </div>
      <GlassCard><CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader><CardContent><UsageRuleForm rule={serializeUsageRule(rule)} /></CardContent></GlassCard>
    </div>
  );
}
