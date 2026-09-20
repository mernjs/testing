import { NextResponse } from "next/server";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import { listWalletTransactions } from "@/lib/wallet/transactions";
import { WALLET_TX_TYPE_LABELS } from "@/lib/wallet/constants";
import { toCsv, csvResponse } from "@/lib/wallet/csv";

/** A signed-in user's own wallet statement (their rows only, never anyone else's). */
export async function GET() {
  const user = await getCurrentPortalUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { items } = await listWalletTransactions({ userId: user.id, pageSize: 100 });
  return csvResponse(
    `yo-credits-statement-${new Date().toISOString().slice(0, 10)}.csv`,
    toCsv(
      ["Date", "Description", "Direction", "Amount", "Balance before", "Balance after", "Status", "Expires", "Note"],
      items.map((t) => [t.createdAt, WALLET_TX_TYPE_LABELS[t.type], t.direction, t.amount, t.balanceBefore, t.balanceAfter, t.status, t.expiresAt, t.reason])
    )
  );
}
