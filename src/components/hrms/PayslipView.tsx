"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { monthLabelLong } from "@/lib/hrms/payroll-status";

interface Line {
  name: string;
  amount: number;
}

export interface PayslipViewData {
  month: string;
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
  bankAccountLast4: string | null;
  bankName: string | null;
  ifsc: string | null;
  runStatus: string;
}

export default function PayslipView({ data, showPrint = true }: { data: PayslipViewData; showPrint?: boolean }) {
  return (
    <div className="space-y-4">
      {showPrint && (
        <div className="flex justify-end print:hidden">
          <Button type="button" variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="size-3.5" data-icon="inline-start" />
            Print / Save PDF
          </Button>
        </div>
      )}

      <div className="payslip rounded-2xl border border-border/60 bg-card p-6 text-sm text-card-foreground">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div>
            <p className="text-lg font-black tracking-tight text-foreground">Payslip — {monthLabelLong(data.month)}</p>
            <p className="text-muted-foreground">YashOrbit</p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">{data.employeeName}</p>
            <p className="font-mono text-xs text-muted-foreground">{data.employeeCode}</p>
            {data.runStatus !== "paid" && <p className="text-xs text-amber-600 dark:text-amber-400">Provisional — run {data.runStatus}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-border/60 py-3 text-xs text-muted-foreground sm:grid-cols-4">
          <div>Working days<span className="block text-sm font-medium text-foreground">{data.workingDays}</span></div>
          <div>Loss of pay days<span className="block text-sm font-medium text-foreground">{data.lopDays}</span></div>
          <div>Bank A/C<span className="block text-sm font-medium text-foreground">{data.bankAccountLast4 ? `XXXXXX${data.bankAccountLast4}` : "—"}</span></div>
          <div>IFSC<span className="block text-sm font-medium text-foreground">{data.ifsc ?? "—"}</span></div>
        </div>

        <div className="grid gap-6 py-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Earnings</p>
            <table className="w-full">
              <tbody>
                {data.earnings.map((e, i) => (
                  <tr key={i} className="border-b border-border/40 last:border-0">
                    <td className="py-1.5">{e.name}</td>
                    <td className="py-1.5 text-right tabular-nums">{formatCurrency(e.amount)}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-foreground">
                  <td className="pt-2">Gross Pay</td>
                  <td className="pt-2 text-right tabular-nums">{formatCurrency(data.grossPay)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deductions</p>
            <table className="w-full">
              <tbody>
                {data.deductions.length === 0 && (
                  <tr><td className="py-1.5 text-muted-foreground">None</td><td /></tr>
                )}
                {data.deductions.map((d, i) => (
                  <tr key={i} className="border-b border-border/40 last:border-0">
                    <td className="py-1.5">{d.name}</td>
                    <td className="py-1.5 text-right tabular-nums">{formatCurrency(d.amount)}</td>
                  </tr>
                ))}
                <tr className="font-semibold text-foreground">
                  <td className="pt-2">Total Deductions</td>
                  <td className="pt-2 text-right tabular-nums">{formatCurrency(data.totalDeductions)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3">
          <span className="font-semibold text-foreground">Net Pay</span>
          <span className="text-lg font-black text-foreground tabular-nums">{formatCurrency(data.netPay)}</span>
        </div>

        <div className="mt-4 border-t border-border/60 pt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Employer Contributions (not deducted from pay)</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
            {data.employerContributions.map((c, i) => (
              <span key={i}>
                {c.name}: <span className="font-medium text-foreground">{formatCurrency(c.amount)}</span>
              </span>
            ))}
            <span>Total cost to company: <span className="font-medium text-foreground">{formatCurrency(data.employerCost)}</span></span>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          Computer-generated payslip. Figures follow the configured statutory rates and the India new tax regime.
        </p>
      </div>
    </div>
  );
}
