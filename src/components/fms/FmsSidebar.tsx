"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Building2,
  Users,
  Receipt,
  Wallet,
  Landmark,
  Coins,
  PiggyBank,
  Percent,
  CheckSquare,
  BarChart3,
  Settings,
  ScrollText,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { FmsRole } from "@/lib/fms-roles";
import { canManageAccounts, canViewAuditLog } from "@/lib/fms-roles";

interface NavItemDef {
  label: string;
  href: string;
  exact?: boolean;
  /** Not built yet in this phase — still shown (per §3's full nav) but routes to a placeholder. */
  soon?: boolean;
}
interface NavSectionDef {
  label: string;
  icon: LucideIcon;
  items: NavItemDef[];
}

function comingSoonHref(section: string, label: string): string {
  return `/fms/coming-soon?section=${encodeURIComponent(section)}&item=${encodeURIComponent(label)}`;
}

function NavLink({
  href,
  label,
  icon: Icon,
  exact = false,
  soon = false,
  collapsed = false,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  soon?: boolean;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = !soon && (exact ? pathname === href : pathname?.startsWith(href));

  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="fms-nav-active"
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/15 to-secondary/10"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon className="relative size-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
      {!collapsed && <span className="relative truncate">{label}</span>}
      {!collapsed && soon && <Lock className="relative ml-auto size-3 text-muted-foreground/60" aria-label="Coming soon" />}
    </>
  );

  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        collapsed && "justify-center px-0",
        soon
          ? "text-muted-foreground/70 hover:bg-muted/60"
          : active
            ? "text-primary"
            : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
      )}
    >
      {inner}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return <div className="mt-4 mb-1 border-t border-border/50" />;
  return (
    <div className="mt-4 mb-1 px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{children}</div>
  );
}

export default function FmsSidebar({
  roles,
  permissionOverrides,
  onNavigate,
  collapsed = false,
}: {
  roles: FmsRole[];
  permissionOverrides?: Record<string, boolean>;
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const roleCtx = { roles, permissionOverrides };

  // Full §3 nav tree. `soon: true` marks sections not yet built (later
  // phases) — they still appear so the panel's eventual shape is visible,
  // matching the same convention PRMS's sidebar documents for itself.
  const sections: NavSectionDef[] = [
    {
      label: "Transactions",
      icon: ArrowLeftRight,
      items: [
        { label: "All Transactions", href: "/fms/transactions" },
        { label: "Income", href: "/fms/transactions?type=income" },
        { label: "Expenses", href: "/fms/transactions?type=expense" },
        { label: "Transfers", href: "/fms/transactions?type=transfer" },
        { label: "Adjustments", href: "/fms/transactions?type=adjustment" },
      ],
    },
    {
      label: "Sales & Receivables",
      icon: Users,
      items: [
        { label: "Customers", href: "/fms/customers" },
        { label: "Invoices", href: comingSoonHref("Sales & Receivables", "Invoices"), soon: true },
        { label: "Payment Receipts", href: comingSoonHref("Sales & Receivables", "Payment Receipts"), soon: true },
        { label: "Credit Notes", href: comingSoonHref("Sales & Receivables", "Credit Notes"), soon: true },
        { label: "Refunds", href: comingSoonHref("Sales & Receivables", "Refunds"), soon: true },
        { label: "Receivables", href: comingSoonHref("Sales & Receivables", "Receivables"), soon: true },
      ],
    },
    {
      label: "Purchases & Payables",
      icon: Building2,
      items: [
        { label: "Vendors", href: "/fms/vendors" },
        { label: "Bills", href: comingSoonHref("Purchases & Payables", "Bills"), soon: true },
        { label: "Payment Requests", href: comingSoonHref("Purchases & Payables", "Payment Requests"), soon: true },
        { label: "Vendor Payments", href: comingSoonHref("Purchases & Payables", "Vendor Payments"), soon: true },
        { label: "Debit Notes", href: comingSoonHref("Purchases & Payables", "Debit Notes"), soon: true },
        { label: "Payables", href: comingSoonHref("Purchases & Payables", "Payables"), soon: true },
      ],
    },
    {
      label: "Expenses",
      icon: Receipt,
      items: [
        { label: "All Expenses", href: "/fms/transactions?type=expense" },
        { label: "Employee Expenses", href: comingSoonHref("Expenses", "Employee Expenses"), soon: true },
        { label: "Reimbursements", href: comingSoonHref("Expenses", "Reimbursements"), soon: true },
        { label: "Travel", href: comingSoonHref("Expenses", "Travel"), soon: true },
        { label: "Office", href: comingSoonHref("Expenses", "Office"), soon: true },
        { label: "Marketing", href: comingSoonHref("Expenses", "Marketing"), soon: true },
        { label: "Miscellaneous", href: comingSoonHref("Expenses", "Miscellaneous"), soon: true },
      ],
    },
    {
      label: "Payroll",
      icon: Wallet,
      items: [
        { label: "Salary Payables", href: comingSoonHref("Payroll", "Salary Payables"), soon: true },
        { label: "Payroll Runs", href: comingSoonHref("Payroll", "Payroll Runs"), soon: true },
        { label: "Salary Payments", href: comingSoonHref("Payroll", "Salary Payments"), soon: true },
        { label: "Advances", href: comingSoonHref("Payroll", "Advances"), soon: true },
        { label: "Deductions", href: comingSoonHref("Payroll", "Deductions"), soon: true },
        { label: "Payslips", href: comingSoonHref("Payroll", "Payslips"), soon: true },
      ],
    },
    {
      label: "Assets",
      icon: Landmark,
      items: [
        { label: "Asset Register", href: comingSoonHref("Assets", "Asset Register"), soon: true },
        { label: "Asset Purchases", href: comingSoonHref("Assets", "Asset Purchases"), soon: true },
        { label: "Asset Expenses", href: comingSoonHref("Assets", "Asset Expenses"), soon: true },
        { label: "Depreciation", href: comingSoonHref("Assets", "Depreciation"), soon: true },
        { label: "Transfers", href: comingSoonHref("Assets", "Transfers"), soon: true },
        { label: "Disposal", href: comingSoonHref("Assets", "Disposal"), soon: true },
      ],
    },
    {
      label: "Banking",
      icon: Landmark,
      items: [
        { label: "Bank Accounts", href: comingSoonHref("Banking", "Bank Accounts"), soon: true },
        { label: "Bank Transactions", href: comingSoonHref("Banking", "Bank Transactions"), soon: true },
        { label: "Transfers", href: comingSoonHref("Banking", "Transfers"), soon: true },
        { label: "Reconciliation", href: comingSoonHref("Banking", "Reconciliation"), soon: true },
      ],
    },
    {
      label: "Cash",
      icon: Coins,
      items: [
        { label: "Cash Accounts", href: comingSoonHref("Cash", "Cash Accounts"), soon: true },
        { label: "Cash Transactions", href: comingSoonHref("Cash", "Cash Transactions"), soon: true },
        { label: "Cash Reconciliation", href: comingSoonHref("Cash", "Cash Reconciliation"), soon: true },
      ],
    },
    {
      label: "Budgets",
      icon: PiggyBank,
      items: [
        { label: "Budgets", href: comingSoonHref("Budgets", "Budgets"), soon: true },
        { label: "Budget Allocation", href: comingSoonHref("Budgets", "Budget Allocation"), soon: true },
        { label: "Budget Utilization", href: comingSoonHref("Budgets", "Budget Utilization"), soon: true },
        { label: "Variance", href: comingSoonHref("Budgets", "Variance"), soon: true },
      ],
    },
    {
      label: "Taxes",
      icon: Percent,
      items: [
        { label: "Tax Configuration", href: comingSoonHref("Taxes", "Tax Configuration"), soon: true },
        { label: "Tax Payable", href: comingSoonHref("Taxes", "Tax Payable"), soon: true },
        { label: "Tax Collected", href: comingSoonHref("Taxes", "Tax Collected"), soon: true },
        { label: "Tax Reports", href: comingSoonHref("Taxes", "Tax Reports"), soon: true },
      ],
    },
    {
      label: "Approvals",
      icon: CheckSquare,
      items: [
        { label: "Pending Approvals", href: "/fms/transactions?status=pending_approval" },
        { label: "Approved", href: "/fms/transactions?status=approved" },
        { label: "Rejected", href: "/fms/transactions?status=rejected" },
        { label: "Approval Rules", href: comingSoonHref("Approvals", "Approval Rules"), soon: true },
      ],
    },
    {
      label: "Reports",
      icon: BarChart3,
      items: [
        { label: "Profit & Loss", href: comingSoonHref("Reports", "Profit & Loss"), soon: true },
        { label: "Balance Sheet", href: comingSoonHref("Reports", "Balance Sheet"), soon: true },
        { label: "Cash Flow", href: comingSoonHref("Reports", "Cash Flow"), soon: true },
        { label: "Trial Balance", href: comingSoonHref("Reports", "Trial Balance"), soon: true },
        { label: "General Ledger", href: comingSoonHref("Reports", "General Ledger"), soon: true },
        { label: "Accounts Receivable", href: comingSoonHref("Reports", "Accounts Receivable"), soon: true },
        { label: "Accounts Payable", href: comingSoonHref("Reports", "Accounts Payable"), soon: true },
        { label: "Expense Report", href: comingSoonHref("Reports", "Expense Report"), soon: true },
        { label: "Revenue Report", href: comingSoonHref("Reports", "Revenue Report"), soon: true },
        { label: "Tax Report", href: comingSoonHref("Reports", "Tax Report"), soon: true },
        { label: "Payroll Report", href: comingSoonHref("Reports", "Payroll Report"), soon: true },
        { label: "Project Profitability", href: comingSoonHref("Reports", "Project Profitability"), soon: true },
        { label: "Financial Summary", href: comingSoonHref("Reports", "Financial Summary"), soon: true },
      ],
    },
  ];

  const settingsItems: NavItemDef[] = [
    { label: "Chart of Accounts", href: "/fms/settings/accounts" },
    { label: "Financial Categories", href: comingSoonHref("Settings", "Financial Categories"), soon: true },
    { label: "Payment Methods", href: comingSoonHref("Settings", "Payment Methods"), soon: true },
    { label: "Currencies", href: comingSoonHref("Settings", "Currencies"), soon: true },
    { label: "Tax Rules", href: comingSoonHref("Settings", "Tax Rules"), soon: true },
    { label: "Fiscal Year", href: comingSoonHref("Settings", "Fiscal Year"), soon: true },
    { label: "Numbering", href: comingSoonHref("Settings", "Numbering"), soon: true },
    { label: "Approval Configuration", href: comingSoonHref("Settings", "Approval Configuration"), soon: true },
  ];

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <NavLink href="/fms" label="Dashboard" icon={LayoutDashboard} exact collapsed={collapsed} onNavigate={onNavigate} />

      {sections.map((section) => (
        <div key={section.label}>
          <SectionLabel collapsed={collapsed}>{section.label}</SectionLabel>
          {section.items.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              label={item.label}
              icon={section.icon}
              soon={item.soon}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}

      <SectionLabel collapsed={collapsed}>Settings</SectionLabel>
      {canManageAccounts(roleCtx) ? (
        settingsItems.map((item) => (
          <NavLink
            key={item.label}
            href={item.href}
            label={item.label}
            icon={Settings}
            soon={item.soon}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))
      ) : (
        <NavLink href="/fms" label="Settings" icon={Settings} soon collapsed={collapsed} onNavigate={onNavigate} />
      )}

      {canViewAuditLog(roleCtx) && (
        <NavLink href="/fms/audit-logs" label="Audit Logs" icon={ScrollText} collapsed={collapsed} onNavigate={onNavigate} />
      )}
    </nav>
  );
}
