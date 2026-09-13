import { redirect } from "next/navigation";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import PortalAuthShell from "@/components/portal/PortalAuthShell";
import LoginForm from "./LoginForm";

export const metadata = { title: "Sign in · YashOrbit Portal", robots: { index: false, follow: false } };

export default async function PortalLoginPage() {
  const user = await getCurrentPortalUser();
  if (user) redirect(user.mustChangePassword ? "/portal/change-password" : "/portal");

  return (
    <PortalAuthShell
      headline={
        <>
          Your progress,{" "}
          <span className="bg-gradient-to-r from-primary to-yashorbit-coral bg-clip-text text-transparent">
            in one place.
          </span>
        </>
      }
      sub="Track your application, internship, training or projects — everything updates live as our team moves things forward."
    >
      <LoginForm />
    </PortalAuthShell>
  );
}
