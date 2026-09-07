import "server-only";
import { Document, Page, View, Text, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { ReportData } from "@/lib/tms/reports";

/** Server-only. Generic landscape tabular report PDF. */

const NAVY = "#1D428A";
const INK = "#1f2937";
const MUTE = "#6b7280";
const LINE = "#e2e8f0";

const s = StyleSheet.create({
  page: { padding: 28, fontSize: 7.5, fontFamily: "Helvetica", color: INK },
  h1: { fontSize: 15, fontFamily: "Helvetica-Bold", color: NAVY },
  meta: { color: MUTE, marginBottom: 10, marginTop: 2, fontSize: 8 },
  tHead: { flexDirection: "row", backgroundColor: NAVY, color: "#fff", paddingVertical: 4, paddingHorizontal: 3, fontFamily: "Helvetica-Bold" },
  tRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: LINE, borderBottomStyle: "solid", paddingVertical: 3, paddingHorizontal: 3 },
  cell: { paddingRight: 3 },
  foot: { position: "absolute", bottom: 16, left: 28, right: 28, textAlign: "center", color: MUTE, fontSize: 7 },
});

function ReportDocument({ report }: { report: ReportData }) {
  const widths = report.columns.map((c) => c.width ?? 14);
  const totalW = widths.reduce((a, b) => a + b, 0);

  return (
    <Document title={report.title}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <Text style={s.h1}>{report.title}</Text>
        <Text style={s.meta}>{report.meta.map(([k, v]) => `${k}: ${v}`).join("   ·   ")}</Text>

        <View style={s.tHead}>
          {report.columns.map((c, i) => (
            <Text key={c.key} style={[s.cell, { width: `${(widths[i] / totalW) * 100}%` }]}>
              {c.header}
            </Text>
          ))}
        </View>
        {report.rows.map((row, ri) => (
          <View key={ri} style={s.tRow} wrap={false}>
            {report.columns.map((c, i) => (
              <Text key={c.key} style={[s.cell, { width: `${(widths[i] / totalW) * 100}%` }]}>
                {String(row[c.key] ?? "")}
              </Text>
            ))}
          </View>
        ))}

        <Text
          style={s.foot}
          render={({ pageNumber, totalPages }) => `YashOrbit Training — page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

export function renderReportPdf(report: ReportData): Promise<Buffer> {
  return renderToBuffer(<ReportDocument report={report} />) as Promise<Buffer>;
}
