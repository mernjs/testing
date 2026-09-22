import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const homeOgImageSize = { width: 1200, height: 630 };

const PRIMARY = "#E56043";
const BACKGROUND = "#1b1a1a";
const FOREGROUND = "#ECF2FD";
const MUTED = "#a8a6a6";

/**
 * Shared renderer for the home page's opengraph-image and twitter-image
 * route files — both need an identical default export, so the JSX lives
 * here once rather than being duplicated across the two special files.
 */
export async function renderHomeOgImage() {
  const logoData = await readFile(join(process.cwd(), "public/brand/icon-tile-512.png"), "base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: `linear-gradient(135deg, ${BACKGROUND} 0%, #26221f 60%, ${BACKGROUND} 100%)`,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -140,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: PRIMARY,
            opacity: 0.22,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -180,
            left: -120,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: PRIMARY,
            opacity: 0.14,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={logoSrc} width={64} height={64} style={{ borderRadius: 16 }} />
          <span style={{ fontSize: 34, fontWeight: 700, color: FOREGROUND, letterSpacing: -0.5 }}>
            YashOrbit
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: PRIMARY,
              border: `1px solid ${PRIMARY}`,
              borderRadius: 999,
              padding: "6px 16px",
              display: "flex",
            }}
          >
            Technologies
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
          <span
            style={{
              fontSize: 66,
              fontWeight: 800,
              color: FOREGROUND,
              lineHeight: 1.08,
              letterSpacing: -1,
            }}
          >
            Custom Software &amp; AI/ML, Built Around Your Business
          </span>
          <span style={{ fontSize: 28, color: MUTED, fontWeight: 400 }}>
            Web, mobile, desktop &amp; AI/ML — senior-led, NDA &amp; IP protected, free live demo.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(236,242,253,0.16)",
            paddingTop: 28,
          }}
        >
          <span style={{ fontSize: 22, color: FOREGROUND, fontWeight: 600 }}>yashorbit.com</span>
          <div style={{ display: "flex", gap: 10 }}>
            {["Senior-Led", "NDA Protected", "Free Live Demo"].map((label) => (
              <span
                key={label}
                style={{
                  fontSize: 18,
                  color: MUTED,
                  border: "1px solid rgba(236,242,253,0.24)",
                  borderRadius: 999,
                  padding: "6px 16px",
                  display: "flex",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...homeOgImageSize }
  );
}
