import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { PurchaseOrder } from "@/lib/prms/purchase-orders";
import type { CompanyIdentity } from "@/lib/prms/settings";

const NAVY = "#1D428A";
const INK = "#1f2937";
const MUTE = "#6b7280";
const LINE = "#e2e8f0";

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

function money(n: number, currency: string): string {
  return `${currency} ${(Math.round((n || 0) * 100) / 100).toLocaleString("en-IN")}`;
}
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: "Helvetica", color: INK },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 26, height: 26 },
  brand: { fontSize: 13, fontFamily: "Helvetica-Bold", color: NAVY },
  small: { fontSize: 8, color: MUTE },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: NAVY, textAlign: "right" },
  meta: { fontSize: 8, color: MUTE, textAlign: "right", marginTop: 2 },
  cols: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  label: { fontSize: 7, color: MUTE, textTransform: "uppercase", letterSpacing: 1 },
  value: { fontSize: 9, fontFamily: "Helvetica-Bold", marginTop: 2 },
  tHead: { flexDirection: "row", backgroundColor: NAVY, color: "#fff", paddingVertical: 4, paddingHorizontal: 5, marginTop: 16, fontFamily: "Helvetica-Bold" },
  tRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: LINE, paddingVertical: 4, paddingHorizontal: 5 },
  totals: { marginTop: 12, alignSelf: "flex-end", width: 220 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  grand: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: INK, marginTop: 3, paddingTop: 3, fontFamily: "Helvetica-Bold" },
  foot: { position: "absolute", bottom: 28, left: 40, right: 40, textAlign: "center", color: MUTE, fontSize: 7 },
});

function PoDocument({ po, company }: { po: PurchaseOrder; company: CompanyIdentity }) {
  const logo = logoUri();
  return (
    <Document title={`Purchase Order ${po.poNumber}`}>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View>
            <View style={s.logoRow}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {logo ? <Image src={logo} style={s.logo} /> : null}
              <Text style={s.brand}>{company.name}</Text>
            </View>
            <Text style={[s.small, { marginTop: 4 }]}>{[company.addressLine, company.city].filter(Boolean).join(", ")}</Text>
            <Text style={s.small}>{[company.gstin ? `GSTIN: ${company.gstin}` : null, company.pan ? `PAN: ${company.pan}` : null].filter(Boolean).join("  ")}</Text>
            <Text style={s.small}>{[company.email, company.phone].filter(Boolean).join(" · ")}</Text>
          </View>
          <View>
            <Text style={s.title}>PURCHASE ORDER</Text>
            <Text style={s.meta}>{po.poNumber}</Text>
            <Text style={s.meta}>{fmtDate(po.issuedAt ? po.issuedAt.toISOString().slice(0, 10) : po.createdAt.toISOString().slice(0, 10))}</Text>
          </View>
        </View>

        <View style={s.cols}>
          <View style={{ width: "48%" }}>
            <Text style={s.label}>Vendor</Text>
            <Text style={s.value}>{po.vendorName}</Text>
          </View>
          <View style={{ width: "48%" }}>
            <Text style={s.label}>Deliver to</Text>
            <Text style={s.value}>{po.deliveryAddress || company.addressLine || "—"}</Text>
            <Text style={s.small}>Expected: {fmtDate(po.deliveryDate)}</Text>
            <Text style={s.small}>Terms: {po.paymentTerms || "—"}</Text>
          </View>
        </View>

        <View style={s.tHead}>
          <Text style={{ flex: 1 }}>Description</Text>
          <Text style={{ width: 55, textAlign: "right" }}>Qty</Text>
          <Text style={{ width: 70, textAlign: "right" }}>Unit</Text>
          <Text style={{ width: 40, textAlign: "right" }}>GST</Text>
          <Text style={{ width: 75, textAlign: "right" }}>Amount</Text>
        </View>
        {po.items.map((it, i) => (
          <View key={i} style={s.tRow}>
            <Text style={{ flex: 1 }}>{it.description}</Text>
            <Text style={{ width: 55, textAlign: "right" }}>{it.quantity} {it.uom}</Text>
            <Text style={{ width: 70, textAlign: "right" }}>{money(it.unitPrice, po.currency)}</Text>
            <Text style={{ width: 40, textAlign: "right" }}>{it.gstRate}%</Text>
            <Text style={{ width: 75, textAlign: "right" }}>{money(it.lineTotal, po.currency)}</Text>
          </View>
        ))}

        <View style={s.totals}>
          <View style={s.totalRow}><Text style={s.small}>Subtotal</Text><Text>{money(po.subtotal, po.currency)}</Text></View>
          {po.discount > 0 && <View style={s.totalRow}><Text style={s.small}>Discount</Text><Text>- {money(po.discount, po.currency)}</Text></View>}
          <View style={s.totalRow}><Text style={s.small}>GST</Text><Text>{money(po.gstAmount, po.currency)}</Text></View>
          <View style={s.grand}><Text>Total</Text><Text>{money(po.totalAmount, po.currency)}</Text></View>
        </View>

        {po.notes ? <Text style={[s.small, { marginTop: 16 }]}>Notes: {po.notes}</Text> : null}

        <View style={{ marginTop: 40, flexDirection: "row", justifyContent: "flex-end" }}>
          <View style={{ width: 180, borderTopWidth: 0.5, borderTopColor: INK, paddingTop: 4 }}>
            <Text style={s.small}>{company.signatoryName || "Authorised Signatory"}</Text>
            <Text style={s.small}>{company.signatoryTitle || ""}</Text>
          </View>
        </View>

        <Text style={s.foot}>This is a system-generated purchase order from {company.name}.</Text>
      </Page>
    </Document>
  );
}

export async function renderPurchaseOrderPdf(po: PurchaseOrder, company: CompanyIdentity): Promise<Buffer> {
  return renderToBuffer(<PoDocument po={po} company={company} />);
}
