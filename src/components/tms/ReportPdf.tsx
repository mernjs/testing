import "server-only";
import { Document, Page, View, Text, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import type { ReportData } from "@/lib/tms/reports";
import { PDF_COLORS } from "@/lib/pdf/brand";
import { PdfLetterhead, PdfFooter, pdfSheet } from "@/lib/pdf/layout";

/** Server-only. Generic landscape tabular report PDF. */

const C = PDF_COLORS;

const s = StyleSheet.create({
  page: pdfSheet.pageLandscape,
  tHead: { ...pdfSheet.tHead, paddingVertical: 4, paddingHorizontal: 3, marginTop: 4 },
  tRow: { ...pdfSheet.tRow, paddingVertical: 3, paddingHorizontal: 3 },
  cell: { paddingRight: 3 },
});

function ReportDocument({ report }: { report: ReportData }) {
  const widths = report.columns.map((c) => c.width ?? 14);
  const totalW = widths.reduce((a, b) => a + b, 0);
  const subtitle = report.meta.map(([k, v]) => `${k}: ${v}`).join("    ·    ");

  return (
    <Document title={report.title}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <PdfLetterhead title={report.title} subtitle={subtitle} landscape />

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
        {report.rows.length === 0 && <Text style={{ marginTop: 12, color: C.mute }}>No data.</Text>}

        <PdfFooter note={`${report.title} — YashOrbit Training`} />
      </Page>
    </Document>
  );
}

export function renderReportPdf(report: ReportData): Promise<Buffer> {
  return renderToBuffer(<ReportDocument report={report} />) as Promise<Buffer>;
}
