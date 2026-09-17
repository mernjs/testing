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
        { label: "Invoices", href: "/fms/invoices" },
        { label: "Payment Receipts", href: "/fms/receipts" },
        { label: "Credit Notes", href: "/fms/credit-notes" },
        { label: "Refunds", href: "/fms/refunds" },
        { label: "Receivables", href: "/fms/receivables" },
      ],
    },
    {
      label: "Purchases & Payables",
      icon: Building2,
      items: [
        { label: "Vendors", href: "/fms/vendors" },
        { label: "Bills", href: "/fms/bills" },
        { label: "Payment Requests", href: "/fms/bills?status=pending" },
        { label: "Vendor Payments", href: "/fms/bills" },
        { label: "Debit Notes", href: "/fms/debit-notes" },
        { label: "Payables", href: "/fms/payables" },
      ],
    },
    {
      label: "Expenses",
      icon: Receipt,
      items: [
        { label: "All Expenses", href: "/fms/transactions?type=expense" },
        { label: "Employee Expenses", href: "/fms/employee-expenses" },
        { label: "Reimbursements", href: "/fms/employee-expenses" },
        { label: "Travel", href: "/fms/transactions?type=expense&accountCode=5500" },
        { label: "Office", href: "/fms/transactions?type=expense&accountCode=5300" },
        { label: "Marketing", href: "/fms/transactions?type=expense&accountCode=5400" },
        { label: "Miscellaneous", href: "/fms/transactions?type=expense&accountCode=5900" },
      ],
    },
    {
      label: "Payroll",
      icon: Wallet,
      items: [
        { label: "Salary Payables", href: "/fms/salary-payments" },
        { label: "Payroll Runs", href: "/fms/payroll-runs" },
        { label: "Salary Payments", href: "/fms/salary-payments" },
        { label: "Advances", href: "/fms/advances" },
        { label: "Deductions", href: "/fms/payroll-runs" },
        { label: "Payslips", href: "/fms/payroll-runs" },
      ],
    },
    {
      label: "Assets",
      icon: Landmark,
      items: [
        { label: "Asset Register", href: "/fms/assets" },
        { label: "Asset Purchases", href: "/fms/assets" },
        { label: "Asset Expenses", href: "/fms/asset-expenses" },
        { label: "Depreciation", href: "/fms/assets" },
        { label: "Transfers", href: comingSoonHref("Assets", "Transfers"), soon: true },
        { label: "Disposal", href: "/fms/assets" },
      ],
    },
    {
      label: "Banking",
      icon: Landmark,
      items: [
        { label: "Bank Accounts", href: "/fms/bank-accounts" },
        { label: "Bank Transactions", href: "/fms/transactions?fundAccountType=bank" },
        { label: "Transfers", href: "/fms/transfers" },
        { label: "Reconciliation", href: "/fms/bank-reconciliation" },
      ],
    },
    {
      label: "Cash",
      icon: Coins,
      items: [
        { label: "Cash Accounts", href: "/fms/cash-accounts" },
        { label: "Cash Transactions", href: "/fms/transactions?fundAccountType=cash" },
        { label: "Cash Reconciliation", href: "/fms/cash-reconciliation" },
      ],
    },
    {
      label: "Budgets",
      icon: PiggyBank,
      items: [
        { label: "Budget vs Actual", href: "/fms/reports/budget-vs-actual" },
        { label: "Budget Allocation", href: "/prms/budgets" },
        { label: "Budget Utilization", href: "/fms/reports/budget-vs-actual" },
        { label: "Variance", href: "/fms/reports/budget-vs-actual" },
      ],
    },
    {
      label: "Taxes",
      icon: Percent,
      items: [
        { label: "Tax Configuration", href: "/fms/settings/tax-config" },
        { label: "Tax Payable", href: "/fms/reports/tax" },
        { label: "Tax Collected", href: "/fms/reports/tax" },
        { label: "Tax Reports", href: "/fms/reports/tax" },
      ],
    },
    {
      label: "Approvals",
      icon: CheckSquare,
      items: [
        { label: "Pending Approvals", href: "/fms/approvals" },
        { label: "Approved", href: "/fms/transactions?status=approved" },
        { label: "Rejected", href: "/fms/transactions?status=rejected" },
        { label: "Approval Rules", href: "/fms/settings/approvals" },
      ],
    },
    {
      label: "Reports",
      icon: BarChart3,
      items: [
        { label: "Profit & Loss", href: "/fms/reports/profit-and-loss" },
        { label: "Balance Sheet", href: "/fms/reports/balance-sheet" },
        { label: "Cash Flow", href: "/fms/reports/cash-flow" },
        { label: "Trial Balance", href: "/fms/trial-balance" },
        { label: "General Ledger", href: "/fms/general-ledger" },
        { label: "Accounts Receivable", href: "/fms/receivables" },
        { label: "Accounts Payable", href: "/fms/payables" },
        { label: "Expense Report", href: "/fms/reports/expense" },
        { label: "Revenue Report", href: "/fms/reports/revenue" },
        { label: "Tax Report", href: "/fms/reports/tax" },
        { label: "Payroll Report", href: "/fms/payroll-runs" },
        { label: "Project Profitability", href: "/fms/reports/project-profitability" },
        { label: "Financial Summary", href: "/fms/reports/financial-summary" },
      ],
    },
  ];

  const settingsItems: NavItemDef[] = [
    { label: "Chart of Accounts", href: "/fms/settings/accounts" },
    { label: "Financial Categories", href: "/fms/settings/accounts" },
    { label: "Payment Methods", href: "/fms/settings/payment-methods" },
    { label: "Currencies", href: "/fms/settings/exchange-rates" },
    { label: "Tax Rules", href: "/fms/settings/tax-config" },
    { label: "Fiscal Year", href: "/fms/settings/fiscal-periods" },
    { label: "Numbering", href: "/fms/settings/numbering" },
    { label: "Approval Configuration", href: "/fms/settings/approvals" },
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
