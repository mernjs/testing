export const CAREER_APPLICATION_STATUSES = [
  { value: "new", label: "New", badgeClass: "bg-secondary text-secondary-foreground", dotClass: "bg-secondary-foreground/60" },
  { value: "under_review", label: "Under Review", badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400", dotClass: "bg-blue-500" },
  { value: "shortlisted", label: "Shortlisted", badgeClass: "bg-violet-500/15 text-violet-600 dark:text-violet-400", dotClass: "bg-violet-500" },
  { value: "interview_scheduled", label: "Interview Scheduled", badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400", dotClass: "bg-amber-500" },
  { value: "selected", label: "Selected", badgeClass: "bg-teal-500/15 text-teal-600 dark:text-teal-400", dotClass: "bg-teal-500" },
  { value: "hired", label: "Hired", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400", dotClass: "bg-green-500" },
  { value: "rejected", label: "Rejected", badgeClass: "bg-destructive/15 text-destructive", dotClass: "bg-destructive" },
] as const;

export type CareerApplicationStatus = (typeof CAREER_APPLICATION_STATUSES)[number]["value"];

export const DEFAULT_CAREER_APPLICATION_STATUS: CareerApplicationStatus = "new";

export function isValidCareerApplicationStatus(value: string): value is CareerApplicationStatus {
  return CAREER_APPLICATION_STATUSES.some((s) => s.value === value);
}

export function getCareerApplicationStatusMeta(status: string | undefined) {
  return CAREER_APPLICATION_STATUSES.find((s) => s.value === status) ?? CAREER_APPLICATION_STATUSES[0];
}
