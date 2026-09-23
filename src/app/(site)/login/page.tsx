import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import { redirect } from "next/navigation";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import LoginContent from "./Content";

const baseMetadata: Metadata = {
  title: "Log In — Access Your Portal & Wallet | YashOrbit",
  description: "Log in to your YashOrbit portal to track your journey, manage payments and use your earned credits.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export const generateMetadata = () => withSeoOverrides("/login", baseMetadata);

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentPortalUser();
  if (user) redirect(user.mustChangePassword ? "/portal/change-password" : "/portal");
  return <LoginContent />;
}
