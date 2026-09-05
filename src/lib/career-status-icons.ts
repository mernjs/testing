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

/** Chart accent per status — brand coral + blue, with green kept for the two
 * "won" stages and destructive red for rejected. Intermediate stages are
 * blue/coral tints so charts stay on the YashOrbit palette. */
export const CAREER_STATUS_COLORS: Record<CareerApplicationStatus, string> = {
  new: "#1D428A",
  under_review: "#3b6fd4",
  shortlisted: "#E56043",
  interview_scheduled: "#ff8e75",
  selected: "#1baf7a",
  hired: "#0ca30c",
  rejected: "#d03b3b",
};
