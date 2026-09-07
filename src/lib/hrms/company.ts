import "server-only";
import { getDb } from "@/lib/mongodb";
import { updateStamp } from "@/lib/hrms/db";
import { organizationInfo } from "@/lib/seo";

/**
 * Company / employer identity for payslips and other official documents. Single
 * document (`hrms_company` / `_id: "org"`). Editable in Settings → Company
 * (super_admin only). Same shape/behaviour as `payroll-config.ts`.
 */

export const COMPANY_COLLECTION = "hrms_company";
const COMPANY_ID = "org";

export interface CompanyDetails {
  _id: string;
  name: string;
  legalName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
  phone: string;
  website: string;
  /** Statutory registrations — all optional; blank fields are hidden on the payslip. */
  pan: string;
  gstin: string;
  cin: string;
  pfEstablishmentCode: string;
  esiEstablishmentCode: string;
  lin: string;
  signatoryName: string;
  signatoryDesignation: string;
  payslipNote: string;
  updatedAt: Date;
  updatedBy: string | null;
}

const DEFAULTS: Omit<CompanyDetails, "_id" | "updatedAt" | "updatedBy"> = {
  name: organizationInfo.name,
  legalName: organizationInfo.legalName,
  addressLine1: organizationInfo.address.streetAddress,
  addressLine2: "",
  city: organizationInfo.address.addressLocality,
  state: organizationInfo.address.addressRegion,
  postalCode: organizationInfo.address.postalCode,
  country: "India",
  email: organizationInfo.email,
  phone: organizationInfo.telephone,
  website: organizationInfo.url,
  pan: "",
  gstin: "",
  cin: "",
  pfEstablishmentCode: "",
  esiEstablishmentCode: "",
  lin: "",
  signatoryName: "",
  signatoryDesignation: "Authorised Signatory",
  payslipNote: "This payslip is confidential. Contact HR for any discrepancy within 30 days.",
};

export async function getCompanyDetails(): Promise<CompanyDetails> {
  const db = await getDb();
  const collection = db.collection<CompanyDetails>(COMPANY_COLLECTION);
  const existing = await collection.findOne({ _id: COMPANY_ID });
  if (existing) return { ...DEFAULTS, ...existing };
  const doc: CompanyDetails = { _id: COMPANY_ID, ...DEFAULTS, updatedAt: new Date(), updatedBy: null };
  await collection.updateOne({ _id: COMPANY_ID }, { $setOnInsert: doc }, { upsert: true });
  return doc;
}

export type CompanyDetailsInput = Omit<CompanyDetails, "_id" | "updatedAt" | "updatedBy">;

export async function updateCompanyDetails(data: CompanyDetailsInput, actorId: string): Promise<CompanyDetails> {
  const db = await getDb();
  const collection = db.collection<CompanyDetails>(COMPANY_COLLECTION);
  const result = await collection.findOneAndUpdate(
    { _id: COMPANY_ID },
    { $set: { ...data, ...updateStamp(actorId) } },
    { upsert: true, returnDocument: "after" }
  );
  return { ...DEFAULTS, ...(result as CompanyDetails) };
}

/** One-line address string, e.g. for the payslip header. Blank parts dropped. */
export function formatCompanyAddress(c: CompanyDetails): string {
  return [c.addressLine1, c.addressLine2, c.city, c.state, c.postalCode, c.country]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(", ");
}
