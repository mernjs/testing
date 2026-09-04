export const LEAD_STATUSES = [
  { value: "new", label: "New", badgeClass: "bg-secondary text-secondary-foreground" },
  { value: "in_progress", label: "In Progress", badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  { value: "completed", label: "Completed", badgeClass: "bg-green-500/15 text-green-600 dark:text-green-400" },
  { value: "rejected", label: "Rejected", badgeClass: "bg-destructive/15 text-destructive" },
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number]["value"];

export const DEFAULT_LEAD_STATUS: LeadStatus = "new";

export function isValidLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUSES.some((s) => s.value === value);
}

export function getStatusMeta(status: string | undefined) {
  return LEAD_STATUSES.find((s) => s.value === status) ?? LEAD_STATUSES[0];
}
