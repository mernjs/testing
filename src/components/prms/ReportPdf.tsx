import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { Report } from "@/lib/prms/reports";

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

function cell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return (Math.round(v * 100) / 100).toLocaleString("en-IN");
  return String(v);
}

const s = StyleSheet.create({
  page: { padding: 32, fontSize: 8, fontFamily: "Helvetica", color: INK },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  logo: { width: 22, height: 22 },
  brand: { fontSize: 11, fontFamily: "Helvetica-Bold", color: NAVY },
  title: { fontSize: 15, fontFamily: "Helvetica-Bold", color: NAVY },
  meta: { fontSize: 7, color: MUTE, marginBottom: 10 },
  tHead: { flexDirection: "row", backgroundColor: NAVY, color: "#fff", paddingVertical: 3, paddingHorizontal: 3, fontFamily: "Helvetica-Bold" },
  tRow: { flexDirection: "row", borderBottomWidth: 0.4, borderBottomColor: LINE, paddingVertical: 3, paddingHorizontal: 3 },
  foot: { position: "absolute", bottom: 20, left: 32, right: 32, textAlign: "center", color: MUTE, fontSize: 7 },
});

function ReportDocument({ report }: { report: Report }) {
  const logo = logoUri();
  const widths = report.columns.map((c) => c.width ?? 14);
  const totalW = widths.reduce((a, b) => a + b, 0);
  const flex = widths.map((w) => w / totalW);

  return (
    <Document title={report.title}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.head}>
          <View style={s.logoRow}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            {logo ? <Image src={logo} style={s.logo} /> : null}
            <Text style={s.brand}>YashOrbit PRMS</Text>
          </View>
          <Text style={s.title}>{report.title}</Text>
        </View>
        <Text style={s.meta}>{report.meta.map(([k, v]) => `${k}: ${cell(v)}`).join("    ")}</Text>

        <View style={s.tHead}>
          {report.columns.map((c, i) => (
            <Text key={c.key} style={{ flex: flex[i] }}>{c.header}</Text>
          ))}
        </View>
        {report.rows.map((r, ri) => (
          <View key={ri} style={s.tRow} wrap={false}>
            {report.columns.map((c, i) => (
              <Text key={c.key} style={{ flex: flex[i] }}>{cell(r[c.key])}</Text>
            ))}
          </View>
        ))}
        {report.rows.length === 0 && <Text style={{ marginTop: 12, color: MUTE }}>No data.</Text>}

        <Text style={s.foot} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages} · YashOrbit PRMS`} fixed />
      </Page>
    </Document>
  );
}

export async function renderReportPdf(report: Report): Promise<Buffer> {
  return renderToBuffer(<ReportDocument report={report} />);
}
