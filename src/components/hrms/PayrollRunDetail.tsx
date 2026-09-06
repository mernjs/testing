"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Banknote, Download, Loader2, Pencil } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import PayslipView, { type PayslipViewData } from "@/components/hrms/PayslipView";
import { payrollRunStatusMeta, monthLabelLong } from "@/lib/hrms/payroll-status";
import { formatCurrency } from "@/lib/utils";
import { approveRunAction, markRunPaidAction, savePayslipOverridesAction } from "@/app/hrms/(protected)/payroll/actions";

interface Line {
  name: string;
  amount: number;
}
interface Slip {
  _id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  workingDays: number;
  lopDays: number;
  earnings: Line[];
  grossPay: number;
  deductions: Line[];
  totalDeductions: number;
  employerContributions: Line[];
  employerCost: number;
  netPay: number;
  overrides: { arrears: number; manualTds: number | null; otherDeductions: number };
  bankAccountNumber: string | null;
  bankIfsc: string | null;
}
interface Run {
  _id: string;
  month: string;
  status: string;
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  totalEmployerCost: number;
}

export default function PayrollRunDetail({ run, slips }: { run: Run; slips: Slip[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [viewSlip, setViewSlip] = useState<Slip | null>(null);
  const [editSlip, setEditSlip] = useState<Slip | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ arrears: "0", manualTds: "", otherDeductions: "0" });

  const meta = payrollRunStatusMeta(run.status);
  const isDraft = run.status === "draft";

  function openEdit(s: Slip) {
    setEditSlip(s);
    setErrors({});
    setForm({
      arrears: String(s.overrides.arrears),
      manualTds: s.overrides.manualTds == null ? "" : String(s.overrides.manualTds),
      otherDeductions: String(s.overrides.otherDeductions),
    });
  }

  function saveOverrides() {
    if (!editSlip) return;
    setErrors({});
    startTransition(async () => {
      const result = await savePayslipOverridesAction(editSlip._id, {
        arrears: form.arrears,
        manualTds: form.manualTds,
        otherDeductions: form.otherDeductions,
      });
      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        toast.error(result.error ?? "Please fix the highlighted fields.");
        return;
      }
      toast.success("Payslip updated");
      setEditSlip(null);
      router.refresh();
    });
  }

  function approve() {
    startTransition(async () => {
      const result = await approveRunAction(run._id);
      if (!result.ok) {
        toast.error(result.error ?? "Could not approve.");
        return;
      }
      toast.success("Run approved — payslips are now visible to employees");
      router.refresh();
    });
  }
  function pay() {
    startTransition(async () => {
      const result = await markRunPaidAction(run._id);
      if (!result.ok) {
        toast.error(result.error ?? "Could not mark paid.");
        return;
      }
      toast.success("Run marked paid — the month is now locked");
      router.refresh();
    });
  }

  const toView = (s: Slip): PayslipViewData => ({
    month: run.month,
    employeeName: s.employeeName,
    employeeCode: s.employeeCode,
    workingDays: s.workingDays,
    lopDays: s.lopDays,
    earnings: s.earnings,
    grossPay: s.grossPay,
    deductions: s.deductions,
    totalDeductions: s.totalDeductions,
    employerContributions: s.employerContributions,
    employerCost: s.employerCost,
    netPay: s.netPay,
    bankAccountNumber: s.bankAccountNumber,
    bankIfsc: s.bankIfsc,
    runStatus: run.status,
  });

  return (
    <div className="space-y-4">
      <GlassCard interactive={false}>
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground">{monthLabelLong(run.month)}</span>
            <Badge className={meta.badgeClass}>{meta.label}</Badge>
          </div>
          <div className="flex items-center gap-2">
            {run.status === "approved" && (
              <a href={`/api/hrms/payroll/runs/${run._id}/bank-csv`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                <Download className="size-3.5" data-icon="inline-start" />
                Bank CSV
              </a>
            )}
            {isDraft && (
              <AlertDialog>
                <AlertDialogTrigger render={<Button type="button" size="sm" disabled={pending}><Check className="size-3.5" data-icon="inline-start" />Approve Run</Button>} />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve the {monthLabelLong(run.month)} run?</AlertDialogTitle>
                    <AlertDialogDescription>Payslips become visible to employees. You can still make corrections until the run is marked paid.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={approve}>Approve</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {run.status === "approved" && (
              <AlertDialog>
                <AlertDialogTrigger render={<Button type="button" size="sm" disabled={pending}><Banknote className="size-3.5" data-icon="inline-start" />Mark Paid</Button>} />
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Mark this run as paid?</AlertDialogTitle>
                    <AlertDialogDescription>This locks {monthLabelLong(run.month)} — attendance and leave for that month can no longer be edited.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={pay}>Mark Paid</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Gross", value: run.totalGross },
          { label: "Deductions", value: run.totalDeductions },
          { label: "Net Payout", value: run.totalNet },
          { label: "Cost to Company", value: run.totalEmployerCost },
        ].map((k) => (
          <GlassCard key={k.label} interactive={false}>
            <CardContent className="py-3">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="text-lg font-bold tabular-nums text-foreground">{formatCurrency(k.value)}</p>
            </CardContent>
          </GlassCard>
        ))}
      </div>

      <GlassCard interactive={false}>
        <CardContent className="max-h-[60vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>LOP</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {slips.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>
                    <button type="button" onClick={() => setViewSlip(s)} className="font-medium hover:underline">{s.employeeName}</button>
                    <div className="font-mono text-xs text-muted-foreground">{s.employeeCode}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.lopDays || "—"}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{formatCurrency(s.grossPay)}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{formatCurrency(s.totalDeductions)}</TableCell>
                  <TableCell className="tabular-nums font-medium">{formatCurrency(s.netPay)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {isDraft && (
                        <Button type="button" variant="ghost" size="icon-sm" onClick={() => openEdit(s)} aria-label="Adjust">
                          <Pencil className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </GlassCard>

      <Sheet open={!!viewSlip} onOpenChange={(o) => !o && setViewSlip(null)}>
        <SheetContent className="sm:max-w-2xl">
          <SheetHeader className="border-b border-border/60">
            <SheetTitle>Payslip preview</SheetTitle>
            <SheetDescription>{viewSlip?.employeeName}</SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            {viewSlip && <PayslipView data={toView(viewSlip)} showPrint={false} />}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={!!editSlip} onOpenChange={(o) => !o && setEditSlip(null)}>
        <SheetContent>
          <SheetHeader className="border-b border-border/60">
            <SheetTitle>Adjust {editSlip?.employeeName}</SheetTitle>
            <SheetDescription>Overrides recompute the payslip immediately.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-1.5">
              <Label>Arrears (added to earnings)</Label>
              <Input inputMode="numeric" value={form.arrears} onChange={(e) => setForm((f) => ({ ...f, arrears: e.target.value }))} aria-invalid={!!errors.arrears || undefined} />
              {errors.arrears && <p className="text-xs text-destructive">{errors.arrears}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Manual TDS (blank = auto)</Label>
              <Input inputMode="numeric" value={form.manualTds} onChange={(e) => setForm((f) => ({ ...f, manualTds: e.target.value }))} placeholder="auto" aria-invalid={!!errors.manualTds || undefined} />
              {errors.manualTds && <p className="text-xs text-destructive">{errors.manualTds}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Other deductions</Label>
              <Input inputMode="numeric" value={form.otherDeductions} onChange={(e) => setForm((f) => ({ ...f, otherDeductions: e.target.value }))} aria-invalid={!!errors.otherDeductions || undefined} />
              {errors.otherDeductions && <p className="text-xs text-destructive">{errors.otherDeductions}</p>}
            </div>
            <Button type="button" onClick={saveOverrides} disabled={pending} className="w-full">
              {pending ? <Loader2 className="size-4 animate-spin" /> : "Save & Recompute"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
