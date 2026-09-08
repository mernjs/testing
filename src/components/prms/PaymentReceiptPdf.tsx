import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { Payment } from "@/lib/prms/payments";
import type { Invoice } from "@/lib/prms/invoices";
import type { CompanyIdentity } from "@/lib/prms/settings";

const NAVY = "#1D428A";
const INK = "#1f2937";
const MUTE = "#6b7280";

let logoCache: string | null | undefined;
function logoUri(): string | null {
  if (logoCache !== undefined) return logoCache ?? null;
  try {
    const buf = fs.readFileSync(path.join(process.cwd(), "public/brand/icon-transparent.png"));
    logoCache = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    logoCache = null;
  }
  return logoCache;
}
function money(n: number, c: string) {
  return `${c} ${(Math.round((n || 0) * 100) / 100).toLocaleString("en-IN")}`;
}
function fmtDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const s = StyleSheet.create({
  page: { padding: 44, fontSize: 10, fontFamily: "Helvetica", color: INK },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 26, height: 26 },
  brand: { fontSize: 13, fontFamily: "Helvetica-Bold", color: NAVY },
  small: { fontSize: 8, color: MUTE },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: NAVY, textAlign: "right" },
  meta: { fontSize: 9, color: MUTE, textAlign: "right", marginTop: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0" },
  label: { fontSize: 8, color: MUTE, textTransform: "uppercase", letterSpacing: 1, marginTop: 16 },
  grand: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingTop: 6, borderTopWidth: 1, borderTopColor: INK, fontFamily: "Helvetica-Bold", fontSize: 12 },
  foot: { position: "absolute", bottom: 30, left: 44, right: 44, textAlign: "center", color: MUTE, fontSize: 8 },
});

function ReceiptDoc({ payment, invoice, company }: { payment: Payment; invoice: Invoice; company: CompanyIdentity }) {
  const logo = logoUri();
  return (
    <Document title={`Payment Receipt ${payment.paymentCode}`}>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View>
            <View style={s.logoRow}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {logo ? <Image src={logo} style={s.logo} /> : null}
              <Text style={s.brand}>{company.name}</Text>
            </View>
            <Text style={[s.small, { marginTop: 4 }]}>{[company.addressLine, company.city].filter(Boolean).join(", ")}</Text>
            <Text style={s.small}>{company.gstin ? `GSTIN: ${company.gstin}` : ""}</Text>
          </View>
          <View>
            <Text style={s.title}>PAYMENT RECEIPT</Text>
            <Text style={s.meta}>{payment.paymentCode}</Text>
            <Text style={s.meta}>{fmtDate(payment.paymentDate.toISOString().slice(0, 10))}</Text>
          </View>
        </View>

        <Text style={s.label}>Paid to</Text>
        <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 2 }}>{payment.vendorName}</Text>

        <Text style={s.label}>Against invoice</Text>
        <View style={s.row}><Text style={s.small}>Our invoice ref</Text><Text>{invoice.invoiceNumber}</Text></View>
        <View style={s.row}><Text style={s.small}>Vendor invoice</Text><Text>{invoice.vendorInvoiceNumber ?? "—"}</Text></View>
        <View style={s.row}><Text style={s.small}>Invoice net payable</Text><Text>{money(invoice.netPayable, invoice.currency)}</Text></View>

        <Text style={s.label}>Payment</Text>
        <View style={s.row}><Text style={s.small}>Method</Text><Text style={{ textTransform: "capitalize" }}>{payment.method.replace(/_/g, " ")}</Text></View>
        <View style={s.row}><Text style={s.small}>Transaction reference</Text><Text>{payment.transactionReference ?? "—"}</Text></View>
        {payment.tdsDeducted > 0 && <View style={s.row}><Text style={s.small}>TDS deducted</Text><Text>{money(payment.tdsDeducted, invoice.currency)}</Text></View>}
        <View style={s.grand}><Text>Amount paid</Text><Text>{money(payment.amount, invoice.currency)}</Text></View>

        <Text style={s.foot}>System-generated payment receipt from {company.name}.</Text>
      </Page>
    </Document>
  );
}

export async function renderPaymentReceiptPdf(payment: Payment, invoice: Invoice, company: CompanyIdentity): Promise<Buffer> {
  return renderToBuffer(<ReceiptDoc payment={payment} invoice={invoice} company={company} />);
}
