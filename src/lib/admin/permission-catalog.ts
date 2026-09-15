/**
 * Catalog of every fine-grained, Super-Admin-overridable capability. Mirrors
 * `role-catalog.ts`'s shape but one level more granular: where `role-catalog.ts`
 * lets a super_admin grant a whole predefined role, this lets them dial in
 * individual capabilities on top of (or instead of) that role.
 *
 * Each entry's `key` is exactly the string a module's converted predicate
 * function checks via `resolvePermission()` (see `permission-overrides.ts`) —
 * e.g. `"messenger.canPostAnnouncements"` matches `canPostAnnouncements()` in
 * `messenger-roles.ts`. Keys are added here module-by-module as each module's
 * predicates are converted (see the phased plan) — a key with no matching
 * converted predicate yet would be accepted by the UI but have no effect, so
 * only add a row once its predicate is actually override-aware.
 *
 * Deliberately excluded from every module: the coarse tier-gate functions
 * (`hasXAccess`, `hasXStaffRole`) — overrides only fine-tune capabilities for
 * someone who already clears those via an existing role; see the comment on
 * each module's `(staff)/layout.tsx`.
 */

export interface PermissionOption {
  key: string;
  label: string;
  description: string;
}

export interface PermissionGroup {
  module: string;
  permissions: PermissionOption[];
}

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    module: "YashChat",
    permissions: [
      {
        key: "messenger.hasChatStaffRole",
        label: "Elevated reach",
        description: "Org-wide channel creation, moderation, and full workspace analytics.",
      },
      {
        key: "messenger.isChatAdmin",
        label: "Workspace admin actions",
        description: "Moderate any channel or message, change member roles, manage private channels.",
      },
      {
        key: "messenger.canCreateTeamChannel",
        label: "Create team channels",
        description: "Create organization-wide team channels and group chats.",
      },
      {
        key: "messenger.canPostAnnouncements",
        label: "Post announcements",
        description: "Author and publish broadcast announcements.",
      },
      {
        key: "messenger.canViewWorkspaceAnalytics",
        label: "View workspace analytics",
        description: "See the full workspace dashboard analytics, not just a personal summary.",
      },
      {
        key: "messenger.canViewAuditLog",
        label: "View audit log",
        description: "Read the YashChat audit trail.",
      },
    ],
  },
  {
    module: "Training (TMS)",
    permissions: [
      {
        key: "tms.isTmsAdmin",
        label: "TMS admin actions",
        description: "Everything a TMS Admin can do — the broadest single grant in this module.",
      },
      {
        key: "tms.canManageTraining",
        label: "Manage training delivery",
        description: "Full delivery-operations access: programs, batches, applications, students, classes, projects.",
      },
      {
        key: "tms.canManageProgramsBatches",
        label: "Manage programs & batches",
        description: "Create, edit and archive any program or batch.",
      },
      {
        key: "tms.canManageStudents",
        label: "Manage students",
        description: "Create / edit students and move applications through the pipeline.",
      },
      {
        key: "tms.canIssueCertificates",
        label: "Issue certificates",
        description: "Issue, reissue and revoke certificates.",
      },
      {
        key: "tms.canManagePayments",
        label: "Manage payments",
        description: "Record payments, edit fee structures and view revenue analytics.",
      },
      {
        key: "tms.canManageSettings",
        label: "Manage TMS settings",
        description: "Edit categories, technology suggestions and institute identity.",
      },
      {
        key: "tms.canViewAuditLog",
        label: "View audit log",
        description: "Read the TMS audit trail.",
      },
    ],
  },
  {
    module: "HRMS",
    permissions: [
      {
        key: "hrms.canRunPayroll",
        label: "Run payroll",
        description: "Run payroll, approve runs, mark paid, download the bank file.",
      },
      {
        key: "hrms.canManageEmployeeDocuments",
        label: "Manage employee documents",
        description: "Upload, replace and delete documents on any employee.",
      },
      {
        key: "hrms.canManagePayrollConfig",
        label: "Manage payroll config",
        description: "Edit statutory payroll rates and tax configuration. Denied to every role by default — even HR.",
      },
      {
        key: "hrms.canManageEmployees",
        label: "Manage employees",
        description: "Create, edit and delete employees; change employment status.",
      },
      {
        key: "hrms.canManageMasters",
        label: "Manage master data",
        description: "Create, edit and delete departments, designations and teams.",
      },
      {
        key: "hrms.canManagePayroll",
        label: "Manage payroll data",
        description: "View and edit salary structure and bank details.",
      },
      {
        key: "hrms.canViewAllEmployees",
        label: "View all employees",
        description: "See every employee, not just the signed-in manager's reporting line.",
      },
      {
        key: "hrms.canViewAuditLog",
        label: "View audit log",
        description: "Read the HRMS audit trail. Denied to every role by default — even HR.",
      },
      {
        key: "hrms.canManageAttendance",
        label: "Manage attendance",
        description: "Record and correct attendance.",
      },
      {
        key: "hrms.canApproveLeave",
        label: "Approve leave",
        description: "File and decide leave requests.",
      },
      {
        key: "hrms.canManageHolidays",
        label: "Manage holidays",
        description: "Create, edit and delete holidays.",
      },
      {
        key: "hrms.canManageSettings",
        label: "Manage HRMS settings",
        description: "Edit the org-wide work schedule and leave-type configuration. Denied to every role by default.",
      },
    ],
  },
  {
    module: "Projects (PMS)",
    permissions: [
      {
        key: "pms.isPmsAdmin",
        label: "PMS admin actions",
        description: "Everything a PMS Admin can do — the broadest single grant in this module.",
      },
      {
        key: "pms.canViewCosting",
        label: "View costing",
        description: "View the project-costing / financial dashboards and project reports.",
      },
      {
        key: "pms.canReviewTimesheets",
        label: "Review timesheets",
        description: "Review, approve and reject submitted timesheets.",
      },
      {
        key: "pms.canManageClients",
        label: "Manage clients",
        description: "Create, edit and archive any client.",
      },
      {
        key: "pms.canManageProjects",
        label: "Manage projects",
        description: "Create, edit and delete any project, task and milestone; manage any project's team.",
      },
      {
        key: "pms.canViewAllProjects",
        label: "View all projects",
        description: "See every project, not just ones the user manages or is a member of.",
      },
      {
        key: "pms.canManageSettings",
        label: "Manage PMS settings",
        description: "Edit categories, default currency and technology suggestions.",
      },
      {
        key: "pms.canViewActivityLog",
        label: "View activity log",
        description: "Read the PMS activity log.",
      },
    ],
  },
  {
    module: "Procurement (PRMS)",
    permissions: [
      {
        key: "prms.isPrmsAdmin",
        label: "PRMS admin actions",
        description: "Everything a PRMS Admin can do — the broadest single grant in this module.",
      },
      {
        key: "prms.canManageProcurement",
        label: "Manage procurement",
        description: "Vendors, requisitions, RFQ, purchase orders, goods receipt, assets, inventory, subscriptions, contracts.",
      },
      {
        key: "prms.canManageFinance",
        label: "Manage finance",
        description: "Invoices, payments, budgets, expense approvals and financial reports.",
      },
      {
        key: "prms.canApproveRequisitions",
        label: "Approve requisitions",
        description: "Act on any level of the requisition approval chain (thresholds and per-level roles still apply).",
      },
      {
        key: "prms.canManageExpenses",
        label: "Manage expenses",
        description: "Create and approve operational expenses.",
      },
      {
        key: "prms.canManageSettings",
        label: "Manage PRMS settings",
        description: "Edit company identity, approval thresholds and category suggestions.",
      },
      {
        key: "prms.canViewAuditLog",
        label: "View audit log",
        description: "Read the PRMS audit trail.",
      },
      {
        key: "prms.canViewReports",
        label: "View reports",
        description: "View PRMS reports and analytics.",
      },
    ],
  },
];

export const ALL_PERMISSION_KEYS: string[] = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.key));

export function permissionLabel(key: string): string {
  for (const g of PERMISSION_GROUPS) {
    const found = g.permissions.find((p) => p.key === key);
    if (found) return found.label;
  }
  return key;
}
