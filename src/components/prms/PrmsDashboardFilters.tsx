"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CalendarRange, X, SlidersHorizontal } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DATE_RANGE_PRESETS } from "@/lib/date-ranges";
import { EXPENSE_CATEGORIES } from "@/lib/prms/constants";
import { formatDate } from "@/lib/utils";

interface Props {
  range: string;
  dateFrom: string;
  dateTo: string;
  departmentId: string;
  projectId: string;
  vendorId: string;
  category: string;
  paymentStatus?: string;
  expenseType?: string;
  departments: { _id: string; name: string }[];
  projects: { _id: string; name: string }[];
  vendors: { _id: string; companyName: string }[];
  hasActiveFilters: boolean;
}

const PAYMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partially Paid" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

const EXPENSE_TYPE_OPTIONS = [
  { value: "direct", label: "Direct Expense" },
  { value: "reimbursement", label: "Reimbursement" },
  { value: "petty_cash", label: "Petty Cash" },
  { value: "vendor_payment", label: "Vendor Payment" },
  { value: "subscription", label: "Subscription" },
];

export default function PrmsDashboardFilters({
  range,
  dateFrom,
  dateTo,
  departmentId,
  projectId,
  vendorId,
  category,
  paymentStatus = "",
  expenseType = "",
  departments,
  projects,
  vendors,
  hasActiveFilters,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [customOpen, setCustomOpen] = useState(false);
  const [pendingFrom, setPendingFrom] = useState(dateFrom);
  const [pendingTo, setPendingTo] = useState(dateTo);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  function openCustom() {
    setPendingFrom(dateFrom);
    setPendingTo(dateTo);
    setCustomOpen(true);
  }

  function applyCustom() {
    updateParams({ range: "custom", dateFrom: pendingFrom || undefined, dateTo: pendingTo || undefined });
    setCustomOpen(false);
  }

  // Count active non-date filters
  const activeCount = [departmentId, projectId, vendorId, category, paymentStatus, expenseType].filter(Boolean).length;

  return (
    <GlassCard interactive={false}>
      <CardContent className="p-4">

        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Dashboard Analytics Filters
            </span>
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => router.replace(pathname)}
              className="h-7 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="size-3 mr-1" />
              Reset All
            </Button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-end gap-3">

          {/* ── Date Range ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Date Range</label>
            <Select
              value={range || "thisYear"}
              onValueChange={(v) => {
                if (v === "custom") {
                  updateParams({ range: "custom" });
                  openCustom();
                } else {
                  setCustomOpen(false);
                  updateParams({ range: v ?? undefined, dateFrom: undefined, dateTo: undefined });
                }
              }}
            >
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DATE_RANGE_PRESETS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Custom Date Picker ── */}
          {range === "custom" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Custom Dates</label>
              <Popover open={customOpen} onOpenChange={(open) => (open ? openCustom() : setCustomOpen(false))}>
                <PopoverTrigger
                  render={
                    <Button type="button" variant="outline" size="sm" className="h-8 text-xs">
                      <CalendarRange className="size-3.5 mr-1" />
                      {formatDate(dateFrom)} – {formatDate(dateTo)}
                    </Button>
                  }
                />
                <PopoverContent align="start" className="w-auto p-3">
                  <div className="flex items-end gap-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">From</label>
                      <Input type="date" value={pendingFrom} max={pendingTo || undefined} onChange={(e) => setPendingFrom(e.target.value)} className="w-auto h-8 text-xs" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">To</label>
                      <Input type="date" value={pendingTo} min={pendingFrom || undefined} onChange={(e) => setPendingTo(e.target.value)} className="w-auto h-8 text-xs" />
                    </div>
                  </div>
                  <Button type="button" size="sm" onClick={applyCustom} disabled={!pendingFrom || !pendingTo} className="mt-2 w-full h-8 text-xs">
                    Apply Custom Dates
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* ── Department ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Department</label>
            <Select value={departmentId || "all"} onValueChange={(v) => updateParams({ departmentId: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="All Departments" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((d) => (<SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Project ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Project</label>
            <Select value={projectId || "all"} onValueChange={(v) => updateParams({ projectId: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="All Projects" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map((p) => (<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Vendor ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Vendor</label>
            <Select value={vendorId || "all"} onValueChange={(v) => updateParams({ vendorId: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="All Vendors" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map((v) => (<SelectItem key={v._id} value={v._id}>{v.companyName}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Category ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Category</label>
            <Select value={category || "all"} onValueChange={(v) => updateParams({ category: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map((c) => (<SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Payment Status ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Payment Status</label>
            <Select value={paymentStatus || "all"} onValueChange={(v) => updateParams({ paymentStatus: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {PAYMENT_STATUS_OPTIONS.map((s) => (<SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          {/* ── Expense Type ── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Expense Type</label>
            <Select value={expenseType || "all"} onValueChange={(v) => updateParams({ expenseType: !v || v === "all" ? undefined : v })}>
              <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {EXPENSE_TYPE_OPTIONS.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

        </div>

        {/* ── Active filter pills ── */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/40">
            <span className="text-xs text-muted-foreground font-medium">Active:</span>

            {departmentId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                Dept: {departments.find((d) => d._id === departmentId)?.name ?? departmentId}
                <button onClick={() => updateParams({ departmentId: undefined })} className="ml-0.5 hover:text-destructive">×</button>
              </span>
            )}
            {projectId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                Project: {projects.find((p) => p._id === projectId)?.name ?? projectId}
                <button onClick={() => updateParams({ projectId: undefined })} className="ml-0.5 hover:text-destructive">×</button>
              </span>
            )}
            {vendorId && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
                Vendor: {vendors.find((v) => v._id === vendorId)?.companyName ?? vendorId}
                <button onClick={() => updateParams({ vendorId: undefined })} className="ml-0.5 hover:text-destructive">×</button>
              </span>
            )}
            {category && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                Category: {EXPENSE_CATEGORIES.find((c) => c.value === category)?.label ?? category}
                <button onClick={() => updateParams({ category: undefined })} className="ml-0.5 hover:text-destructive">×</button>
              </span>
            )}
            {paymentStatus && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Payment: {PAYMENT_STATUS_OPTIONS.find((s) => s.value === paymentStatus)?.label ?? paymentStatus}
                <button onClick={() => updateParams({ paymentStatus: undefined })} className="ml-0.5 hover:text-destructive">×</button>
              </span>
            )}
            {expenseType && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                Type: {EXPENSE_TYPE_OPTIONS.find((t) => t.value === expenseType)?.label ?? expenseType}
                <button onClick={() => updateParams({ expenseType: undefined })} className="ml-0.5 hover:text-destructive">×</button>
              </span>
            )}
          </div>
        )}

      </CardContent>
    </GlassCard>
  );
}
