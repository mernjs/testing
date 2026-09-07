import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

/** Server-only. A4 payment receipt / invoice. Never import from a client component. */

const NAVY = "#1D428A";
const INK = "#1f2937";
const MUTE = "#6b7280";
const LINE = "#e2e8f0";

export interface InvoicePdfData {
  invoiceNumber: string;
  paidOn: string;
  method: string;
  transactionId: string | null;
  amount: number;
  currency: string;
  totalFees: number;
  discount: number;
  paidToDate: number;
  pending: number;
  studentName: string;
  studentCode: string | null;
  programName: string;
  batchName: string | null;
  institute: {
    name: string;
    addressLine: string | null;
    city: string | null;
    email: string | null;
    phone: string | null;
  };
}

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
  return `${currency} ${Math.round(n || 0).toLocaleString("en-IN")}`;
}
function fmtDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: INK },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 28, height: 28 },
  brand: { fontSize: 14, fontFamily: "Helvetica-Bold", color: NAVY },
  small: { fontSize: 8, color: MUTE },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: NAVY, textAlign: "right" },
  invMeta: { fontSize: 9, color: MUTE, textAlign: "right", marginTop: 2 },
  section: { marginTop: 16 },
  label: { fontSize: 8, color: MUTE, textTransform: "uppercase", letterSpacing: 1 },
  value: { fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 2 },
  tHead: { flexDirection: "row", backgroundColor: NAVY, color: "#fff", paddingVertical: 5, paddingHorizontal: 6, marginTop: 18, fontFamily: "Helvetica-Bold" },
  tRow: { flexDirection: "row", borderBottomWidth: 0.75, borderBottomColor: LINE, borderBottomStyle: "solid", paddingVertical: 5, paddingHorizontal: 6 },
  totals: { marginTop: 14, alignSelf: "flex-end", width: 240 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  grand: { flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: INK, borderTopStyle: "solid", marginTop: 4, paddingTop: 4, fontFamily: "Helvetica-Bold" },
  foot: { position: "absolute", bottom: 30, left: 40, right: 40, textAlign: "center", color: MUTE, fontSize: 8 },
});

function InvoiceDocument({ data }: { data: InvoicePdfData }) {
  const logo = logoUri();
  return (
    <Document title={`Invoice ${data.invoiceNumber}`}>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <View>
            <View style={s.logoRow}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not an HTML img */}
              {logo ? <Image src={logo} style={s.logo} /> : null}
              <Text style={s.brand}>{data.institute.name}</Text>
            </View>
            <Text style={[s.small, { marginTop: 4 }]}>
              {[data.institute.addressLine, data.institute.city].filter(Boolean).join(", ")}
            </Text>
            <Text style={s.small}>{[data.institute.email, data.institute.phone].filter(Boolean).join(" · ")}</Text>
          </View>
          <View>
            <Text style={s.title}>RECEIPT</Text>
            <Text style={s.invMeta}>{data.invoiceNumber}</Text>
            <Text style={s.invMeta}>{fmtDate(data.paidOn)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={s.section}>
            <Text style={s.label}>Billed to</Text>
            <Text style={s.value}>{data.studentName}</Text>
            {data.studentCode ? <Text style={s.small}>{data.studentCode}</Text> : null}
          </View>
          <View style={s.section}>
            <Text style={s.label}>Payment method</Text>
            <Text style={s.value}>{data.method}</Text>
            {data.transactionId ? <Text style={s.small}>Txn: {data.transactionId}</Text> : null}
          </View>
        </View>

        <View style={s.tHead}>
          <Text style={{ flex: 1 }}>Description</Text>
          <Text style={{ width: 100, textAlign: "right" }}>Amount</Text>
        </View>
        <View style={s.tRow}>
          <Text style={{ flex: 1 }}>
            {data.programName}
            {data.batchName ? ` — ${data.batchName}` : ""} (fee payment)
          </Text>
          <Text style={{ width: 100, textAlign: "right" }}>{money(data.amount, data.currency)}</Text>
        </View>

        <View style={s.totals}>
          <View style={s.totalRow}>
            <Text style={s.small}>Total course fees</Text>
            <Text style={s.small}>{money(data.totalFees, data.currency)}</Text>
          </View>
          {data.discount > 0 && (
            <View style={s.totalRow}>
              <Text style={s.small}>Discount</Text>
              <Text style={s.small}>- {money(data.discount, data.currency)}</Text>
            </View>
          )}
          <View style={s.totalRow}>
            <Text style={s.small}>Paid to date</Text>
            <Text style={s.small}>{money(data.paidToDate, data.currency)}</Text>
          </View>
          <View style={s.grand}>
            <Text>This receipt</Text>
            <Text>{money(data.amount, data.currency)}</Text>
          </View>
          <View style={[s.totalRow, { marginTop: 4 }]}>
            <Text style={s.small}>Balance pending</Text>
            <Text style={s.small}>{money(data.pending, data.currency)}</Text>
          </View>
        </View>

        <Text style={s.foot}>Computer-generated receipt — no signature required. Thank you.</Text>
      </Page>
    </Document>
  );
}

export function renderInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  return renderToBuffer(<InvoiceDocument data={data} />) as Promise<Buffer>;
}
