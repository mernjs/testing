import "server-only";
import {
  isValidProgramCategory,
  isValidProgramStatus,
  isValidTrainingMode,
  DEFAULT_PROGRAM_CATEGORY,
  DEFAULT_PROGRAM_STATUS,
  DEFAULT_TRAINING_MODE,
  DEFAULT_CURRENCY,
  SUPPORTED_CURRENCIES,
} from "@/lib/tms/constants";
import type { ProgramWriteData } from "@/lib/tms/programs";

/**
 * Hand-rolled server-side validators. Same `{ valid, data } | { valid, errors }`
 * contract as `src/lib/pms/validation.ts`.
 */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type Ok<T> = { valid: true; data: T };
type Err = { valid: false; errors: Record<string, string> };

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
function optStr(v: unknown, max = 2000): string | null {
  const s = str(v);
  return s ? s.slice(0, max) : null;
}
function optNum(
  v: unknown,
  errors: Record<string, string>,
  key: string,
  { min = 0 }: { min?: number } = {}
): number | null {
  const s = str(v);
  if (s === "" && typeof v !== "number") return null;
  const n = typeof v === "number" ? v : Number(s);
  if (!Number.isFinite(n)) {
    errors[key] = "Enter a valid number.";
    return null;
  }
  if (n < min) {
    errors[key] = `Must be ${min} or more.`;
    return null;
  }
  return n;
}
function lines(v: unknown, max = 40): string[] {
  if (Array.isArray(v)) return Array.from(new Set(v.map((x) => String(x).trim()).filter(Boolean))).slice(0, max);
  return str(v)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s, i, a) => a.indexOf(s) === i)
    .slice(0, max);
}
function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "on" || v === "1";
}
function currency(v: unknown): string {
  const c = str(v).toUpperCase() || DEFAULT_CURRENCY;
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(c) ? c : DEFAULT_CURRENCY;
}

// Re-exported for callers that need the plain date guard (later phases).
export function optDate(v: unknown, errors: Record<string, string>, key: string): string | null {
  const s = str(v);
  if (!s) return null;
  if (!DATE_RE.test(s) || Number.isNaN(new Date(s).getTime())) {
    errors[key] = "Enter a valid date.";
    return null;
  }
  return s;
}

// ---------------------------------------------------------------------------
// Program
// ---------------------------------------------------------------------------

export function validateProgram(input: Record<string, unknown>): Ok<ProgramWriteData> | Err {
  const errors: Record<string, string> = {};

  const name = str(input.name);
  if (!name) errors.name = "Program name is required.";
  if (name.length > 200) errors.name = "Program name is too long.";

  const categoryRaw = str(input.category) || DEFAULT_PROGRAM_CATEGORY;
  if (!isValidProgramCategory(categoryRaw)) errors.category = "Unknown category.";

  const modeRaw = str(input.mode) || DEFAULT_TRAINING_MODE;
  if (!isValidTrainingMode(modeRaw)) errors.mode = "Unknown mode.";

  const statusRaw = str(input.status) || DEFAULT_PROGRAM_STATUS;
  if (!isValidProgramStatus(statusRaw)) errors.status = "Unknown status.";

  const durationWeeks = optNum(input.durationWeeks, errors, "durationWeeks", { min: 0 });
  const fees = optNum(input.fees, errors, "fees", { min: 0 });
  const liveProjectCount = optNum(input.liveProjectCount, errors, "liveProjectCount", { min: 0 }) ?? 0;

  if (Object.keys(errors).length > 0) return { valid: false, errors };

  return {
    valid: true,
    data: {
      name,
      category: isValidProgramCategory(categoryRaw) ? categoryRaw : DEFAULT_PROGRAM_CATEGORY,
      technology: optStr(input.technology, 160),
      durationWeeks: durationWeeks !== null ? Math.round(durationWeeks) : null,
      mode: isValidTrainingMode(modeRaw) ? modeRaw : DEFAULT_TRAINING_MODE,
      fees,
      currency: currency(input.currency),
      description: optStr(input.description, 8000),
      learningOutcomes: lines(input.learningOutcomes),
      tools: lines(input.tools, 60),
      liveProjectCount: Math.round(liveProjectCount),
      certificateIncluded: input.certificateIncluded === undefined ? true : bool(input.certificateIncluded),
      placementAssistance: bool(input.placementAssistance),
      status: isValidProgramStatus(statusRaw) ? statusRaw : DEFAULT_PROGRAM_STATUS,
    },
  };
}
