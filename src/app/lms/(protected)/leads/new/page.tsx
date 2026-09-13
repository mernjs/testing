import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import NewLeadForm from "./NewLeadForm";

export const metadata = { title: "New lead · Lead Management" };

export default function NewLeadPage() {
  return (
    <div className="relative mx-auto max-w-xl space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/lms" },
          { label: "Lead Management", href: "/lms/leads" },
          { label: "New lead" },
        ]}
      />
      <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">New lead</h1>
      <p className="text-sm text-muted-foreground">
        Creates a lead and a portal account (with a temporary password). Use for phone/walk-in enquiries that never hit a
        website form.
      </p>
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <NewLeadForm />
        </CardContent>
      </GlassCard>
    </div>
  );
}
