import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { PayslipPdfData, PayLine } from "@/lib/hrms/payslip-pdf";

/**
 * Server-only. Renders a professional A4 payslip PDF with @react-pdf/renderer.
 * Never import this from a client component — it is bundled server-side only.
 */

const NAVY = "#1D428A";
const CORAL = "#E56043";
const INK = "#1f2937";
const MUTE = "#6b7280";
const LINE = "#e2e8f0";
const SOFT = "#f4f6fb";

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

const inr = (n: number) => `Rs. ${Math.round(n || 0).toLocaleString("en-IN")}`;
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtDay(day: string | null): string {
  return fmtDate(day ? `${day}T00:00:00Z` : null);
}

const s = StyleSheet.create({
  page: { paddingTop: 30, paddingHorizontal: 34, paddingBottom: 40, fontFamily: "Helvetica", fontSize: 8.5, color: INK, lineHeight: 1.35 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerLeft: { flexDirection: "row", gap: 10, maxWidth: 370 },
  logo: { width: 34, height: 34 },
  coName: { fontSize: 13, fontFamily: "Helvetica-Bold", color: NAVY },
  coSub: { fontSize: 7.5, color: MUTE, marginTop: 1 },
  coReg: { fontSize: 7, color: INK, marginTop: 2 },
  headerRight: { alignItems: "flex-end" },
  docTitle: { fontSize: 15, fontFamily: "Helvetica-Bold", color: INK, letterSpacing: 2 },
  docMonth: { fontSize: 9, color: NAVY, fontFamily: "Helvetica-Bold", marginTop: 2 },
  confidential: { fontSize: 7, color: MUTE, marginTop: 2, textTransform: "uppercase", letterSpacing: 1 },

  bar: { height: 3, backgroundColor: NAVY, marginTop: 8 },
  barAccent: { height: 3, backgroundColor: CORAL, width: 90, marginBottom: 10 },

  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: NAVY, textTransform: "uppercase", letterSpacing: 1, marginTop: 12, marginBottom: 5 },

  grid: { flexDirection: "row", flexWrap: "wrap", borderWidth: 0.7, borderColor: LINE, borderRadius: 3 },
  cell: { width: "33.333%", paddingVertical: 4, paddingHorizontal: 7, borderBottomWidth: 0.7, borderRightWidth: 0.7, borderColor: LINE },
  cellLabel: { fontSize: 6.8, color: MUTE, textTransform: "uppercase", letterSpacing: 0.5 },
  cellValue: { fontSize: 8.5, color: INK, marginTop: 1 },

  strip: { flexDirection: "row", backgroundColor: SOFT, borderRadius: 3, paddingVertical: 6, marginTop: 4 },
  stripCell: { flex: 1, alignItems: "center" },
  stripLabel: { fontSize: 6.8, color: MUTE, textTransform: "uppercase", letterSpacing: 0.5 },
  stripValue: { fontSize: 9.5, color: INK, fontFamily: "Helvetica-Bold", marginTop: 1 },

  tablesRow: { flexDirection: "row", gap: 12, marginTop: 12 },
  tableCol: { flex: 1, borderWidth: 0.7, borderColor: LINE, borderRadius: 3 },
  thead: { flexDirection: "row", backgroundColor: NAVY, paddingVertical: 4, paddingHorizontal: 7 },
  th: { fontSize: 7, color: "#ffffff", fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  tr: { flexDirection: "row", paddingVertical: 3.5, paddingHorizontal: 7, borderBottomWidth: 0.6, borderColor: LINE },
  tdName: { flex: 1, fontSize: 8 },
  tdNum: { width: 62, fontSize: 8, textAlign: "right" },
  totalRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 7, backgroundColor: SOFT },
  totalName: { flex: 1, fontSize: 8, fontFamily: "Helvetica-Bold" },
  totalNum: { width: 62, fontSize: 8, textAlign: "right", fontFamily: "Helvetica-Bold" },

  netBox: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: NAVY, borderRadius: 4, paddingVertical: 10, paddingHorizontal: 14, marginTop: 12 },
  netLabel: { fontSize: 8, color: "#c9d6f0", fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 1.5 },
  netWords: { fontSize: 7.5, color: "#eef2fb", marginTop: 2, maxWidth: 360 },
  netAmount: { fontSize: 16, color: "#ffffff", fontFamily: "Helvetica-Bold" },

  smallNote: { fontSize: 7, color: MUTE, marginTop: 8 },

  authRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 22, borderTopWidth: 0.7, borderColor: LINE, paddingTop: 10 },
  sigBlock: { width: 190 },
  sigLine: { borderBottomWidth: 0.8, borderColor: INK, height: 24 },
  sigName: { fontSize: 8, fontFamily: "Helvetica-Bold", marginTop: 3 },
  sigRole: { fontSize: 7, color: MUTE },
  authNote: { flex: 1, alignItems: "flex-end", marginLeft: 24 },
  footNote: { fontSize: 6.8, color: MUTE, textAlign: "right", marginTop: 1 },
  pageMeta: { position: "absolute", bottom: 16, left: 34, right: 34, fontSize: 6.5, color: MUTE, textAlign: "center" },

  watermark: { position: "absolute", top: 320, left: 70, fontSize: 82, color: "#ed6a4d", opacity: 0.12, fontFamily: "Helvetica-Bold", transform: "rotate(-32deg)", letterSpacing: 6 },
});

function Cell({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={s.cell}>
      <Text style={s.cellLabel}>{label}</Text>
      <Text style={s.cellValue}>{value === "" || value === null || value === undefined ? "—" : String(value)}</Text>
    </View>
  );
}

function LineRows({ rows }: { rows: PayLine[] }) {
  return (
    <>
      {rows.length === 0 && (
        <View style={s.tr}>
          <Text style={s.tdName}>—</Text>
          <Text style={s.tdNum}>—</Text>
          <Text style={s.tdNum}>—</Text>
        </View>
      )}
      {rows.map((r, i) => (
        <View style={s.tr} key={i}>
          <Text style={s.tdName}>{r.name}</Text>
          <Text style={s.tdNum}>{inr(r.amount)}</Text>
          <Text style={s.tdNum}>{inr(r.ytd)}</Text>
        </View>
      ))}
    </>
  );
}

function PayslipDocument({ data }: { data: PayslipPdfData }) {
  const c = data.company;
  const e = data.employee;
  const logo = logoUri();

  return (
    <Document title={`Payslip ${e.code} ${data.month}`} author={c.name}>
      <Page size="A4" style={s.page}>
        {data.isProvisional && <Text style={s.watermark} fixed>PROVISIONAL</Text>}

        <View style={s.header}>
          <View style={s.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not an HTML img */}
            {logo && <Image src={logo} style={s.logo} />}
            <View>
              <Text style={s.coName}>{c.name}</Text>
              {c.legalName && c.legalName !== c.name && <Text style={s.coSub}>{c.legalName}</Text>}
              {c.address && <Text style={s.coSub}>{c.address}</Text>}
              <Text style={s.coSub}>{[c.email, c.phone, c.website].filter(Boolean).join("   |   ")}</Text>
              {c.registrations.length > 0 && (
                <Text style={s.coReg}>{c.registrations.map((r) => `${r.label}: ${r.value}`).join("      ")}</Text>
              )}
            </View>
          </View>
          <View style={s.headerRight}>
            <Text style={s.docTitle}>PAYSLIP</Text>
            <Text style={s.docMonth}>{data.monthLabel}</Text>
            <Text style={s.confidential}>{data.isProvisional ? `Provisional · run ${data.runStatus}` : "Confidential"}</Text>
          </View>
        </View>
        <View style={s.bar} />
        <View style={s.barAccent} />

        <Text style={s.sectionTitle}>Employee</Text>
        <View style={s.grid}>
          <Cell label="Name" value={e.name} />
          <Cell label="Employee code" value={e.code} />
          <Cell label="Designation" value={e.designation} />
          <Cell label="Department" value={e.department} />
          <Cell label="Team" value={e.team} />
          <Cell label="Location" value={e.location} />
          <Cell label="Employment type" value={e.employmentType} />
          <Cell label="Date of joining" value={fmtDay(e.joiningDate)} />
          <Cell label="Date of birth" value={fmtDay(e.dateOfBirth)} />
          <Cell label="PAN" value={e.pan} />
          <Cell label="UAN" value={e.uan} />
          <Cell label="PF / ESI No." value={[e.pfNumber, e.esiNumber].filter(Boolean).join(" / ")} />
        </View>

        <View style={s.strip}>
          <View style={s.stripCell}><Text style={s.stripLabel}>Pay period</Text><Text style={s.stripValue}>{data.monthLabel}</Text></View>
          <View style={s.stripCell}><Text style={s.stripLabel}>Pay date</Text><Text style={s.stripValue}>{fmtDate(data.period.payDate)}</Text></View>
          <View style={s.stripCell}><Text style={s.stripLabel}>Working days</Text><Text style={s.stripValue}>{data.period.workingDays}</Text></View>
          <View style={s.stripCell}><Text style={s.stripLabel}>LOP days</Text><Text style={s.stripValue}>{data.period.lopDays}</Text></View>
          <View style={s.stripCell}><Text style={s.stripLabel}>Days paid</Text><Text style={s.stripValue}>{data.period.daysPaid}</Text></View>
        </View>

        <View style={s.tablesRow}>
          <View style={s.tableCol}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 1 }]}>Earnings</Text>
              <Text style={[s.th, { width: 62, textAlign: "right" }]}>Month</Text>
              <Text style={[s.th, { width: 62, textAlign: "right" }]}>YTD</Text>
            </View>
            <LineRows rows={data.earnings} />
            <View style={s.totalRow}>
              <Text style={s.totalName}>Gross Earnings</Text>
              <Text style={s.totalNum}>{inr(data.grossPay)}</Text>
              <Text style={s.totalNum}>{inr(data.ytd.gross)}</Text>
            </View>
          </View>
          <View style={s.tableCol}>
            <View style={s.thead}>
              <Text style={[s.th, { flex: 1 }]}>Deductions</Text>
              <Text style={[s.th, { width: 62, textAlign: "right" }]}>Month</Text>
              <Text style={[s.th, { width: 62, textAlign: "right" }]}>YTD</Text>
            </View>
            <LineRows rows={data.deductions} />
            <View style={s.totalRow}>
              <Text style={s.totalName}>Total Deductions</Text>
              <Text style={s.totalNum}>{inr(data.totalDeductions)}</Text>
              <Text style={s.totalNum}>{inr(data.ytd.deductions)}</Text>
            </View>
          </View>
        </View>

        <View style={s.netBox}>
          <View>
            <Text style={s.netLabel}>Net Pay</Text>
            <Text style={s.netWords}>{data.netInWords}</Text>
          </View>
          <Text style={s.netAmount}>{inr(data.netPay)}</Text>
        </View>

        <Text style={s.smallNote}>
          Employer contributions (not deducted from pay):{" "}
          {data.employerContributions.map((x) => `${x.name} ${inr(x.amount)}`).join("   ·   ")}   ·   Total cost to company {inr(data.employerCost)}
        </Text>

        <Text style={s.sectionTitle}>Payment details</Text>
        <View style={s.grid}>
          <Cell label="Payment mode" value={data.payment?.mode ?? "—"} />
          <Cell label="Status" value={data.payment ? data.payment.status : "—"} />
          <Cell label="Bank" value={data.payment?.bankName ?? "—"} />
          <Cell label="Account" value={data.payment?.accountMasked ?? "—"} />
          <Cell label="IFSC" value={data.payment?.ifsc ?? "—"} />
          <Cell label="UTR / Reference" value={data.payment?.utr ?? "—"} />
          <Cell label="Paid on" value={fmtDate(data.payment?.paidOn ?? null)} />
        </View>

        <View style={s.authRow}>
          <View style={s.sigBlock}>
            <View style={s.sigLine} />
            <Text style={s.sigName}>{c.signatoryName || " "}</Text>
            <Text style={s.sigRole}>{[c.signatoryDesignation, c.name].filter(Boolean).join(", ")}</Text>
          </View>
          <View style={s.authNote}>
            <Text style={s.footNote}>This is a computer-generated payslip and does not require a signature.</Text>
            {c.note ? <Text style={s.footNote}>{c.note}</Text> : null}
          </View>
        </View>

        <Text
          style={s.pageMeta}
          fixed
          render={({ pageNumber, totalPages }) =>
            `${c.name}   |   Payslip ${data.employee.code} ${data.monthLabel}   |   Generated ${fmtDate(data.generatedAt)}   |   Page ${pageNumber} of ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}

export function renderPayslipPdf(data: PayslipPdfData): Promise<Buffer> {
  return renderToBuffer(<PayslipDocument data={data} />);
}
