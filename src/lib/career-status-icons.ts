import { Sparkles, Clock, Star, CalendarClock, CheckCircle, Award, XCircle, type LucideIcon } from "lucide-react";
import type { CareerApplicationStatus } from "@/lib/career-application-status";

export const CAREER_STATUS_ICONS: Record<CareerApplicationStatus, LucideIcon> = {
  new: Sparkles,
  under_review: Clock,
  shortlisted: Star,
  interview_scheduled: CalendarClock,
  selected: CheckCircle,
  hired: Award,
  rejected: XCircle,
};

/** Distinct accent hex per status, reusing the fixed dataviz-skill status palette
 * where a direct match exists and a couple of extra hues for the career-only
 * intermediate stages, kept visually distinct from the categorical palette. */
export const CAREER_STATUS_COLORS: Record<CareerApplicationStatus, string> = {
  new: "#94a3b8",
  under_review: "#2a78d6",
  shortlisted: "#4a3aa7",
  interview_scheduled: "#fab219",
  selected: "#1baf7a",
  hired: "#0ca30c",
  rejected: "#d03b3b",
};
