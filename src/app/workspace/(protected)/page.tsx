import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  ShoppingCart,
  GraduationCap,
  MessagesSquare,
  LayoutGrid,
  ShieldCheck,
  LayoutDashboard,
  Clock,
  CalendarDays,
  Wallet,
  UserCheck,
  KeyRound,
  ArrowUpRight,
  Sparkles,
  Activity,
  Lock,
  ExternalLink,
  Zap,
} from "lucide-react";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { normalizeRoles } from "@/lib/hrms-roles";
import { normalizePmsRoles } from "@/lib/pms-roles";
import { normalizePrmsRoles } from "@/lib/prms-roles";
import { normalizeTmsRoles } from "@/lib/tms-roles";
import { normalizeChatRoles } from "@/lib/messenger-roles";
import { normalizeAdminRoles } from "@/lib/admin-roles";
import { normalizeFmsRoles } from "@/lib/fms-roles";
import { formatDateTime } from "@/lib/utils";
import GlassCard from "@/components/lms/GlassCard";
import { CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import ExecutiveSection from "@/components/admin/ExecutiveSection";
import HubModuleTile from "@/components/hub/HubModuleTile";
import { AnalyticsFilterBar } from "@/components/admin/AnalyticsFilterBar";

interface ModuleTile {
  key: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  visible: boolean;
  roleBadge: string;
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const words = local.replace(/[._-]+/g, " ").replace(/\d+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return email;
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default async function HubDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");

  await searchParams; // searchParams available for filter state

  const roles = user.roles;
  const hrmsRoles = normalizeRoles(roles);
  const pmsRoles = normalizePmsRoles(roles);
  const prmsRoles = normalizePrmsRoles(roles);
  const tmsRoles = normalizeTmsRoles(roles);
  const fmsRoles = normalizeFmsRoles(roles);
  const chatRoles = normalizeChatRoles(roles);
  const adminRoles = normalizeAdminRoles(roles);

  const tiles: ModuleTile[] = [
    {
      key: "hrms",
      label: "Human Resources (HRMS)",
      description: "Manage employee records, attendance, leaves, and payroll.",
      href: "/hrms",
      icon: <Users className="size-5" />,
      visible: hrmsRoles.length > 0,
      roleBadge: hrmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "pms",
      label: "Project Management (PMS)",
      description: "Track project deliverables, member tasks, and timesheets.",
      href: "/pms",
      icon: <FolderKanban className="size-5" />,
      visible: pmsRoles.length > 0,
      roleBadge: pmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "prms",
      label: "Procurement & Expenses (PRMS)",
      description: "Manage purchase requisitions, vendors, and expense claims.",
      href: "/prms",
      icon: <ShoppingCart className="size-5" />,
      visible: prmsRoles.length > 0,
      roleBadge: prmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "tms",
      label: "Training Management (TMS)",
      description: "Access training batches, student enrollments, and certifications.",
      href: "/tms",
      icon: <GraduationCap className="size-5" />,
      visible: tmsRoles.length > 0,
      roleBadge: tmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "fms",
      label: "Finance Management (FMS)",
      description: "Real-time ledger, financial transactions, and billing control.",
      href: "/fms",
      icon: <Wallet className="size-5" />,
      visible: fmsRoles.length > 0,
      roleBadge: fmsRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "messenger",
      label: "YashChat Messenger",
      description: "Team channels, direct messaging, file sharing, and video calls.",
      href: "/messenger",
      icon: <MessagesSquare className="size-5" />,
      visible: chatRoles.length > 0,
      roleBadge: chatRoles.join(", ").replace(/_/g, " "),
    },
    {
      key: "lms",
      label: "CRM & Leads (LMS)",
      description: "Lead management pipeline, client communications, and AI assistant.",
      href: "/lms",
      icon: <LayoutGrid className="size-5" />,
      visible: true,
      roleBadge: "All Staff",
    },
    {
      key: "admin",
      label: "Super Admin Command Center",
      description: "Company-wide executive KPIs, system configuration, and audit logs.",
      href: "/admin",
      icon: <ShieldCheck className="size-5" />,
      visible: adminRoles.length > 0,
      roleBadge: adminRoles.join(", ").replace(/_/g, " "),
    },
  ];

  const visibleTiles = tiles.filter((t) => t.visible);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = nameFromEmail(user.email);

  const quickActions = [
    {
      label: "My Profile & Attendance",
      description: "Clock in, view attendance history, and request leave.",
      href: "/hrms/me",
      icon: <UserCheck className="size-5 text-emerald-500" />,
      tag: "Self-Service",
      external: true,
    },
    {
      label: "Team Chat & Channels",
      description: "Connect with colleagues on YashChat Messenger.",
      href: "/messenger",
      icon: <MessagesSquare className="size-5 text-sky-500" />,
      tag: "Communication",
      external: true,
    },
    {
      label: "CRM Lead Pipeline",
      description: "View incoming leads or log new client inquiries.",
      href: "/lms",
      icon: <LayoutGrid className="size-5 text-purple-500" />,
      tag: "Leads",
      external: true,
    },
    {
      label: "Project Deliverables",
      description: "Check active tasks and submit project timesheets.",
      href: "/pms",
      icon: <FolderKanban className="size-5 text-amber-500" />,
      tag: "Projects",
      external: true,
    },
    {
      label: "Procurement & Expenses",
      description: "Submit expense reimbursements or purchase requisitions.",
      href: "/prms",
      icon: <ShoppingCart className="size-5 text-blue-500" />,
      tag: "Requisitions",
      external: true,
    },
    {
      label: "Security & Password",
      description: "Update account credentials and security settings.",
      href: "/workspace/change-password",
      icon: <KeyRound className="size-5 text-rose-500" />,
      tag: "Security",
      external: false,
    },
  ];

  return (
    <div className="relative space-y-6">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {greeting}, {displayName}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                <Sparkles className="size-3" />
                Staff Hub
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as <span className="font-semibold text-foreground">{user.email}</span>. Direct SSO access to all authorized panels.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/hrms/me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-[1.02]"
            >
              <UserCheck className="size-4" />
              My Attendance Portal
            </Link>
          </div>
        </div>

        {/* User Badges Strip */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-xs">
          <span className="text-muted-foreground font-medium">Assigned Roles:</span>
          {roles.map((r) => (
            <span
              key={r}
              className="rounded-full bg-background border border-border/60 px-2.5 py-0.5 font-medium text-foreground capitalize"
            >
              {r.replace(/_/g, " ")}
            </span>
          ))}
          {roles.length === 0 && <span className="text-muted-foreground italic">Standard Employee</span>}
        </div>
      </div>

      {/* Staff Filter Horizon */}
      <AnalyticsFilterBar title="Workspace Activity Horizon" />

      {/* Staff Overview KPIs */}
      <ExecutiveSection title="My Workspace Status">
        <KpiGrid>
          <KpiCard
            label="Authorized Panels"
            value={visibleTiles.length}
            suffix={`/${tiles.length}`}
            accent
            icon={<LayoutDashboard className="size-4" />}
          />
          <KpiCard label="Assigned System Roles" value={roles.length} icon={<ShieldCheck className="size-4" />} />
          <KpiCard
            label="Last Sign-in"
            value={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "First sign-in"}
            icon={<Clock className="size-4" />}
          />
          <KpiCard label="Member Since" value={formatDateTime(user.createdAt)} icon={<CalendarDays className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      {/* Operational SSO Panel Launcher */}
      <ExecutiveSection
        title="My Operational Panels"
        description="Single sign-on access to panels authorized for your account. Click to launch in a new tab."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTiles.map((tile, i) => (
            <div key={tile.key} className="relative group">
              <HubModuleTile
                href={tile.href}
                label={tile.label}
                description={tile.description}
                icon={tile.icon}
                index={i}
              />
              <div className="absolute top-3 right-3 pointer-events-none">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Activity className="size-2.5" />
                  Active Access
                </span>
              </div>
            </div>
          ))}
        </div>
      </ExecutiveSection>

      {/* Quick Staff Actions & Tool Shortcuts */}
      <ExecutiveSection
        title="Quick Shortcuts & Self-Service"
        description="Everyday staff tools and frequent workspace actions."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <GlassCard key={action.label}>
              <CardContent className="flex flex-col justify-between h-full pt-5 pb-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-background border border-border/50 shadow-sm">
                    {action.icon}
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {action.tag}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">{action.label}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
                </div>
                <div className="pt-2 border-t border-border/30">
                  <Link
                    href={action.href}
                    target={action.external ? "_blank" : undefined}
                    rel={action.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    Open Action <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>
              </CardContent>
            </GlassCard>
          ))}
        </div>
      </ExecutiveSection>

      {/* My Roles & Privileges Breakdown */}
      <ExecutiveSection
        title="My Privileges & Role Breakdown"
        description="Specific permissions granted to your employee account."
      >
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle>System Capabilities Summary</CardTitle>
            <CardDescription>Based on active account configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                { module: "HRMS", status: hrmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: hrmsRoles },
                { module: "PMS", status: pmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: pmsRoles },
                { module: "PRMS", status: prmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: prmsRoles },
                { module: "TMS", status: tmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: tmsRoles },
                { module: "FMS", status: fmsRoles.length > 0 ? "Authorized" : "Not Assigned", roles: fmsRoles },
                { module: "YashChat", status: chatRoles.length > 0 ? "Authorized" : "Not Assigned", roles: chatRoles },
                { module: "LMS", status: "Authorized (All Staff)", roles: ["Staff Viewer"] },
                { module: "Super Admin", status: adminRoles.length > 0 ? "Authorized" : "Not Assigned", roles: adminRoles },
              ].map((item) => (
                <div key={item.module} className="rounded-xl border border-border/50 bg-background/70 p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{item.module}</span>
                    <span
                      className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                        item.status.includes("Authorized")
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.status.includes("Authorized") ? "Active" : "Locked"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize truncate">
                    {item.roles.length > 0 ? item.roles.join(", ").replace(/_/g, " ") : "No roles assigned"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </ExecutiveSection>

      {/* Account Security & Session Governance */}
      <ExecutiveSection title="Account Security & Governance">
        <KpiGrid>
          <KpiCard label="Account Status" value="Active" tone="up" icon={<ShieldCheck className="size-4" />} />
          <KpiCard label="Authentication Method" value="Hub Password SSO" icon={<Lock className="size-4" />} />
          <KpiCard label="SSO Token Validity" value="Active Session" icon={<Zap className="size-4" />} />
          <KpiCard label="Security Center" value="Compliant" tone="up" icon={<UserCheck className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>
    </div>
  );
}
