import "server-only";
import { isDateString, isTimeString, parseHHmm } from "@/lib/hrms/time";
import { isValidHolidayType, type HolidayType } from "@/lib/hrms/holiday-types";
import { isValidAttendanceStatus, MANUAL_ATTENDANCE_STATUSES, type AttendanceStatus } from "@/lib/hrms/attendance-status";

/**
 * Server-side validators for the Phase 2a modules — same
 * `{ valid, data } | { valid, errors }` contract as `validation.ts`.
 */

type Ok<T> = { valid: true; data: T };
type Err = { valid: false; errors: Record<string, string> };

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}
function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  const n = Number(str(v));
  return Number.isFinite(n) ? n : NaN;
}
function bool(v: unknown): boolean {
  return v === true || v === "true" || v === "on" || v === 1 || v === "1";
}

// ---------------------------------------------------------------------------
// Org settings
// ---------------------------------------------------------------------------

export interface OrgSettingsData {
  workingDays: number[];
  shiftStart: string;
  shiftEnd: string;
  graceMinutes: number;
  earlyDepartureMinutes: number;
  halfDayHours: number;
  fullDayHours: number;
  timezone: string;
}

export function validateOrgSettings(input: Record<string, unknown>): Ok<OrgSettingsData> | Err {
  const errors: Record<string, string> = {};

  const rawDays = Array.isArray(input.workingDays) ? input.workingDays : [];
  const workingDays = Array.from(new Set(rawDays.map((d) => Number(d)).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))).sort();
  if (workingDays.length === 0) errors.workingDays = "Select at least one working day.";

  const shiftStart = str(input.shiftStart);
  const shiftEnd = str(input.shiftEnd);
  if (!isTimeString(shiftStart)) errors.shiftStart = "Enter a valid time (HH:mm).";
  if (!isTimeString(shiftEnd)) errors.shiftEnd = "Enter a valid time (HH:mm).";
  if (isTimeString(shiftStart) && isTimeString(shiftEnd) && parseHHmm(shiftEnd) <= parseHHmm(shiftStart)) {
    errors.shiftEnd = "Shift end must be after shift start.";
  }

  const graceMinutes = num(input.graceMinutes);
  const earlyDepartureMinutes = num(input.earlyDepartureMinutes);
  const halfDayHours = num(input.halfDayHours);
  const fullDayHours = num(input.fullDayHours);
  if (!(graceMinutes >= 0 && graceMinutes <= 240)) errors.graceMinutes = "0–240 minutes.";
  if (!(earlyDepartureMinutes >= 0 && earlyDepartureMinutes <= 240)) errors.earlyDepartureMinutes = "0–240 minutes.";
  if (!(halfDayHours > 0 && halfDayHours <= 24)) errors.halfDayHours = "Enter hours (0–24).";
  if (!(fullDayHours > 0 && fullDayHours <= 24)) errors.fullDayHours = "Enter hours (0–24).";
  if (!errors.halfDayHours && !errors.fullDayHours && halfDayHours >= fullDayHours) {
    errors.halfDayHours = "Half-day hours must be less than full-day hours.";
  }

  const timezone = str(input.timezone) || "Asia/Kolkata";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    data: {
      workingDays,
      shiftStart,
      shiftEnd,
      graceMinutes: Math.round(graceMinutes),
      earlyDepartureMinutes: Math.round(earlyDepartureMinutes),
      halfDayHours,
      fullDayHours,
      timezone,
    },
  };
}

// ---------------------------------------------------------------------------
// Holiday
// ---------------------------------------------------------------------------

export function validateHoliday(input: Record<string, unknown>): Ok<{ date: string; name: string; type: HolidayType }> | Err {
  const errors: Record<string, string> = {};
  const date = str(input.date);
  if (!isDateString(date)) errors.date = "Select a valid date.";
  const name = str(input.name);
  if (!name) errors.name = "Name is required.";
  else if (name.length > 120) errors.name = "Name must be 120 characters or fewer.";
  const type = str(input.type);
  if (!isValidHolidayType(type)) errors.type = "Select a holiday type.";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return { valid: true, data: { date, name, type: type as HolidayType } };
}

// ---------------------------------------------------------------------------
// Leave type
// ---------------------------------------------------------------------------

export function validateLeaveType(
  input: Record<string, unknown>
): Ok<{ code: string; label: string; paid: boolean; defaultAnnualQuota: number; allowNegativeBalance: boolean; active: boolean }> | Err {
  const errors: Record<string, string> = {};
  const code = str(input.code).toLowerCase();
  if (!code) errors.code = "Code is required.";
  else if (!/^[a-z0-9_]{2,20}$/.test(code)) errors.code = "2–20 chars: lowercase letters, digits, underscore.";
  const label = str(input.label);
  if (!label) errors.label = "Label is required.";
  else if (label.length > 60) errors.label = "Label must be 60 characters or fewer.";
  const quota = num(input.defaultAnnualQuota);
  if (!(quota >= 0 && quota <= 365)) errors.defaultAnnualQuota = "Enter a quota between 0 and 365.";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    data: {
      code,
      label,
      paid: bool(input.paid),
      defaultAnnualQuota: Math.round(quota * 2) / 2,
      allowNegativeBalance: bool(input.allowNegativeBalance),
      active: input.active === undefined ? true : bool(input.active),
    },
  };
}

// ---------------------------------------------------------------------------
// Leave request
// ---------------------------------------------------------------------------

export function validateLeaveRequest(
  input: Record<string, unknown>
): Ok<{ employeeId: string; leaveTypeCode: string; startDate: string; endDate: string; halfDayStart: boolean; halfDayEnd: boolean; reason: string }> | Err {
  const errors: Record<string, string> = {};
  const employeeId = str(input.employeeId);
  if (!employeeId) errors.employeeId = "Select an employee.";
  const leaveTypeCode = str(input.leaveTypeCode);
  if (!leaveTypeCode) errors.leaveTypeCode = "Select a leave type.";
  const startDate = str(input.startDate);
  const endDate = str(input.endDate) || startDate;
  if (!isDateString(startDate)) errors.startDate = "Select a start date.";
  if (!isDateString(endDate)) errors.endDate = "Select a valid end date.";
  if (!errors.startDate && !errors.endDate && endDate < startDate) errors.endDate = "End date is before start date.";
  const reason = str(input.reason);
  if (reason.length > 1000) errors.reason = "Reason must be 1000 characters or fewer.";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    data: {
      employeeId,
      leaveTypeCode,
      startDate,
      endDate,
      halfDayStart: bool(input.halfDayStart),
      halfDayEnd: bool(input.halfDayEnd),
      reason,
    },
  };
}

// ---------------------------------------------------------------------------
// Attendance entry
// ---------------------------------------------------------------------------

export function validateAttendanceEntry(
  input: Record<string, unknown>
): Ok<{ status: AttendanceStatus; checkIn: string | null; checkOut: string | null; breakMinutes: number; note: string | null }> | Err {
  const errors: Record<string, string> = {};
  const status = str(input.status);
  if (!isValidAttendanceStatus(status) || !MANUAL_ATTENDANCE_STATUSES.includes(status as AttendanceStatus)) {
    errors.status = "Pick Present, Half Day or Absent.";
  }

  const checkIn = str(input.checkIn) || null;
  const checkOut = str(input.checkOut) || null;
  if (checkIn && !isTimeString(checkIn)) errors.checkIn = "Enter a valid time (HH:mm).";
  if (checkOut && !isTimeString(checkOut)) errors.checkOut = "Enter a valid time (HH:mm).";
  if (checkIn && checkOut && isTimeString(checkIn) && isTimeString(checkOut) && parseHHmm(checkOut) <= parseHHmm(checkIn)) {
    errors.checkOut = "Check-out must be after check-in.";
  }

  const breakMinutes = num(input.breakMinutes) || 0;
  if (!(breakMinutes >= 0 && breakMinutes <= 600)) errors.breakMinutes = "0–600 minutes.";

  const note = str(input.note);
  if (note.length > 500) errors.note = "Note must be 500 characters or fewer.";

  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    data: {
      status: status as AttendanceStatus,
      checkIn,
      checkOut,
      breakMinutes: Math.round(breakMinutes),
      note: note || null,
    },
  };
}
