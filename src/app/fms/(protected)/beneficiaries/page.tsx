import Link from "next/link";
import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Plus,
  Search,
  CheckCircle2,
  QrCode,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { listBeneficiaries, type BeneficiaryEntity } from "@/lib/fms/beneficiaries";
import { Badge } from "@/components/ui/badge";
import { revalidatePath } from "next/cache";
import { saveBeneficiary } from "@/lib/fms/beneficiaries";
import { getCurrentFmsUser } from "@/lib/fms-auth";

export default async function BeneficiariesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const entityType = (sp.type as BeneficiaryEntity) || undefined;
  const query = sp.q?.toLowerCase() || "";

  const user = await getCurrentFmsUser();
  const allBeneficiaries = await listBeneficiaries(entityType);

  const filtered = allBeneficiaries.filter((b) => {
    if (!query) return true;
    return (
      b.beneficiaryName.toLowerCase().includes(query) ||
      b.bankName.toLowerCase().includes(query) ||
      b.accountNumber.toLowerCase().includes(query) ||
      b.ifsc.toLowerCase().includes(query) ||
      (b.upiId && b.upiId.toLowerCase().includes(query))
    );
  });

  const vendorCount = allBeneficiaries.filter((b) => b.entityType === "vendor").length;
  const employeeCount = allBeneficiaries.filter((b) => b.entityType === "employee").length;
  const clientCount = allBeneficiaries.filter((b) => b.entityType === "client").length;
  const studentCount = allBeneficiaries.filter((b) => b.entityType === "student").length;

  async function addBeneficiaryAction(formData: FormData) {
    "use server";
    const currUser = await getCurrentFmsUser();
    if (!currUser) return;

    const bName = formData.get("beneficiaryName") as string;
    const eType = formData.get("entityType") as BeneficiaryEntity;
    const eId = formData.get("entityId") as string;
    const bBank = formData.get("bankName") as string;
    const accNo = formData.get("accountNumber") as string;
    const ifscCode = formData.get("ifsc") as string;
    const upi = formData.get("upiId") as string;
    const notes = formData.get("notes") as string;

    if (!bName || !accNo || !ifscCode) return;

    await saveBeneficiary(
      {
        entityType: eType,
        entityId: eId || `REF-${Date.now().toString().slice(-6)}`,
        beneficiaryName: bName,
        bankName: bBank || "Standard Bank",
        accountNumber: accNo,
        ifsc: ifscCode,
        upiId: upi || null,
        notes: notes || null,
      },
      currUser.id
    );

    revalidatePath("/fms/beneficiaries");
  }

  return (
    <div className="relative space-y-6">
      <Breadcrumbs items={[{ label: "FMS", href: "/fms" }, { label: "Banking" }, { label: "Entity Bank Accounts" }]} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-yashorbit-coral text-white shadow-sm">
              <Building2 className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Entity Bank &amp; UPI Accounts</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Centralized directory of saved bank details for Vendors, Employees, Clients, and Students for 1-click payouts.
              </p>
            </div>
          </div>
        </div>

        {/* Action button modal target / quick add link */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
            <ShieldCheck className="size-3.5 mr-1" />
            Instant Bank Verification Active
          </Badge>
        </div>
      </div>

      {/* KPIs */}
      <KpiGrid>
        <KpiCard label="Vendor Bank Accounts (PRMS)" value={vendorCount} icon={<ShoppingBag className="size-4" />} />
        <KpiCard label="Employee Salary Accounts (HRMS)" value={employeeCount} icon={<Users className="size-4" />} />
        <KpiCard label="Client Billing Accounts (PMS)" value={clientCount} icon={<Briefcase className="size-4" />} />
        <KpiCard label="Student Refund Accounts (TMS)" value={studentCount} icon={<GraduationCap className="size-4" />} />
      </KpiGrid>

      {/* Add New Beneficiary Form Surface */}
      <GlassCard className="p-5 border-border/40">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
          <Plus className="size-4 text-primary" />
          Save New Entity Bank / UPI Account
        </h3>
        <form action={addBeneficiaryAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Beneficiary Name</label>
            <input
              type="text"
              name="beneficiaryName"
              required
              placeholder="e.g. Acme Supplies / Rahul Sharma"
              className="mt-1 w-full rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Entity Type</label>
            <select
              name="entityType"
              className="mt-1 w-full rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="vendor">Vendor (PRMS)</option>
              <option value="employee">Employee (HRMS)</option>
              <option value="client">Client (PMS)</option>
              <option value="student">Student (TMS)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Bank Name</label>
            <input
              type="text"
              name="bankName"
              required
              placeholder="HDFC Bank / ICICI / SBI"
              className="mt-1 w-full rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Account Number</label>
            <input
              type="text"
              name="accountNumber"
              required
              placeholder="50100234567890"
              className="mt-1 w-full rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">IFSC Code</label>
            <input
              type="text"
              name="ifsc"
              required
              placeholder="HDFC0001234"
              className="mt-1 w-full rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">UPI ID (Optional)</label>
            <input
              type="text"
              name="upiId"
              placeholder="name@upi / 9876543210@paytm"
              className="mt-1 w-full rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase">Ref / Code (Optional)</label>
            <input
              type="text"
              name="entityId"
              placeholder="EMP-102 / VEND-55"
              className="mt-1 w-full rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90 flex items-center justify-center gap-1.5"
            >
              <Plus className="size-3.5" />
              Save Account
            </button>
          </div>
        </form>
      </GlassCard>

      {/* Tabs & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { key: "", label: "All Accounts" },
            { key: "vendor", label: "Vendors (PRMS)" },
            { key: "employee", label: "Employees (HRMS)" },
            { key: "client", label: "Clients (PMS)" },
            { key: "student", label: "Students (TMS)" },
          ].map((item) => (
            <Link
              key={item.key}
              href={`/fms/beneficiaries?type=${item.key}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                (entityType || "") === item.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <form className="relative min-w-[240px]">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search bank / account / IFSC..."
            className="w-full rounded-xl border border-border/50 bg-background pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </form>
      </div>

      {/* Beneficiaries Table */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm">Saved Beneficiary Directory</h3>
          <span className="text-xs text-muted-foreground">Total {filtered.length} active bank records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider border-b border-border/40">
              <tr>
                <th className="px-4 py-3">Beneficiary / Entity</th>
                <th className="px-4 py-3">Source Panel</th>
                <th className="px-4 py-3">Bank Name</th>
                <th className="px-4 py-3">Account Number</th>
                <th className="px-4 py-3">IFSC</th>
                <th className="px-4 py-3">UPI ID</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No beneficiary bank details recorded. Use the form above to add vendor, employee, client or student bank accounts.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b._id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-foreground">{b.beneficiaryName}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{b.entityId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="capitalize text-[10px] font-semibold bg-primary/10 text-primary border-primary/20">
                        {b.entityType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">{b.bankName}</td>
                    <td className="px-4 py-3 font-mono text-foreground font-semibold">
                      •••• {b.accountNumberLast4 || b.accountNumber.slice(-4)}
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">{b.ifsc}</td>
                    <td className="px-4 py-3 font-mono text-primary">{b.upiId || "—"}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/fms/payments?payee=${encodeURIComponent(b.beneficiaryName)}&bank=${encodeURIComponent(b.bankName)}`}
                        className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        <ArrowUpRight className="size-3" />
                        Pay Now
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
