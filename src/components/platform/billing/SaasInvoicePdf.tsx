import "server-only";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { SaasInvoice, SaasInvoiceParty } from "@/lib/platform/billing/invoices";
import { gstPercentLabel } from "@/lib/platform/billing/gst";
import { PDF_COLORS } from "@/lib/pdf/brand";
import { PdfLetterhead, PdfFooter, pdfSheet } from "@/lib/pdf/layout";
import { renderPdf } from "@/lib/pdf/identity";
import { rupeesInWords } from "@/lib/number-to-words";
import { runAsCompany } from "@/lib/platform/tenancy/context";
import { getPlatformOwnerCompanyId } from "@/lib/platform/tenancy/companies";

/**
 * GST tax invoice-cum-receipt for a SaaS subscription payment. Always printed
 * on the PLATFORM OWNER's letterhead (the seller), whichever company's host
 * the download came through.
 */

const C = PDF_COLORS;

function money(paise: number, currency: string): string {
  const v = (paise / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return currency === "INR" ? `Rs. ${v}` : `${currency} ${v}`;
}
function fmtDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

const s = StyleSheet.create({
  page: pdfSheet.pagePortrait,
  small: { fontSize: 8, color: C.mute },
  cols: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  label: pdfSheet.label,
  value: pdfSheet.value,
  line: { fontSize: 8.5, marginTop: 1 },
  tHead: { ...pdfSheet.tHead, marginTop: 16 },
  tRow: pdfSheet.tRow,
  stamp: {
    position: "absolute",
    top: 190,
    right: 60,
    borderWidth: 2.5,
    borderColor: "#15803d",
    borderStyle: "solid",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 14,
    transform: "rotate(-12deg)",
    alignItems: "center",
  },
  stampText: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#15803d", letterSpacing: 3 },
  stampSub: { fontSize: 7, color: "#15803d" },
  words: { marginTop: 10, fontSize: 8.5 },
  note: { marginTop: 14, padding: 8, backgroundColor: C.soft, fontSize: 8, color: C.mute },
});

function Party({ title, party }: { title: string; party: SaasInvoiceParty }) {
  return (
    <View style={{ width: "48%" }}>
      <Text style={s.label}>{title}</Text>
      <Text style={s.value}>{party.legalName}</Text>
      {party.address ? <Text style={s.line}>{party.address}</Text> : null}
      <Text style={s.line}>GSTIN: {party.gstin ?? "Unregistered"}</Text>
      {party.state ? <Text style={s.line}>State: {party.state}{party.stateCode ? ` (${party.stateCode})` : ""}</Text> : null}
      {party.email ? <Text style={s.small}>{party.email}</Text> : null}
    </View>
  );
}

function SaasInvoiceDocument({ invoice }: { invoice: SaasInvoice }) {
  const cur = invoice.currency;
  const half = gstPercentLabel(invoice.taxRate / 2);
  const seller = invoice.seller;
  const registrations = [seller.gstin ? `GSTIN: ${seller.gstin}` : "", seller.pan ? `PAN: ${seller.pan}` : ""];
  return (
    <Document title={`Tax Invoice ${invoice.number}`}>
      <Page size="A4" style={s.page}>
        <PdfLetterhead
          title="TAX INVOICE"
          subtitle="Invoice-cum-receipt · Original for recipient"
          reference={`${invoice.number}\n${fmtDate(invoice.issuedAt)}`}
          registrations={registrations}
        />

        <View style={s.stamp}>
          <Text style={s.stampText}>PAID</Text>
          <Text style={s.stampSub}>{fmtDate(invoice.paidAt)}</Text>
        </View>

        <View style={s.cols}>
          <Party title="Billed to" party={invoice.buyer} />
          <View style={{ width: "48%" }}>
            <Text style={s.label}>Place of supply</Text>
            <Text style={s.value}>{invoice.placeOfSupply ? `${invoice.placeOfSupply.name} (${invoice.placeOfSupply.code})` : "—"}</Text>
            <Text style={[s.label, { marginTop: 6 }]}>Subscription</Text>
            <Text style={s.line}>
              {invoice.planName} · {invoice.interval === "yearly" ? "Yearly" : "Monthly"}
            </Text>
            <Text style={s.line}>
              {fmtDate(invoice.periodStart)} to {fmtDate(invoice.periodEnd)}
            </Text>
            <Text style={[s.label, { marginTop: 6 }]}>Payment</Text>
            <Text style={s.line}>Received {fmtDate(invoice.paidAt)}</Text>
            <Text style={s.small}>Ref: {invoice.paymentRef}</Text>
          </View>
        </View>

        <View style={s.tHead}>
          <Text style={{ width: 20 }}>#</Text>
          <Text style={{ flex: 1 }}>Description</Text>
          <Text style={{ width: 50, textAlign: "right" }}>SAC</Text>
          <Text style={{ width: 30, textAlign: "right" }}>Qty</Text>
          <Text style={{ width: 90, textAlign: "right" }}>Taxable value</Text>
        </View>
        {invoice.items.map((it, i) => (
          <View key={i} style={s.tRow}>
            <Text style={{ width: 20 }}>{i + 1}</Text>
            <Text style={{ flex: 1 }}>{it.description}</Text>
            <Text style={{ width: 50, textAlign: "right" }}>{it.sac}</Text>
            <Text style={{ width: 30, textAlign: "right" }}>{it.quantity}</Text>
            <Text style={{ width: 90, textAlign: "right" }}>{money(it.taxable, cur)}</Text>
          </View>
        ))}

        <View style={pdfSheet.totalsBox}>
          <View style={pdfSheet.totalsRow}><Text style={s.small}>Taxable value</Text><Text>{money(invoice.taxable, cur)}</Text></View>
          {invoice.supplyType === "intra" ? (
            <>
              <View style={pdfSheet.totalsRow}><Text style={s.small}>CGST @ {half}</Text><Text>{money(invoice.cgst, cur)}</Text></View>
              <View style={pdfSheet.totalsRow}><Text style={s.small}>SGST @ {half}</Text><Text>{money(invoice.sgst, cur)}</Text></View>
            </>
          ) : (
            <View style={pdfSheet.totalsRow}><Text style={s.small}>IGST @ {gstPercentLabel(invoice.taxRate)}</Text><Text>{money(invoice.igst, cur)}</Text></View>
          )}
          <View style={pdfSheet.grandRow}><Text>Total</Text><Text>{money(invoice.total, cur)}</Text></View>
          <View style={pdfSheet.totalsRow}><Text style={s.small}>Amount paid</Text><Text>{money(invoice.total, cur)}</Text></View>
          <View style={pdfSheet.totalsRow}><Text style={s.small}>Balance due</Text><Text>{money(0, cur)}</Text></View>
        </View>

        {cur === "INR" ? <Text style={s.words}>Amount in words: {rupeesInWords(invoice.total / 100)}</Text> : null}

        <Text style={s.note}>
          This tax invoice also serves as the receipt for the payment above, received in full. Supply of services under SAC {invoice.items[0]?.sac}
          {invoice.supplyType === "intra" ? " (intra-state: CGST + SGST)" : " (inter-state: IGST)"}. Tax is not payable on reverse charge basis.
        </Text>

        <PdfFooter note="Computer-generated tax invoice-cum-receipt — no signature required." />
      </Page>
    </Document>
  );
}

/** Renders on the platform owner's letterhead, regardless of the requesting host. */
export async function renderSaasInvoicePdf(invoice: SaasInvoice): Promise<Buffer> {
  const ownerId = await getPlatformOwnerCompanyId();
  if (!ownerId) throw new Error("No platform owner company");
  return runAsCompany(ownerId, () => renderPdf(<SaasInvoiceDocument invoice={invoice} />));
}
