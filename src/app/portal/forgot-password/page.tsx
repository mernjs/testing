import { redirect } from "next/navigation";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import PortalAuthShell from "@/components/portal/PortalAuthShell";
import ForgotForm from "./ForgotForm";

export const metadata = { title: "Reset password · YashOrbit Portal", robots: { index: false } };

export default async function PortalForgotPage() {
  if (await getCurrentPortalUser()) redirect("/portal");
  return (
    <PortalAuthShell
      headline={<>Locked out?</>}
      sub="Verify the email and phone we have on record and set a new password right away."
    >
      <ForgotForm />
    </PortalAuthShell>
  );
}
