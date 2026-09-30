import type { Metadata } from "next";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { getSignupMode } from "@/lib/platform/settings";
import { listAwaitingApproval } from "@/lib/platform/signup";
import { companyBaseUrl } from "@/lib/platform/tenancy/provisioning";
import { requestOrigin } from "@/lib/platform/request";
import PlatformPageHeader from "@/components/platform/panel/PlatformPageHeader";
import SignupModeForm from "./SignupModeForm";
import ApprovalQueue from "./ApprovalQueue";

export const metadata: Metadata = { title: "Sign-ups & approvals" };

export default async function ConsoleSignupsPage() {
  await requirePlatformAdmin();
  const [mode, requests, { host }] = await Promise.all([getSignupMode(), listAwaitingApproval(), requestOrigin()]);
  const addressOf = Object.fromEntries(requests.map((r) => [r.slug, companyBaseUrl(r.slug, host).replace(/^https?:\/\//, "")]));

  return (
    <div className="space-y-6 p-1">
        <PlatformPageHeader title="Sign-ups & approvals" description="Who can create a company, and requests waiting for a decision." />
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-base">Who can create a company</CardTitle>
            <CardDescription>Applies to the public sign-up page. Changing it never affects companies that already exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupModeForm key={mode} initial={mode} />
          </CardContent>
        </GlassCard>
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-base">Waiting for approval</CardTitle>
            <CardDescription>
              People who confirmed their email while approval was required. Requests expire after 30 days.
              {mode !== "approval" && requests.length > 0 && " Approval isn't required right now, but these earlier requests still need a decision."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApprovalQueue requests={requests} addressOf={addressOf} />
          </CardContent>
        </GlassCard>
    </div>
  );
}
