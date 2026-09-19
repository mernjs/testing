import "server-only";
import { getDb } from "@/lib/mongodb";
import { getFmsDashboardStats } from "@/lib/fms/dashboard";
import { getHrmsDashboardStats } from "@/lib/hrms/dashboard";
import { getPmsDashboardStats } from "@/lib/pms/dashboard";
import { getPrmsDashboardStats } from "@/lib/prms/dashboard";
import { getTmsDashboardStats } from "@/lib/tms/dashboard";
import { getMessengerDashboardStats } from "@/lib/messenger/dashboard";
import { getDashboardStats as getCrmDashboardStats } from "@/lib/leads";
import { externalUsers } from "@/lib/portal-auth";
import { PORTAL_ROLES, type PortalRole } from "@/lib/portal-roles";
import { round2 } from "@/lib/fms/constants";
import { normalizeAdminRoles } from "@/lib/admin-roles";
import { type DashboardGranularity } from "@/lib/granularity";

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

async function safeCount(collection: string, match: Record<string, unknown> = {}): Promise<number> {
  try {
    const db = await getDb();
    return db.collection(collection).countDocuments({ deletedAt: null, ...match });
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FMS Analytics
// ─────────────────────────────────────────────────────────────────────────────

export interface PanelAnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  granularity?: "day" | "week" | "month" | "year";
  status?: string;
  category?: string;
  departmentId?: string;
  role?: string;
  source?: string;
  employmentType?: string;
  gender?: string;
  expenseType?: string;
  paymentStatus?: string;
  mode?: string;
  programId?: string;
  restrictToEmployeeId?: string;
}

export type FmsAnalytics = Awaited<ReturnType<typeof getFmsAnalytics>>;

export async function getFmsAnalytics(filters?: PanelAnalyticsFilters) {
  const stats = await getFmsDashboardStats({
    granularity: (filters?.granularity as DashboardGranularity) ?? "month",
    dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
    dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
  });
  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  if (stats.overdueInvoices > 0) alerts.push({ type: "danger", message: `${stats.overdueInvoices} overdue invoice(s) need immediate attention` });
  if (stats.pendingApprovals > 0) alerts.push({ type: "warning", message: `${stats.pendingApprovals} transaction(s) pending approval` });
  if (stats.hasUnratedForeignCurrency) alerts.push({ type: "warning", message: "Some transactions use currencies without configured exchange rates" });

  return {
    kpis: {
      totalRevenue: stats.totalRevenue,
      totalExpenses: stats.totalExpenses,
      netProfit: stats.netProfit,
      profitMargin: stats.totalRevenue > 0 ? round2((stats.netProfit / stats.totalRevenue) * 100) : 0,
      totalCash: stats.totalCash,
      totalBankBalance: stats.totalBankBalance,
      accountsReceivable: stats.accountsReceivable,
      accountsPayable: stats.accountsPayable,
      outstandingInvoices: stats.outstandingInvoices,
      overdueInvoices: stats.overdueInvoices,
      pendingApprovals: stats.pendingApprovals,
      currentMonthRevenue: stats.currentMonthRevenue,
      currentMonthExpenses: stats.currentMonthExpenses,
      currentMonthProfit: stats.currentMonthProfit,
      payrollPayable: stats.payrollPayable,
      taxPayable: stats.taxPayable,
      trainingRevenue: stats.trainingRevenue,
      subscriptionCommitment: stats.subscriptionCommitment,
    },
    charts: {
      revenueVsExpenses: stats.revenueVsExpenses,
      monthlyProfitLoss: stats.monthlyProfitLoss,
      revenueBySource: stats.revenueBySource,
      expensesByCategory: stats.expensesByCategory,
      receivablesAging: stats.receivablesAging,
      payablesAging: stats.payablesAging,
      projectProfitability: stats.projectProfitability,
    },
    panelSummary: stats.panelSummary,
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HRMS Analytics
// ─────────────────────────────────────────────────────────────────────────────

export type HrmsAnalytics = Awaited<ReturnType<typeof getHrmsAnalytics>>;

export async function getHrmsAnalytics(filters?: PanelAnalyticsFilters) {
  const stats = await getHrmsDashboardStats({
    granularity: (filters?.granularity as DashboardGranularity) ?? "month",
    dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
    dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
    departmentId: filters?.departmentId,
    employmentType: filters?.employmentType,
    status: filters?.status,
    gender: filters?.gender,
  });
  const attritionRate =
    stats.totalEmployees > 0
      ? round2((stats.attritionTimeSeries.reduce((s, p) => s + p.count, 0) / stats.totalEmployees) * 100)
      : 0;

  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  if (attritionRate > 10) alerts.push({ type: "danger", message: `High attrition rate: ${attritionRate}%` });
  if (stats.newJoinees === 0) alerts.push({ type: "warning", message: "No new joiners in the selected period" });

  return {
    kpis: {
      totalEmployees: stats.totalEmployees,
      activeEmployees: stats.activeEmployees,
      newJoinees: stats.newJoinees,
      newJoineesGrowth: stats.newJoineesGrowth,
      departments: stats.departments,
      attritionRate,
    },
    charts: {
      headcountTimeSeries: stats.headcountTimeSeries,
      hiringTimeSeries: stats.hiringTimeSeries,
      attritionTimeSeries: stats.attritionTimeSeries,
      statusDistribution: stats.statusDistribution.map((s) => ({ label: s.label, value: s.count })),
      departmentDistribution: stats.departmentDistribution,
      genderDistribution: stats.genderDistribution.map((g) => ({ label: g.label, value: g.count })),
      employmentTypeDistribution: stats.employmentTypeDistribution,
    },
    recentJoinees: stats.recentJoinees,
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LMS (CRM / Lead Management) Analytics
// ─────────────────────────────────────────────────────────────────────────────

export type LmsAnalytics = Awaited<ReturnType<typeof getLmsAnalytics>>;

export async function getLmsAnalytics(filters?: PanelAnalyticsFilters) {
  const stats = await getCrmDashboardStats({
    granularity: (filters?.granularity as DashboardGranularity) ?? "month",
    dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
    dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
    category: filters?.category as any,
    status: filters?.status as any,
    source: filters?.source as any,
  });
  const conversionRate =
    stats.totalOverall > 0 ? round2(((stats.byStatus.completed ?? 0) / stats.totalOverall) * 100) : 0;

  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  if (stats.staleCount > 0) alerts.push({ type: "warning", message: `${stats.staleCount} stale lead(s) not followed up in 7+ days` });

  const sourcePieData = Object.entries(stats.bySource).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);

  return {
    kpis: {
      totalLeads: stats.totalOverall,
      newLeads: stats.byStatus.new ?? 0,
      inProgress: stats.byStatus.in_progress ?? 0,
      completed: stats.byStatus.completed ?? 0,
      rejected: stats.byStatus.rejected ?? 0,
      conversionRate,
      staleCount: stats.staleCount,
      previousPeriodTotal: stats.previousPeriodTotal,
      growthPercent: stats.growthPercent,
    },
    charts: {
      timeSeries: stats.timeSeries,
      bySource: sourcePieData,
      topCategories: stats.topCategories,
      funnel: stats.funnel,
      byWeekday: stats.byWeekday,
    },
    recentLeads: stats.recent.slice(0, 8).map((l) => ({
      id: String(l._id),
      name: l.name,
      category: l.category,
      status: l.status ?? "new",
      source: l.source ?? "—",
      createdAt: new Date(l.createdAt).toISOString(),
    })),
    staleLeads: stats.staleLeads.slice(0, 5).map((l) => ({
      id: String(l._id),
      name: l.name,
      category: l.category,
      status: l.status ?? "new",
      createdAt: new Date(l.createdAt).toISOString(),
    })),
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Messenger Analytics
// ─────────────────────────────────────────────────────────────────────────────

export type MessengerAnalytics = Awaited<ReturnType<typeof getMessengerAnalytics>>;

export async function getMessengerAnalytics(filters?: PanelAnalyticsFilters) {
  const now = new Date();
  const from = filters?.dateFrom ? new Date(filters.dateFrom) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const to = filters?.dateTo ? new Date(filters.dateTo) : now;
  const stats = await getMessengerDashboardStats({ from, to, viewerId: "command-center" });

  const engagementRate =
    stats.kpis.activeUsers > 0
      ? round2((stats.kpis.onlineMembers / stats.kpis.activeUsers) * 100)
      : 0;

  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  if (stats.kpis.messagesSentToday === 0) alerts.push({ type: "warning", message: "No messages sent today — team may be offline" });

  return {
    kpis: {
      activeUsers: stats.kpis.activeUsers,
      onlineMembers: stats.kpis.onlineMembers,
      totalChannels: stats.kpis.totalChannels,
      activeProjectChannels: stats.kpis.activeProjectChannels,
      messagesSentToday: stats.kpis.messagesSentToday,
      directMessagesToday: stats.kpis.directMessagesToday,
      sharedFiles: stats.kpis.sharedFiles,
      engagementRate,
    },
    charts: {
      dailyMessagingTrend: stats.dailyMessagingTrend,
      channelActivity: stats.channelActivity,
      mostActiveMembers: stats.mostActiveMembers,
      onlineVsOffline: stats.onlineVsOffline,
      fileSharing: stats.fileSharing,
      peakHours: stats.peakHours,
    },
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PMS Analytics
// ─────────────────────────────────────────────────────────────────────────────

export type PmsAnalytics = Awaited<ReturnType<typeof getPmsAnalytics>>;

export async function getPmsAnalytics(filters?: PanelAnalyticsFilters) {
  const stats = await getPmsDashboardStats({
    granularity: (filters?.granularity as DashboardGranularity) ?? "month",
    dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
    dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
    restrictToEmployeeId: filters?.restrictToEmployeeId,
  });

  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  if (stats.overdueProjects > 0) alerts.push({ type: "danger", message: `${stats.overdueProjects} overdue project(s) need attention` });
  if (stats.teamUtilization > 90) alerts.push({ type: "warning", message: `Team utilization at ${stats.teamUtilization}% — risk of burnout` });
  if (stats.onHoldProjects > 0) alerts.push({ type: "warning", message: `${stats.onHoldProjects} project(s) currently on hold` });

  return {
    kpis: {
      totalProjects: stats.totalProjects,
      activeProjects: stats.activeProjects,
      completedProjects: stats.completedProjects,
      onHoldProjects: stats.onHoldProjects,
      overdueProjects: stats.overdueProjects,
      totalClients: stats.totalClients,
      teamUtilization: stats.teamUtilization,
      overallCompletion: stats.overallCompletion,
      newProjects: stats.newProjects,
      newProjectsGrowth: stats.newProjectsGrowth,
    },
    charts: {
      statusDistribution: stats.statusDistribution.map((s) => ({ label: s.label, value: s.count })),
      priorityDistribution: stats.priorityDistribution,
      monthlyGrowth: stats.monthlyGrowth,
      progressTrend: stats.progressTrend,
      teamWorkload: stats.teamWorkload,
      deadlineBuckets: stats.deadlineBuckets,
      clientDistribution: stats.clientDistribution,
    },
    recentProjects: stats.recentProjects,
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Portal Analytics
// ─────────────────────────────────────────────────────────────────────────────

export type PortalAnalytics = Awaited<ReturnType<typeof getPortalAnalytics>>;

export async function getPortalAnalytics(filters?: PanelAnalyticsFilters) {
  const empty = Object.fromEntries(PORTAL_ROLES.map((r) => [r, 0])) as Record<PortalRole, number>;

  let total = 0;
  let byRole: Record<PortalRole, number> = { ...empty };
  let recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[] = [];

  const matchFilter: Record<string, unknown> = {
    ...(filters?.status && filters.status !== "all" ? { status: filters.status } : { status: "active" }),
    ...(filters?.role && filters.role !== "all" ? { role: filters.role } : {}),
  };

  try {
    const collection = await externalUsers();
    const [rows, recent] = await Promise.all([
      collection
        .aggregate<{ _id: PortalRole; count: number }>([
          { $match: matchFilter },
          { $group: { _id: "$role", count: { $sum: 1 } } },
        ])
        .toArray(),
      collection.find(matchFilter).sort({ createdAt: -1 }).limit(10).toArray(),
    ]);
    byRole = { ...empty };
    for (const r of rows) byRole[r._id] = r.count;
    total = Object.values(byRole).reduce((a, b) => a + b, 0);
    recentUsers = recent.map((u) => ({
      id: String(u._id),
      name: u.displayName ?? "—",
      email: (u.email as string) ?? "—",
      role: (u.role as string) ?? "—",
      createdAt: new Date(u.createdAt as Date).toISOString(),
    }));
  } catch {
    // Collections not yet seeded — safe fallback.
  }

  const rolePieData = PORTAL_ROLES.map((r) => ({ label: r.replace("_", " "), value: byRole[r] }));

  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  if (total === 0) alerts.push({ type: "warning", message: "No active external portal users yet" });

  return {
    kpis: {
      total,
      clients: byRole.client,
      jobApplicants: byRole.job_applicant,
      interns: byRole.intern,
      trainees: byRole.trainee,
    },
    charts: {
      byRole: rolePieData,
    },
    recentUsers,
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PRMS Analytics
// ─────────────────────────────────────────────────────────────────────────────

export type PrmsAnalytics = Awaited<ReturnType<typeof getPrmsAnalytics>>;

export async function getPrmsAnalytics(filters?: PanelAnalyticsFilters) {
  const stats = await getPrmsDashboardStats({
    granularity: (filters?.granularity as DashboardGranularity) ?? "month",
    dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
    dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
    departmentId: filters?.departmentId,
    category: filters?.category,
    expenseType: filters?.expenseType,
    paymentStatus: filters?.paymentStatus,
  });

  const budgetUtilization =
    stats.approvedBudget > 0
      ? round2(((stats.approvedBudget - stats.remainingBudget) / stats.approvedBudget) * 100)
      : 0;

  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  if (stats.pendingPurchaseRequests > 0) alerts.push({ type: "warning", message: `${stats.pendingPurchaseRequests} purchase request(s) awaiting approval` });
  if (stats.pendingInvoicePayments > 0) alerts.push({ type: "warning", message: `${stats.pendingInvoicePayments} vendor invoice(s) pending payment` });
  if (budgetUtilization > 90) alerts.push({ type: "danger", message: `Budget utilization at ${budgetUtilization}% — nearing limit` });

  return {
    kpis: {
      totalProcurementSpend: stats.totalProcurementSpend,
      monthlyExpenses: stats.monthlyExpenses,
      approvedBudget: stats.approvedBudget,
      remainingBudget: stats.remainingBudget,
      budgetUtilization,
      totalAssetsValue: stats.totalAssetsValue,
      totalOfficeAssets: stats.totalOfficeAssets,
      activeVendors: stats.activeVendors,
      activeSubscriptions: stats.activeSubscriptions,
      infrastructureCost: stats.infrastructureCost,
      pendingPurchaseRequests: stats.pendingPurchaseRequests,
      pendingInvoicePayments: stats.pendingInvoicePayments,
      annualOperationalCost: stats.annualOperationalCost,
    },
    charts: {
      monthlyExpenseTrend: stats.monthlyExpenseTrend,
      categoryExpenses: stats.categoryExpenses,
      vendorSpend: stats.vendorSpend,
      saasSubscriptionCost: stats.saasSubscriptionCost,
      infrastructureCostTrend: stats.infrastructureCostTrend,
      assetAcquisitionTrend: stats.assetAcquisitionTrend,
      departmentExpenses: stats.departmentExpenses,
      cashOutflowTimeline: stats.cashOutflowTimeline,
      topExpenseCategories: stats.topExpenseCategories,
      budgetVsActual: stats.budgetVsActual,
    },
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TMS Analytics
// ─────────────────────────────────────────────────────────────────────────────

export type TmsAnalytics = Awaited<ReturnType<typeof getTmsAnalytics>>;

export async function getTmsAnalytics(filters?: PanelAnalyticsFilters) {
  const stats = await getTmsDashboardStats({
    granularity: (filters?.granularity as DashboardGranularity) ?? "month",
    dateFrom: filters?.dateFrom ? new Date(filters.dateFrom) : undefined,
    dateTo: filters?.dateTo ? new Date(filters.dateTo) : undefined,
    mode: filters?.mode as any,
    programId: filters?.programId,
  });

  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  if (stats.pendingApplications > 0) alerts.push({ type: "warning", message: `${stats.pendingApplications} student application(s) awaiting review` });
  if (stats.placementSuccessRate < 50 && stats.totalStudents > 0)
    alerts.push({ type: "warning", message: `Placement rate at ${stats.placementSuccessRate}% — below 50% target` });

  return {
    kpis: {
      totalStudents: stats.totalStudents,
      industrialStudents: stats.industrialStudents,
      internshipStudents: stats.internshipStudents,
      activeBatches: stats.activeBatches,
      runningPrograms: stats.runningPrograms,
      completedPrograms: stats.completedPrograms,
      pendingApplications: stats.pendingApplications,
      placementSuccessRate: stats.placementSuccessRate,
      totalRevenue: stats.totalRevenue,
      certificatesIssued: stats.certificatesIssued,
      newStudents: stats.newStudents,
      newStudentsGrowth: stats.newStudentsGrowth,
    },
    charts: {
      enrollmentTrend: stats.enrollmentTrend,
      monthlyAdmissions: stats.monthlyAdmissions,
      programEnrollment: stats.programEnrollment,
      categorySplit: stats.categorySplit.map((c) => ({ label: c.label, value: c.count })),
      revenueTrend: stats.revenueTrend,
      batchOccupancy: stats.batchOccupancy,
      completionRate: stats.completionRate,
      placementTrend: stats.placementTrend,
    },
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Workspace Analytics
// ─────────────────────────────────────────────────────────────────────────────

export type WorkspaceAnalytics = Awaited<ReturnType<typeof getWorkspaceAnalytics>>;

export async function getWorkspaceAnalytics(filters?: PanelAnalyticsFilters) {
  const ADMIN_USERS_COLLECTION = "admin_users";
  const matchFilter: Record<string, unknown> = { deletedAt: null };
  if (filters?.status && filters.status !== "all") matchFilter.status = filters.status;
  if (filters?.role && filters.role !== "all") matchFilter.roles = filters.role;

  const [totalUsers, activeUsers, roleDist] = await Promise.all([
    safeCount(ADMIN_USERS_COLLECTION, matchFilter),
    safeCount(ADMIN_USERS_COLLECTION, { status: "active", ...matchFilter }),
    (async () => {
      try {
        const db = await getDb();
        return db
          .collection<{ roles: string[] }>(ADMIN_USERS_COLLECTION)
          .aggregate<{ _id: string; count: number }>([
            { $match: matchFilter },
            { $unwind: "$roles" },
            { $group: { _id: "$roles", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 },
          ])
          .toArray();
      } catch {
        return [];
      }
    })(),
  ]);

  const inactiveUsers = totalUsers - activeUsers;
  const superAdminCount = roleDist.find((r) => r._id === "super_admin")?.count ?? 0;

  const alerts: { type: "warning" | "danger"; message: string }[] = [];
  if (inactiveUsers > 0) alerts.push({ type: "warning", message: `${inactiveUsers} user account(s) are inactive` });

  return {
    kpis: {
      totalUsers,
      activeUsers,
      inactiveUsers,
      superAdminCount,
      totalRoles: roleDist.length,
    },
    charts: {
      roleDistribution: roleDist.map((r) => ({ label: r._id, value: r.count })),
      activeVsInactive: [
        { label: "Active", value: activeUsers },
        { label: "Inactive", value: inactiveUsers },
      ],
    },
    alerts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel-key → aggregator mapping
// ─────────────────────────────────────────────────────────────────────────────

export const PANEL_CONFIGS = {
  fms: {
    label: "FMS – Finance Analytics",
    description: "Ledger-backed revenue, expenses, profit, cash position, and receivables/payables across the Finance Management System.",
    href: "/fms",
    ctaLabel: "Open Finance Panel",
  },
  hrms: {
    label: "HRMS – HR Analytics",
    description: "Headcount, hiring velocity, attrition, gender & department distribution across the Human Resource Management System.",
    href: "/hrms",
    ctaLabel: "Open HR Panel",
  },
  lms: {
    label: "LMS – Lead Analytics",
    description: "Lead pipeline, conversion funnel, source breakdown, stale leads, and campaign performance from the Lead Management System.",
    href: "/lms",
    ctaLabel: "Open LMS Panel",
  },
  messenger: {
    label: "Messenger – Messenger Analytics",
    description: "Team communication volume, active channels, peak hours, file sharing, and member engagement.",
    href: "/messenger",
    ctaLabel: "Open Messenger",
  },
  pms: {
    label: "PMS – Project Analytics",
    description: "Project health, delivery status, team utilization, client portfolio, and deadline risk.",
    href: "/pms",
    ctaLabel: "Open Projects Panel",
  },
  portal: {
    label: "Portal – Portal Analytics",
    description: "External user distribution across clients, applicants, interns, and trainees in the External Portal.",
    href: "/portal",
    ctaLabel: "Open External Portal",
  },
  prms: {
    label: "PRMS – Procurement Analytics",
    description: "Procurement spend, vendor management, asset valuation, budget utilization, and operational costs.",
    href: "/prms",
    ctaLabel: "Open Procurement Panel",
  },
  tms: {
    label: "TMS – Training Analytics",
    description: "Student enrollment, batch occupancy, placement rate, revenue, and certificate issuance.",
    href: "/tms",
    ctaLabel: "Open Training Panel",
  },
  workspace: {
    label: "Workspace – Workspace Analytics",
    description: "Internal user accounts, role distribution, active vs inactive staff across the Staff Hub.",
    href: "/workspace",
    ctaLabel: "Open Staff Hub",
  },
} as const;

export type PanelKey = keyof typeof PANEL_CONFIGS;

export function isPanelKey(val: unknown): val is PanelKey {
  return typeof val === "string" && val in PANEL_CONFIGS;
}
