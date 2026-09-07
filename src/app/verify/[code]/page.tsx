import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import BrandMark from "@/components/BrandMark";
import { brandify } from "@/lib/brand";
import { getCertificateByCode, type CertificateView } from "@/lib/tms/certificates";
import { getDb } from "@/lib/mongodb";
import { getTmsSettings } from "@/lib/tms/settings";
import { CERTIFICATE_TYPES } from "@/lib/tms/constants";

export const metadata: Metadata = {
  title: "Certificate Verification",
  robots: { index: false, follow: false },
};

async function loadView(code: string): Promise<CertificateView | null> {
  const cert = await getCertificateByCode(code);
  if (!cert) return null;
  const db = await getDb();
  const [student, program, batch] = await Promise.all([
    db.collection<{ _id: string; fullName: string; studentCode: string }>("training_students").findOne({ _id: cert.studentId }),
    db.collection<{ _id: string; name: string }>("training_programs").findOne({ _id: cert.programId }),
    cert.batchId ? db.collection<{ _id: string; name: string }>("training_batches").findOne({ _id: cert.batchId }) : Promise.resolve(null),
  ]);
  return {
    ...cert,
    studentName: student?.fullName ?? "Unknown",
    studentCode: student?.studentCode ?? null,
    programName: program?.name ?? "Unknown program",
    batchName: batch?.name ?? null,
    typeLabel: CERTIFICATE_TYPES.find((t) => t.value === cert.type)?.label ?? "Certificate",
  };
}

export default async function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [cert, settings] = await Promise.all([loadView(code), getTmsSettings()]);

  const valid = cert && !cert.revoked;

  return (
    <div className="lms-shell flex min-h-screen flex-col items-center justify-center gap-6 bg-[#e9ebee] px-4 py-12 dark:bg-background">
      <div className="flex items-center gap-2 text-lg font-bold">
        <BrandMark className="size-7 shrink-0" />
        {brandify("YashOrbit")} <span className="text-foreground">Training</span>
      </div>

      <div className="w-full max-w-md rounded-3xl border border-border/40 bg-background/95 p-6 shadow-none backdrop-blur-md dark:bg-card/85">
        {!cert ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <XCircle className="size-12 text-destructive" />
            <h1 className="text-xl font-bold text-foreground">Certificate not found</h1>
            <p className="text-sm text-muted-foreground">
              No certificate matches this verification code. Check the code and try again.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2 border-b border-border/60 pb-4 text-center">
              {valid ? (
                <CheckCircle2 className="size-12 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="size-12 text-destructive" />
              )}
              <h1 className="text-xl font-bold text-foreground">
                {valid ? "Verified certificate" : "Certificate revoked"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {valid
                  ? `Issued by ${settings.institute.name}.`
                  : `This certificate was revoked${cert.revokedReason ? `: ${cert.revokedReason}` : "."}`}
              </p>
            </div>

            <dl className="space-y-2.5 py-4 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Certificate No.</dt>
                <dd className="font-mono">{cert.certificateNumber}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="font-medium">{cert.typeLabel}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Awarded to</dt>
                <dd className="font-medium">{cert.studentName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Program</dt>
                <dd className="text-right">{cert.programName}</dd>
              </div>
              {cert.batchName && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Batch</dt>
                  <dd className="text-right">{cert.batchName}</dd>
                </div>
              )}
              {cert.title && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Details</dt>
                  <dd className="text-right">{cert.title}</dd>
                </div>
              )}
              {cert.grade && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Grade</dt>
                  <dd className="font-medium">{cert.grade}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Issued on</dt>
                <dd>{new Date(`${cert.issuedOn}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</dd>
              </div>
            </dl>
          </>
        )}
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5" />
        Independent verification · <Link href="/" className="hover:underline">yashorbit.com</Link>
      </p>
    </div>
  );
}
