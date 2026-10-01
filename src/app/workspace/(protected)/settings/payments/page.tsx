import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { getPaymentAccountView } from "@/lib/platform/integrations/payments";
import PaymentAccountManager from "@/components/platform/PaymentAccountManager";
import { disconnectPaymentAccountAction, savePaymentAccountAction, testPaymentAccountAction } from "./actions";

export const metadata: Metadata = { title: "Payments & payouts", robots: { index: false, follow: false } };

export default async function PaymentsSettingsPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");
  const account = await getPaymentAccountView();

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/workspace/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Company settings
        </Link>
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-xl">Payments &amp; payouts</CardTitle>
            <CardDescription>Connect your own Razorpay account to collect online payments from your customers and, with RazorpayX, pay salaries directly to your employees&apos; bank accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentAccountManager
              initial={account}
              actions={{ save: savePaymentAccountAction, test: testPaymentAccountAction, disconnect: disconnectPaymentAccountAction }}
            />
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
