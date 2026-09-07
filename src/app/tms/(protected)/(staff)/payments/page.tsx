import { redirect } from "next/navigation";
import PhasePlaceholder from "@/components/tms/PhasePlaceholder";
import { getCurrentTmsUser } from "@/lib/tms-auth";
import { canManagePayments } from "@/lib/tms-roles";

export default async function PaymentsPage() {
  const user = await getCurrentTmsUser();
  if (!user || !canManagePayments(user.roles)) redirect("/tms");

  return (
    <PhasePlaceholder
      title="Payments"
      description="Track student fees, part payments, transaction IDs and invoices — with revenue and collection analytics."
      phase="Phase 8"
      breadcrumbs={[{ label: "TMS", href: "/tms" }, { label: "Payments" }]}
    />
  );
}
