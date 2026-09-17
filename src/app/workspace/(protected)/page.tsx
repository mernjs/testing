import { redirect } from "next/navigation";
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
} from "lucide-react";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { normalizeRoles } from "@/lib/hrms-roles";
import { normalizePmsRoles } from "@/lib/pms-roles";
import { normalizePrmsRoles } from "@/lib/prms-roles";
import { normalizeTmsRoles } from "@/lib/tms-roles";
import { normalizeChatRoles } from "@/lib/messenger-roles";
import { normalizeAdminRoles } from "@/lib/admin-roles";
import { normalizeFmsRoles } from "@/lib/fms-roles";
import { fmsWorkspaceSummary } from "@/lib/fms/dashboard";
import { formatMoney } from "@/lib/fms/constants";
import GlassCard from "@/components/lms/GlassCard";
import { CardContent } from "@/components/ui/card";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import ExecutiveSection from "@/components/admin/ExecutiveSection";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import HubModuleTile from "@/components/hub/HubModuleTile";
import { formatDateTime } from "@/lib/utils";

interface ModuleTile {
  key: string;
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  kpi?: { label: string; value: string }[];
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  const words = local.replace(/[._-]+/g, " ").replace(/\d+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return email;
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default async function HubDashboardPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");

  const roles = user.roles;
  const hasFmsAccess = normalizeFmsRoles(roles).length > 0;
  const fmsSummary = hasFmsAccess ? await fmsWorkspaceSummary().catch(() => null) : null;

  const tiles: ModuleTile[] = [
    {
      key: "hrms",
      label: "Human Resources",
      description: "Employees, attendance, leave, payroll.",
      href: "/hrms",
      icon: Users,
      visible: normalizeRoles(roles).length > 0,
    },
    {
      key: "pms",
      label: "Project Management",
      description: "Clients, projects, tasks, timesheets.",
      href: "/pms",
      icon: FolderKanban,
      visible: normalizePmsRoles(roles).length > 0,
    },
    {
      key: "prms",
      label: "Procurement & Expense",
      description: "Vendors, purchase orders, assets, expenses.",
      href: "/prms",
      icon: ShoppingCart,
      visible: normalizePrmsRoles(roles).length > 0,
    },
    {
      key: "tms",
      label: "Training Management",
      description: "Programs, batches, students, certificates.",
      href: "/tms",
      icon: GraduationCap,
      visible: normalizeTmsRoles(roles).length > 0,
    },
    {
      key: "fms",
      label: "Finance Management",
      description: "Transactions, customers, vendors, accounts.",
      href: "/fms",
      icon: Wallet,
      visible: hasFmsAccess,
      kpi: fmsSummary
        ? [
            { label: "Cash", value: formatMoney(fmsSummary.cash) },
            { label: "Pending Approvals", value: String(fmsSummary.pendingApprovals) },
          ]
        : undefined,
    },
    {
      key: "messenger",
      label: "YashChat",
      description: "Team messaging, channels, meetings.",
      href: "/messenger",
      icon: MessagesSquare,
      visible: normalizeChatRoles(roles).length > 0,
    },
    {
      key: "lms",
      label: "CRM & Leads",
      description: "Leads, clients, careers, the AI chatbot.",
      href: "/lms",
      icon: LayoutGrid,
      visible: true, // no role gate — always available
    },
    {
      key: "admin",
      label: "Super Admin Command Center",
      description: "Executive KPIs, every panel, user & role management.",
      href: "/admin",
      icon: ShieldCheck,
      visible: normalizeAdminRoles(roles).length > 0,
    },
  ];

  const visibleTiles = tiles.filter((t) => t.visible);
  const lockedCount = tiles.length - visibleTiles.length;
  const onlyLms = visibleTiles.length === 1 && visibleTiles[0].key === "lms";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = nameFromEmail(user.email);

  return (
    <div className="relative space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          {greeting}, {displayName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Signed in as {user.email}. Every panel below opens with no additional login.
        </p>
      </div>

      <ExecutiveSection title="Your Access">
        <KpiGrid>
          <KpiCard
            label="Accessible Panels"
            value={visibleTiles.length}
            suffix={`/${tiles.length}`}
            accent
            icon={<LayoutDashboard className="size-4" />}
          />
          <KpiCard label="Roles Assigned" value={roles.length} icon={<ShieldCheck className="size-4" />} />
          <KpiCard
            label="Last Sign-in"
            value={user.lastLoginAt ? formatDateTime(user.lastLoginAt) : "First sign-in"}
            icon={<Clock className="size-4" />}
          />
          <KpiCard label="Member Since" value={formatDateTime(user.createdAt)} icon={<CalendarDays className="size-4" />} />
        </KpiGrid>
      </ExecutiveSection>

      <ExecutiveSection title="Panel Access Overview" description="How much of the platform your account can currently reach.">
        <GlassCard interactive={false}>
          <CardContent className="pt-6">
            <CategoryBarChart
              data={[
                { label: "Accessible", value: visibleTiles.length },
                { label: "Locked", value: lockedCount },
              ]}
            />
          </CardContent>
        </GlassCard>
      </ExecutiveSection>

      <ExecutiveSection title="Your Panels" description="Every panel below opens with no additional login.">
        <div className="space-y-4">
          {onlyLms && (
            <GlassCard interactive={false}>
              <CardContent className="text-sm text-muted-foreground">
                You currently have access to CRM &amp; Leads only. Contact your Super Admin if you need access to
                other panels.
              </CardContent>
            </GlassCard>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleTiles.map((tile, i) => (
              <HubModuleTile
                key={tile.key}
                href={tile.href}
                label={tile.label}
                description={tile.description}
                icon={<tile.icon className="size-5" />}
                index={i}
                kpi={tile.kpi}
              />
            ))}
          </div>
        </div>
      </ExecutiveSection>
    </div>
  );
}
