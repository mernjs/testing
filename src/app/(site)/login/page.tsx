import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import LoginContent from "./Content";

export const metadata: Metadata = {
  title: "Log In — Access Your Portal & Wallet | YashOrbit",
  description: "Log in to your YashOrbit portal to track your journey, manage payments and use your earned credits.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentPortalUser();
  if (user) redirect(user.mustChangePassword ? "/portal/change-password" : "/portal");
  return <LoginContent />;
}
