/**
 * Client-safe constants for the Activity Log — split out of `activity-log.ts`
 * because that file has `import "server-only"` (it imports the mongodb
 * driver directly); pulling any export from it into a "use client" component
 * poisons the whole client bundle and crashes the dev server. Nothing here
 * touches the database — safe to import from client components.
 */

export const ACTIVITY_LOG_MODULES = ["prms", "pms", "yashchat", "tms", "hrms", "portal", "ots"] as const;
export type ActivityLogModule = (typeof ACTIVITY_LOG_MODULES)[number];

const MODULE_LABELS: Record<ActivityLogModule, string> = {
  prms: "Procurement",
  pms: "Project Management",
  yashchat: "YashChat",
  tms: "Training",
  hrms: "HRMS",
  portal: "External Portal",
  ots: "Online Tests",
};

export function activityModuleLabel(module: string): string {
  return MODULE_LABELS[module as ActivityLogModule] ?? module;
}
