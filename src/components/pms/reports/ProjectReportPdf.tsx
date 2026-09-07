import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { ProjectReport } from "@/lib/pms/reports";

/** Server-only. A4 project report PDF. Never import from a client component. */

const NAVY = "#1D428A";
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

function money(n: number, currency: string): string {
  return `${currency} ${Math.round(n || 0).toLocaleString("en-IN")}`;
}
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 9, color: INK, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  logo: { width: 26, height: 26 },
  brand: { fontSize: 13, fontFamily: "Helvetica-Bold", color: NAVY },
  h1: { fontSize: 16, fontFamily: "Helvetica-Bold", color: INK, marginTop: 12 },
  sub: { color: MUTE, marginBottom: 10 },
  section: { fontSize: 11, fontFamily: "Helvetica-Bold", color: NAVY, marginTop: 16, marginBottom: 6 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  cell: { width: "50%", flexDirection: "row", paddingVertical: 2 },
  key: { width: 120, color: MUTE },
  val: { flex: 1, fontFamily: "Helvetica-Bold" },
  kpiRow: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
  kpi: { width: "25%", padding: 4 },
  kpiBox: { border: `1pt solid ${LINE}`, borderRadius: 4, padding: 8, backgroundColor: SOFT },
  kpiLabel: { color: MUTE, fontSize: 7.5 },
  kpiValue: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 2 },
  tHead: { flexDirection: "row", backgroundColor: NAVY, color: "#fff", paddingVertical: 4, paddingHorizontal: 4, fontFamily: "Helvetica-Bold" },
  tRow: { flexDirection: "row", borderBottom: `1pt solid ${LINE}`, paddingVertical: 3, paddingHorizontal: 4 },
  foot: { position: "absolute", bottom: 24, left: 36, right: 36, textAlign: "center", color: MUTE, fontSize: 7.5 },
});

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={s.cell}>
      <Text style={s.key}>{k}</Text>
      <Text style={s.val}>{v}</Text>
    </View>
  );
}
function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.kpi}>
      <View style={s.kpiBox}>
        <Text style={s.kpiLabel}>{label}</Text>
        <Text style={s.kpiValue}>{value}</Text>
      </View>
    </View>
  );
}

function ReportDocument({ report }: { report: ProjectReport }) {
  const { summary: sm, financials: f } = report;
  const logo = logoUri();
  const m = (n: number) => money(n, sm.currency);

  return (
    <Document title={`${sm.projectCode} — Project Report`}>
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf Image, not next/image */}
            {logo ? <Image src={logo} style={s.logo} /> : null}
            <Text style={[s.brand, { marginLeft: 6 }]}>YashOrbit</Text>
          </View>
          <Text style={{ color: MUTE }}>Generated {fmtDate(report.generatedAt)}</Text>
        </View>
        <Text style={s.h1}>{sm.name}</Text>
        <Text style={s.sub}>
          {sm.projectCode} · {sm.client} · {sm.statusLabel}
          {report.range.dateFrom ? `  ·  ${report.range.dateFrom} to ${report.range.dateTo}` : ""}
        </Text>

        <Text style={s.section}>Project Summary</Text>
        <View style={s.grid}>
          <Row k="Client" v={sm.client} />
          <Row k="Project Manager" v={sm.manager} />
          <Row k="Priority" v={sm.priority} />
          <Row k="Progress" v={`${sm.progressPercent}%`} />
          <Row k="Start Date" v={fmtDate(sm.startDate)} />
          <Row k="End Date" v={fmtDate(sm.endDate)} />
          <Row k="Tasks" v={`${report.doneTasks} / ${report.totalTasks} done`} />
          <Row k="Currency" v={sm.currency} />
        </View>

        <Text style={s.section}>Financials</Text>
        <View style={s.kpiRow}>
          <Kpi label="Contract Value" value={m(f.contractValue)} />
          <Kpi label="Estimated Cost" value={m(f.estimatedCost)} />
          <Kpi label="Actual Cost" value={m(f.actualCost)} />
          <Kpi label="Revenue" value={m(f.revenue)} />
          <Kpi label="Resource Cost" value={m(f.resourceCost)} />
          <Kpi label="Other Costs" value={m(f.otherCosts)} />
          <Kpi label={f.profit > 0 ? "Profit" : "Loss"} value={m(f.profit > 0 ? f.profit : f.loss)} />
          <Kpi label="Profit Margin" value={`${f.profitMargin}%`} />
          <Kpi label="Estimated Hours" value={String(f.estimatedHours)} />
          <Kpi label="Logged Hours" value={String(f.actualHours)} />
          <Kpi label="Billable Hours" value={String(f.billableHours)} />
          <Kpi label="Remaining Budget" value={m(f.remainingBudget)} />
        </View>

        <Text style={s.section}>Task Progress</Text>
        <View style={s.tHead}>
          {report.taskProgress.map((t) => (
            <Text key={t.status} style={{ width: `${100 / report.taskProgress.length}%` }}>{t.label}</Text>
          ))}
        </View>
        <View style={s.tRow}>
          {report.taskProgress.map((t) => (
            <Text key={t.status} style={{ width: `${100 / report.taskProgress.length}%` }}>{t.count}</Text>
          ))}
        </View>

        <Text style={s.section}>Employee Contributions</Text>
        <View style={s.tHead}>
          <Text style={{ width: "28%" }}>Employee</Text>
          <Text style={{ width: "16%" }}>Role</Text>
          <Text style={{ width: "12%" }}>Hours</Text>
          <Text style={{ width: "14%" }}>Billable</Text>
          <Text style={{ width: "15%" }}>Cost</Text>
          <Text style={{ width: "15%" }}>Revenue</Text>
        </View>
        {report.contributions.length === 0 ? (
          <View style={s.tRow}><Text style={{ color: MUTE }}>No logged hours in this range.</Text></View>
        ) : (
          report.contributions.map((c) => (
            <View key={c.employeeId} style={s.tRow}>
              <Text style={{ width: "28%" }}>{c.name}</Text>
              <Text style={{ width: "16%" }}>{c.role}</Text>
              <Text style={{ width: "12%" }}>{c.hours}</Text>
              <Text style={{ width: "14%" }}>{c.billableHours}</Text>
              <Text style={{ width: "15%" }}>{m(c.cost)}</Text>
              <Text style={{ width: "15%" }}>{m(c.revenue)}</Text>
            </View>
          ))
        )}

        <Text style={s.foot} fixed>
          {sm.name} · {sm.projectCode} · YashOrbit PMS — computer-generated report
        </Text>
      </Page>
    </Document>
  );
}

export function renderProjectReportPdf(report: ProjectReport): Promise<Buffer> {
  return renderToBuffer(<ReportDocument report={report} />) as Promise<Buffer>;
}
