import type { Metadata } from "next";
import Link from "next/link";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { describeVerification } from "@/lib/platform/email-verification";
import VerifyForm from "./VerifyForm";

export const metadata: Metadata = { title: "Verify your email", robots: { index: false, follow: false } };

/**
 * Landing page of the verification email. Deliberately does NOT verify on load
 * (mail scanners pre-fetch links): the button does.
 */
export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token ?? "";
  const verification = token ? await describeVerification(token) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <GlassCard>
          {verification ? (
            <>
              <CardHeader>
                <CardTitle className="text-xl">Verify your email</CardTitle>
                <CardDescription>
                  Confirm <strong className="text-foreground">{verification.email}</strong> as your email address.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VerifyForm token={token} />
              </CardContent>
            </>
          ) : (
            <CardHeader>
              <CardTitle className="text-xl">This link has expired</CardTitle>
              <CardDescription>
                Verification links work once, for 24 hours.{" "}
                <Link href="/workspace/login" className="font-medium text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>{" "}
                and use the &quot;Verify email&quot; button at the top of your Workspace to get a new one.
              </CardDescription>
            </CardHeader>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
