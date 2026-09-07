import "server-only";
import fs from "node:fs";
import path from "node:path";
import { Document, Page, View, Text, Image, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { qrToSvg } from "@/lib/tms/qrcode";

/** Server-only. A4 landscape training certificate. Never import from a client component. */

const NAVY = "#1D428A";
const CORAL = "#E56043";
const INK = "#1f2937";
const MUTE = "#6b7280";
const GOLD = "#b8860b";

export interface CertificatePdfData {
  certificateNumber: string;
  verificationCode: string;
  verifyUrl: string;
  typeLabel: string;
  studentName: string;
  programName: string;
  batchName: string | null;
  title: string | null;
  issuedOn: string;
  grade: string | null;
  institute: {
    name: string;
    addressLine: string | null;
    city: string | null;
    signatoryName: string | null;
    signatoryTitle: string | null;
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

function qrDataUri(text: string): string | null {
  try {
    const svg = qrToSvg(text, 120);
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  } catch {
    return null;
  }
}

function fmtDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

const s = StyleSheet.create({
  page: { padding: 0, fontFamily: "Helvetica", color: INK },
  frame: { margin: 18, borderWidth: 2, borderColor: NAVY, borderStyle: "solid", flex: 1, padding: 28, position: "relative" },
  inner: { borderWidth: 0.75, borderColor: CORAL, borderStyle: "solid", flex: 1, padding: 30, alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  logo: { width: 30, height: 30 },
  brand: { fontSize: 15, fontFamily: "Helvetica-Bold", color: NAVY },
  kicker: { fontSize: 10, letterSpacing: 3, color: MUTE, marginTop: 14, textTransform: "uppercase" },
  h1: { fontSize: 30, fontFamily: "Helvetica-Bold", color: NAVY, marginTop: 6, textAlign: "center" },
  presented: { fontSize: 10, color: MUTE, marginTop: 18 },
  name: { fontSize: 24, fontFamily: "Helvetica-Bold", color: INK, marginTop: 8, borderBottomWidth: 1, borderBottomColor: GOLD, borderBottomStyle: "solid", paddingBottom: 4, paddingHorizontal: 24 },
  body: { fontSize: 11, color: INK, marginTop: 16, textAlign: "center", maxWidth: 460, lineHeight: 1.5 },
  strong: { fontFamily: "Helvetica-Bold" },
  footRow: { position: "absolute", left: 30, right: 30, bottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  sigBlock: { alignItems: "center", width: 160 },
  sigLine: { borderTopWidth: 0.75, borderTopColor: INK, borderTopStyle: "solid", width: 140, marginBottom: 3 },
  sigName: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  sigTitle: { fontSize: 8, color: MUTE },
  qrBlock: { alignItems: "center", width: 120 },
  qr: { width: 76, height: 76 },
  meta: { fontSize: 7.5, color: MUTE, textAlign: "center", marginTop: 2 },
});

function CertDocument({ data }: { data: CertificatePdfData }) {
  const logo = logoUri();
  const qr = qrDataUri(data.verifyUrl);
  const outcome = data.title
    ? `for successfully completing ${data.title}`
    : `for the successful completion of the ${data.programName} program`;

  return (
    <Document title={`${data.certificateNumber} — ${data.typeLabel}`}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.frame}>
          <View style={s.inner}>
            <View style={s.header}>
              {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not an HTML img */}
              {logo ? <Image src={logo} style={s.logo} /> : null}
              <Text style={s.brand}>{data.institute.name}</Text>
            </View>
            {data.institute.city ? (
              <Text style={{ fontSize: 8, color: MUTE }}>
                {[data.institute.addressLine, data.institute.city].filter(Boolean).join(", ")}
              </Text>
            ) : null}

            <Text style={s.kicker}>{data.typeLabel}</Text>
            <Text style={s.h1}>Certificate of Achievement</Text>

            <Text style={s.presented}>This is proudly presented to</Text>
            <Text style={s.name}>{data.studentName}</Text>

            <Text style={s.body}>
              <Text>{outcome}</Text>
              {data.batchName ? <Text> ({data.batchName})</Text> : null}
              <Text>, </Text>
              {data.grade ? (
                <Text>
                  with a grade of <Text style={s.strong}>{data.grade}</Text>,{" "}
                </Text>
              ) : null}
              <Text>demonstrating the required skills and professional conduct throughout the training.</Text>
            </Text>

            <View style={s.footRow}>
              <View style={s.sigBlock}>
                <View style={s.sigLine} />
                <Text style={s.sigName}>{data.institute.signatoryName ?? "Authorised Signatory"}</Text>
                <Text style={s.sigTitle}>{data.institute.signatoryTitle ?? "Training Head"}</Text>
              </View>

              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: 8, color: MUTE }}>Issued on</Text>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold" }}>{fmtDate(data.issuedOn)}</Text>
                <Text style={{ fontSize: 7.5, color: MUTE, marginTop: 4 }}>No. {data.certificateNumber}</Text>
              </View>

              <View style={s.qrBlock}>
                {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer Image, not an HTML img */}
                {qr ? <Image src={qr} style={s.qr} /> : null}
                <Text style={s.meta}>Verify at</Text>
                <Text style={s.meta}>{data.verifyUrl.replace(/^https?:\/\//, "")}</Text>
                <Text style={s.meta}>Code: {data.verificationCode}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export function renderCertificatePdf(data: CertificatePdfData): Promise<Buffer> {
  return renderToBuffer(<CertDocument data={data} />) as Promise<Buffer>;
}
