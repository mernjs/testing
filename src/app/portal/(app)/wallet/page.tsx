import Link from "next/link";
import { guardPortalPage } from "@/lib/portal/guard";
import { getWalletOverview, getWalletHistory } from "@/lib/portal/wallet";
import { WALLET_TX_TYPE_LABELS, formatCredits } from "@/lib/wallet/constants";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { PortalPageHeader } from "@/components/portal/widgets";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Wallet · YashOrbit Portal" };

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <GlassCard interactive={false}>
      <CardContent className="py-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-xl font-black tracking-tight text-foreground">{value}</p>
      </CardContent>
    </GlassCard>
  );
}

export default async function PortalWalletPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const user = await guardPortalPage();
  const { page } = await searchParams;
  const pageNum = Math.max(Number(page) || 1, 1);
  const [overview, history] = await Promise.all([getWalletOverview(user.id), getWalletHistory(user.id, pageNum)]);
  const b = overview.balances;

  return (
    <div className="mx-auto max-w-5xl space-y-5 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "Wallet" }]} />
      <PortalPageHeader title="YashOrbit Wallet" subtitle="Promotional credits you earn and can redeem on eligible offers." />

      <GlassCard interactive={false}>
        <CardContent className="py-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Available credits</p>
          <p className="mt-2 text-4xl font-black tracking-tight text-foreground">{formatCredits(b.available)}</p>
          {overview.status === "frozen" && <p className="mt-2 text-sm text-destructive">This wallet is frozen — contact support.</p>}
          <div className="mt-4 flex justify-center gap-2 text-sm">
            <Link href="/offers" className="rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground">Use Credits</Link>
            <Link href="/portal/referrals" className="rounded-full border border-border px-5 py-2 font-medium hover:border-primary">Earn Credits</Link>
            <a href="/api/portal/wallet/statement" className="rounded-full border border-border px-5 py-2 font-medium hover:border-primary">Download statement</a>
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Pending" value={b.pending.toLocaleString("en-IN")} />
        <Stat label="Locked (in redemption)" value={b.locked.toLocaleString("en-IN")} />
        <Stat label="Expiring in 30 days" value={overview.expiringSoon.toLocaleString("en-IN")} />
        <Stat label="Lifetime earned" value={b.lifetimeEarned.toLocaleString("en-IN")} />
        <Stat label="Lifetime used" value={b.lifetimeRedeemed.toLocaleString("en-IN")} />
        <Stat label="Expired" value={b.lifetimeExpired.toLocaleString("en-IN")} />
      </div>

      <GlassCard interactive={false}>
        <CardHeader>
          <CardTitle className="text-base">Transactions</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Date</th>
                <th className="py-2 pr-3 font-medium">Type</th>
                <th className="py-2 pr-3 font-medium">Amount</th>
                <th className="py-2 font-medium">Balance after</th>
              </tr>
            </thead>
            <tbody>
              {history.items.map((t) => (
                <tr key={t._id} className="border-b border-border/40 last:border-0">
                  <td className="py-2 pr-3 text-muted-foreground">{formatDateTime(t.createdAt)}</td>
                  <td className="py-2 pr-3 text-foreground">{WALLET_TX_TYPE_LABELS[t.type]}</td>
                  <td className={`py-2 pr-3 font-semibold ${t.direction === "credit" ? "text-green-600 dark:text-green-400" : "text-foreground"}`}>
                    {t.direction === "credit" ? "+" : "−"}
                    {t.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-2 text-muted-foreground">{t.balanceAfter.toLocaleString("en-IN")}</td>
                </tr>
              ))}
              {history.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">No transactions yet.</td>
                </tr>
              )}
            </tbody>
          </table>
          {history.totalPages > 1 && (
            <div className="mt-3 flex justify-between text-sm">
              {pageNum > 1 ? <Link className="text-primary" href={`/portal/wallet?page=${pageNum - 1}`}>← Newer</Link> : <span />}
              {pageNum < history.totalPages && <Link className="text-primary" href={`/portal/wallet?page=${pageNum + 1}`}>Older →</Link>}
            </div>
          )}
        </CardContent>
      </GlassCard>

      <p className="text-xs text-muted-foreground">
        YashOrbit Credits are promotional/reward credits, not cash. They are subject to eligibility, expiry, redemption limits and campaign rules, are not
        transferable, and may be reversed in case of cancellation or misuse.
      </p>
    </div>
  );
}
