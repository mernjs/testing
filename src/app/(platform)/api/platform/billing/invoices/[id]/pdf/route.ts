import { NextRequest, NextResponse } from "next/server";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { currentCompanyId, isPlatformOwnerContext } from "@/lib/platform/tenancy/context";
import { getSaasInvoice } from "@/lib/platform/billing/invoices";
import { renderSaasInvoicePdf } from "@/components/platform/billing/SaasInvoicePdf";

type Context = { params: Promise<{ id: string }> };

/**
 * Downloads a SaaS tax invoice-cum-receipt. A company's Super Admins get only
 * their own company's invoices (anything else is a 404, never a 403, so ids
 * can't be probed); the platform owner's Super Admins (the console) get any.
 */
export async function GET(req: NextRequest, { params }: Context) {
  const user = await getCurrentHubUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.roles.includes("super_admin")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [{ id }, companyId, isPlatformAdmin] = await Promise.all([params, currentCompanyId(), isPlatformOwnerContext()]);
  const invoice = await getSaasInvoice(id);
  if (!invoice || (invoice.companyId !== companyId && !isPlatformAdmin)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = await renderSaasInvoicePdf(invoice);
  const filename = `${invoice.number!.replace(/\//g, "-")}.pdf`;
  const disposition = req.nextUrl.searchParams.get("download") === "1" ? "attachment" : "inline";
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
