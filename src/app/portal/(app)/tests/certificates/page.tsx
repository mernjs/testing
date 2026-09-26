import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { PortalPageHeader } from "@/components/portal/widgets";
import PortalTestsNav from "@/components/ots/PortalTestsNav";
import CertificateList from "@/components/ots/CertificateList";
import { guardPortalPage } from "@/lib/portal/guard";
import { TEST_TAKER_ROLES } from "@/lib/portal-roles";
import { resolveTaker } from "@/lib/ots/taker";
import { candidateCertificates } from "@/lib/ots/candidate";

export const dynamic = "force-dynamic";
export const metadata = { title: "Test Certificates · YashOrbit Portal" };

export default async function PortalTestCertificatesPage() {
  await guardPortalPage(...TEST_TAKER_ROLES);
  const taker = await resolveTaker("portal");
  const certs = taker ? await candidateCertificates(taker) : [];
  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "Tests", href: "/portal/tests" }, { label: "Certificates" }]} />
      <PortalPageHeader title="Test Certificates" subtitle="Certificates from certification tests you passed — each one verifiable online." />
      <PortalTestsNav active="certificates" />
      <CertificateList certs={certs} />
    </div>
  );
}
