import "server-only";
import { Document, Page, View, Text, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { Report } from "@/lib/prms/reports";
import { PDF_COLORS } from "@/lib/pdf/brand";
import { PdfLetterhead, PdfFooter, pdfSheet } from "@/lib/pdf/layout";

const C = PDF_COLORS;

function cell(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "number") return (Math.round(v * 100) / 100).toLocaleString("en-IN");
  return String(v);
}

const s = StyleSheet.create({
  page: pdfSheet.pageLandscape,
  tHead: { ...pdfSheet.tHead, paddingVertical: 3, paddingHorizontal: 3, marginTop: 4 },
  tRow: { ...pdfSheet.tRow, paddingVertical: 3, paddingHorizontal: 3, borderBottomWidth: 0.4 },
});

function ReportDocument({ report }: { report: Report }) {
  const widths = report.columns.map((c) => c.width ?? 14);
  const totalW = widths.reduce((a, b) => a + b, 0);
  const flex = widths.map((w) => w / totalW);
  const subtitle = report.meta.map(([k, v]) => `${k}: ${cell(v)}`).join("    ·    ");

  return (
    <Document title={report.title}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <PdfLetterhead title={report.title} subtitle={subtitle} landscape />

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
        {report.rows.length === 0 && <Text style={{ marginTop: 12, color: C.mute }}>No data.</Text>}

        <PdfFooter note={`${report.title} — YashOrbit PRMS`} />
      </Page>
    </Document>
  );
}

export async function renderReportPdf(report: Report): Promise<Buffer> {
  return renderToBuffer(<ReportDocument report={report} />);
}
