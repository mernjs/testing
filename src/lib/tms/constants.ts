/**
 * Client-safe TMS constants and pure helpers. NEVER import `server-only` here —
 * this module is imported by client components (badges, forms, tables). Server
 * modules re-export from here where convenient.
 *
 * Badge/dot class shapes mirror `src/lib/pms/constants.ts` so the shared badge
 * styling applies unchanged.
 */

// ---------------------------------------------------------------------------
// Program category (Industrial Training vs Internship)
// ---------------------------------------------------------------------------

export const PROGRAM_CATEGORIES = [
  { value: "industrial", label: "Industrial Training", badgeClass: "bg-primary/10 text-primary", dotClass: "bg-primary/70" },
  { value: "internship", label: "Internship Program", badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400", dotClass: "bg-blue-500" },
] as const;

export type ProgramCategory = (typeof PROGRAM_CATEGORIES)[number]["value"];

export const DEFAULT_PROGRAM_CATEGORY: ProgramCategory = "industrial";

export function isValidProgramCategory(value: unknown): value is ProgramCategory {
  return typeof value === "string" && PROGRAM_CATEGORIES.some((c) => c.value === value);
}

export function getProgramCategoryMeta(value: string | undefined) {
  return PROGRAM_CATEGORIES.find((c) => c.value === value) ?? PROGRAM_CATEGORIES[0];
}

// ---------------------------------------------------------------------------
// Program status
// ---------------------------------------------------------------------------

export const PROGRAM_STATUSES = [
  { value: "draft", label: "Draft", badgeClass: "bg-secondary/60 text-secondary-foreground", dotClass: "bg-secondary-foreground/50", live: false },
  { value: "active", label: "Active", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400", dotClass: "bg-green-500", live: true },
  { value: "archived", label: "Archived", badgeClass: "bg-muted text-muted-foreground", dotClass: "bg-muted-foreground/60", live: false },
] as const;

export type ProgramStatus = (typeof PROGRAM_STATUSES)[number]["value"];

export const DEFAULT_PROGRAM_STATUS: ProgramStatus = "draft";

export function isValidProgramStatus(value: unknown): value is ProgramStatus {
  return typeof value === "string" && PROGRAM_STATUSES.some((s) => s.value === value);
}

export function getProgramStatusMeta(status: string | undefined) {
  return PROGRAM_STATUSES.find((s) => s.value === status) ?? PROGRAM_STATUSES[0];
}

// ---------------------------------------------------------------------------
// Delivery mode
// ---------------------------------------------------------------------------

export const TRAINING_MODES = [
  { value: "online", label: "Online", badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400", dotClass: "bg-blue-500" },
  { value: "offline", label: "Offline", badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400", dotClass: "bg-amber-500" },
  { value: "hybrid", label: "Hybrid", badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400", dotClass: "bg-purple-500" },
] as const;

export type TrainingMode = (typeof TRAINING_MODES)[number]["value"];

export const DEFAULT_TRAINING_MODE: TrainingMode = "online";

export function isValidTrainingMode(value: unknown): value is TrainingMode {
  return typeof value === "string" && TRAINING_MODES.some((m) => m.value === value);
}

export function getTrainingModeMeta(value: string | undefined) {
  return TRAINING_MODES.find((m) => m.value === value) ?? TRAINING_MODES[0];
}

// ---------------------------------------------------------------------------
// Batch status
// ---------------------------------------------------------------------------

export const BATCH_STATUSES = [
  { value: "upcoming", label: "Upcoming", badgeClass: "bg-secondary/60 text-secondary-foreground", dotClass: "bg-secondary-foreground/50", running: false },
  { value: "running", label: "Running", badgeClass: "bg-primary/10 text-primary", dotClass: "bg-primary/70", running: true },
  { value: "completed", label: "Completed", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400", dotClass: "bg-green-500", running: false },
  { value: "cancelled", label: "Cancelled", badgeClass: "bg-destructive/15 text-destructive", dotClass: "bg-destructive", running: false },
] as const;

export type BatchStatus = (typeof BATCH_STATUSES)[number]["value"];

export const DEFAULT_BATCH_STATUS: BatchStatus = "upcoming";

export function isValidBatchStatus(value: unknown): value is BatchStatus {
  return typeof value === "string" && BATCH_STATUSES.some((s) => s.value === value);
}

export function getBatchStatusMeta(status: string | undefined) {
  return BATCH_STATUSES.find((s) => s.value === status) ?? BATCH_STATUSES[0];
}

// ---------------------------------------------------------------------------
// Application pipeline status
// ---------------------------------------------------------------------------

export const APPLICATION_STATUSES = [
  { value: "new", label: "New", badgeClass: "bg-secondary/60 text-secondary-foreground", dotClass: "bg-secondary-foreground/50", terminal: false },
  { value: "contacted", label: "Contacted", badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400", dotClass: "bg-blue-500", terminal: false },
  { value: "shortlisted", label: "Shortlisted", badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400", dotClass: "bg-purple-500", terminal: false },
  { value: "enrolled", label: "Enrolled", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400", dotClass: "bg-green-500", terminal: true },
  { value: "rejected", label: "Rejected", badgeClass: "bg-destructive/15 text-destructive", dotClass: "bg-destructive", terminal: true },
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]["value"];

export const DEFAULT_APPLICATION_STATUS: ApplicationStatus = "new";

export function isValidApplicationStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && APPLICATION_STATUSES.some((s) => s.value === value);
}

export function getApplicationStatusMeta(status: string | undefined) {
  return APPLICATION_STATUSES.find((s) => s.value === status) ?? APPLICATION_STATUSES[0];
}

// ---------------------------------------------------------------------------
// Student lifecycle status
// ---------------------------------------------------------------------------

export const STUDENT_STATUSES = [
  { value: "active", label: "Active", badgeClass: "bg-primary/10 text-primary", dotClass: "bg-primary/70" },
  { value: "completed", label: "Completed", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400", dotClass: "bg-green-500" },
  { value: "dropped", label: "Dropped", badgeClass: "bg-destructive/15 text-destructive", dotClass: "bg-destructive" },
  { value: "on_hold", label: "On Hold", badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400", dotClass: "bg-amber-500" },
] as const;

export type StudentStatus = (typeof STUDENT_STATUSES)[number]["value"];

export const DEFAULT_STUDENT_STATUS: StudentStatus = "active";

export function isValidStudentStatus(value: unknown): value is StudentStatus {
  return typeof value === "string" && STUDENT_STATUSES.some((s) => s.value === value);
}

export function getStudentStatusMeta(status: string | undefined) {
  return STUDENT_STATUSES.find((s) => s.value === status) ?? STUDENT_STATUSES[0];
}

// ---------------------------------------------------------------------------
// Certificate types
// ---------------------------------------------------------------------------

export const CERTIFICATE_TYPES = [
  { value: "industrial_training", label: "Industrial Training Certificate" },
  { value: "internship", label: "Internship Certificate" },
  { value: "project_completion", label: "Project Completion Certificate" },
  { value: "letter_of_recommendation", label: "Letter of Recommendation" },
  { value: "excellence", label: "Excellence Certificate" },
  { value: "experience", label: "Experience Certificate" },
] as const;

export type CertificateType = (typeof CERTIFICATE_TYPES)[number]["value"];

export function isValidCertificateType(value: unknown): value is CertificateType {
  return typeof value === "string" && CERTIFICATE_TYPES.some((t) => t.value === value);
}

export function getCertificateTypeLabel(value: string | undefined): string {
  return CERTIFICATE_TYPES.find((t) => t.value === value)?.label ?? "Certificate";
}

// ---------------------------------------------------------------------------
// Payment status
// ---------------------------------------------------------------------------

export const PAYMENT_STATUSES = [
  { value: "unpaid", label: "Unpaid", badgeClass: "bg-destructive/15 text-destructive", dotClass: "bg-destructive" },
  { value: "partial", label: "Partial", badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400", dotClass: "bg-amber-500" },
  { value: "paid", label: "Paid", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400", dotClass: "bg-green-500" },
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]["value"];

export function getPaymentStatusMeta(status: string | undefined) {
  return PAYMENT_STATUSES.find((s) => s.value === status) ?? PAYMENT_STATUSES[0];
}

/** Derives a payment status from paid / total amounts. */
export function computePaymentStatus(paid: number, total: number): PaymentStatus {
  if (total <= 0 || paid >= total) return "paid";
  if (paid <= 0) return "unpaid";
  return "partial";
}

// ---------------------------------------------------------------------------
// Defaults — overridable in TMS settings
// ---------------------------------------------------------------------------

export const DEFAULT_PROGRAM_TECHNOLOGIES = [
  "MERN Stack", "MEAN Stack", "Generative AI", "Agentic AI", "Conversational AI",
  "Computer Vision", "Data Science", "DevOps", "React Native", "Flutter",
  "Python", "Java", "Cloud (AWS)",
] as const;

export const DEFAULT_CURRENCY = "INR";

export const SUPPORTED_CURRENCIES = ["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "AED"] as const;

/** `{n}` → padded sequence, `{yyyy}` → year. e.g. "YO-TMS-{yyyy}-{n}". */
export const DEFAULT_CERTIFICATE_NUMBER_FORMAT = "YO-TMS-{yyyy}-{n}";

// ---------------------------------------------------------------------------
// Generic label helper
// ---------------------------------------------------------------------------

export function titleize(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
