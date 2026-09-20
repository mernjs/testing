/**
 * External User Portal (`/portal`) role model. Unlike the internal panels, portal
 * users live in their **own** `external_users` collection — never `admin_users` —
 * and each account has exactly one role that decides which of the four completely
 * separate portal experiences they get.
 *
 * The whole portal UI (sidebar, dashboard, available modules) is generated from
 * `PORTAL_NAV` + the dashboard switch — there is no shared screen with hidden
 * sections.
 */

export const PORTAL_ROLES = ["job_applicant", "intern", "trainee", "client"] as const;
export type PortalRole = (typeof PORTAL_ROLES)[number];

export const PORTAL_ROLE_META: Record<PortalRole, { label: string; portalName: string; description: string }> = {
  job_applicant: {
    label: "Job Applicant",
    portalName: "Applicant Portal",
    description: "Track your application status, hiring progress, interviews and offer.",
  },
  intern: {
    label: "Intern",
    portalName: "Internship Portal",
    description: "Your internship progress, mentor, batch, projects, assignments, attendance and certificate.",
  },
  trainee: {
    label: "Trainee",
    portalName: "Industrial Training Portal",
    description: "Your training program, classes, mentor, attendance, projects, certificates and fees.",
  },
  client: {
    label: "Client",
    portalName: "Client Portal",
    description: "Your projects, milestones, meetings, shared documents and invoice summary.",
  },
};

export function isPortalRole(v: unknown): v is PortalRole {
  return typeof v === "string" && (PORTAL_ROLES as readonly string[]).includes(v);
}

/** Both learner roles share the same module set (differ only in dashboard layout + labels). */
export function isLearner(role: PortalRole): boolean {
  return role === "intern" || role === "trainee";
}

// ---------------------------------------------------------------------------
// Dynamic navigation — the sidebar is `PORTAL_NAV[user.role]`, nothing else.
// `icon` is a lucide-react icon name resolved in `PortalSidebar`.
// ---------------------------------------------------------------------------

export interface PortalNavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
}

const JOURNEY_NAV: PortalNavItem[] = [
  { href: "/portal/journey", label: "My Journey", icon: "Route" },
  { href: "/portal/messages", label: "Messages", icon: "MessagesSquare" },
];

const WALLET_NAV: PortalNavItem[] = [
  { href: "/portal/wallet", label: "Wallet", icon: "Coins" },
  { href: "/portal/referrals", label: "Referrals", icon: "Gift" },
];

const SHARED_TAIL: PortalNavItem[] = [
  { href: "/portal/documents", label: "Documents", icon: "FolderOpen" },
  { href: "/portal/profile", label: "Profile", icon: "CircleUser" },
];

export const PORTAL_NAV: Record<PortalRole, PortalNavItem[]> = {
  job_applicant: [
    { href: "/portal", label: "Dashboard", icon: "LayoutDashboard", exact: true },
    ...JOURNEY_NAV,
    { href: "/portal/application", label: "My Application", icon: "FileText" },
    { href: "/portal/interviews", label: "Interview Schedule", icon: "CalendarClock" },
    ...WALLET_NAV,
    ...SHARED_TAIL,
  ],
  intern: [
    { href: "/portal", label: "Dashboard", icon: "LayoutDashboard", exact: true },
    ...JOURNEY_NAV,
    { href: "/portal/program", label: "My Internship", icon: "GraduationCap" },
    { href: "/portal/schedule", label: "Batch Schedule", icon: "CalendarClock" },
    { href: "/portal/projects", label: "Projects", icon: "FolderKanban" },
    { href: "/portal/assignments", label: "Assignments", icon: "ClipboardList" },
    { href: "/portal/attendance", label: "Attendance", icon: "CalendarCheck" },
    { href: "/portal/certificates", label: "Certificates", icon: "Award" },
    { href: "/portal/payments", label: "Payments", icon: "Wallet" },
    ...WALLET_NAV,
    ...SHARED_TAIL,
  ],
  trainee: [
    { href: "/portal", label: "Dashboard", icon: "LayoutDashboard", exact: true },
    ...JOURNEY_NAV,
    { href: "/portal/program", label: "My Program", icon: "GraduationCap" },
    { href: "/portal/schedule", label: "Class Schedule", icon: "CalendarClock" },
    { href: "/portal/projects", label: "Projects", icon: "FolderKanban" },
    { href: "/portal/assignments", label: "Assignments", icon: "ClipboardList" },
    { href: "/portal/attendance", label: "Attendance", icon: "CalendarCheck" },
    { href: "/portal/certificates", label: "Certificates", icon: "Award" },
    { href: "/portal/payments", label: "Payments", icon: "Wallet" },
    ...WALLET_NAV,
    ...SHARED_TAIL,
  ],
  client: [
    { href: "/portal", label: "Dashboard", icon: "LayoutDashboard", exact: true },
    ...JOURNEY_NAV,
    { href: "/portal/projects", label: "My Projects", icon: "FolderKanban" },
    { href: "/portal/milestones", label: "Milestones", icon: "Flag" },
    { href: "/portal/meetings", label: "Meetings", icon: "CalendarClock" },
    { href: "/portal/invoices", label: "Invoices", icon: "ReceiptText" },
    ...WALLET_NAV,
    ...SHARED_TAIL,
  ],
};

/** Route-group access — which roles may open a `(learner)` / `(applicant)` / `(client)` page. */
export const ROUTE_GROUP_ROLES = {
  applicant: ["job_applicant"] as PortalRole[],
  learner: ["intern", "trainee"] as PortalRole[],
  client: ["client"] as PortalRole[],
};

export function roleHome(): string {
  return "/portal";
}
