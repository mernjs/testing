import { GST_RATE } from "@/lib/platform/billing/types";

/**
 * Indian GST for the platform's SaaS invoices. Client-safe, pure functions —
 * no data access. Money is integer paise throughout.
 *
 * Catalogue prices are exclusive of tax, but what a customer is charged (and
 * what an invoice is issued for) is the tax-inclusive amount, so the taxable
 * value is back-calculated from it and the parts always add up to exactly
 * the amount charged.
 */

/** SAC 998314 — IT design and development services (SaaS subscriptions are billed under it). */
export const SAAS_SAC_CODE = "998314";

/** GST state / union-territory codes (the first two digits of a GSTIN). */
export const GST_STATE_CODES: Record<string, string> = {
  "01": "Jammu and Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "25": "Daman and Diu",
  "26": "Dadra and Nagar Haveli and Daman and Diu",
  "27": "Maharashtra",
  "28": "Andhra Pradesh (Old)",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman and Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
  "97": "Other Territory",
  "99": "Centre Jurisdiction",
};

const key = (s: string) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, "");

/** Name → code, including common older/alternative spellings. */
const STATE_BY_NAME: Record<string, string> = {
  ...Object.fromEntries(Object.entries(GST_STATE_CODES).filter(([code]) => code !== "28" && code !== "25").map(([code, name]) => [key(name), code])),
  nctofdelhi: "07",
  newdelhi: "07",
  orissa: "21",
  pondicherry: "34",
  uttaranchal: "05",
  andamanandnicobar: "35",
  dadraandnagarhaveli: "26",
  damananddiu: "26",
  jandk: "01",
};

/**
 * The GST state code for a state given as a name ("Uttar Pradesh", "orissa")
 * or a code ("09", "9"); null when it can't be identified.
 */
export function gstStateCode(state: string | null | undefined): string | null {
  const s = (state ?? "").trim();
  if (!s) return null;
  if (/^\d{1,2}$/.test(s)) {
    const code = s.padStart(2, "0");
    return GST_STATE_CODES[code] ? code : null;
  }
  return STATE_BY_NAME[key(s)] ?? null;
}

const GSTIN_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const GSTIN_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/** Uppercase, spaces removed. */
export function normalizeGstin(gstin: string | null | undefined): string {
  return (gstin ?? "").replace(/\s+/g, "").toUpperCase();
}

function gstinCheckChar(first14: string): string {
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    const product = GSTIN_CHARS.indexOf(first14[i]) * (i % 2 === 0 ? 1 : 2);
    sum += Math.floor(product / 36) + (product % 36);
  }
  return GSTIN_CHARS[(36 - (sum % 36)) % 36];
}

/**
 * Why a GSTIN is invalid, or null when it's valid: 15 characters — 2-digit
 * state code, 10-character PAN, entity number, "Z", check character — with a
 * known state code and a correct check character.
 */
export function gstinError(gstin: string | null | undefined): string | null {
  const g = normalizeGstin(gstin);
  if (!g) return "GSTIN is empty.";
  if (g.length !== 15) return "A GSTIN has exactly 15 characters.";
  if (!GSTIN_PATTERN.test(g)) return "That doesn't look like a GSTIN (e.g. 09AAACY1234A1Z5).";
  if (!GST_STATE_CODES[g.slice(0, 2)]) return `Unknown GST state code "${g.slice(0, 2)}".`;
  if (gstinCheckChar(g.slice(0, 14)) !== g[14]) return "GSTIN check character doesn't match — please re-check it.";
  return null;
}

export function isValidGstin(gstin: string | null | undefined): boolean {
  return gstinError(gstin) === null;
}

/** State code from a valid GSTIN, else null. */
export function stateCodeFromGstin(gstin: string | null | undefined): string | null {
  return isValidGstin(gstin) ? normalizeGstin(gstin).slice(0, 2) : null;
}

/** A party's GST state: its GSTIN's state when it has a valid one, else its stated state. */
export function resolveGstState(gstin: string | null | undefined, state: string | null | undefined): { code: string; name: string } | null {
  const code = stateCodeFromGstin(gstin) ?? gstStateCode(state);
  return code ? { code, name: GST_STATE_CODES[code] } : null;
}

export type SupplyType = "intra" | "inter";

export interface GstBreakdown {
  /** intra-state → CGST + SGST; inter-state (or unknown state) → IGST. */
  supplyType: SupplyType;
  /** Combined rate, e.g. 0.18. */
  rate: number;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  tax: number;
  total: number;
}

/**
 * Splits a tax-inclusive amount (paise) into taxable value and GST.
 * Intra-state = both states known and equal. taxable + cgst + sgst + igst is
 * always exactly `total`: the taxable value is rounded to the paisa, tax is
 * the remainder, and SGST takes any odd paisa of the CGST/SGST split.
 */
export function splitGstInclusive(total: number, sellerStateCode: string | null, buyerStateCode: string | null, rate = GST_RATE): GstBreakdown {
  if (!Number.isInteger(total) || total < 0) throw new Error(`GST amount must be a non-negative integer in paise (got ${total})`);
  const supplyType: SupplyType = sellerStateCode && buyerStateCode && sellerStateCode === buyerStateCode ? "intra" : "inter";
  const taxable = Math.round(total / (1 + rate));
  const tax = total - taxable;
  const cgst = supplyType === "intra" ? Math.round(tax / 2) : 0;
  const sgst = supplyType === "intra" ? tax - cgst : 0;
  const igst = supplyType === "inter" ? tax : 0;
  return { supplyType, rate, taxable, cgst, sgst, igst, tax, total };
}

/** "18%" / "9%" labels from a rate. */
export function gstPercentLabel(rate: number): string {
  const pct = Math.round(rate * 10_000) / 100;
  return `${pct}%`;
}
