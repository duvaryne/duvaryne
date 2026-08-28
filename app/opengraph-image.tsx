import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

/**
 * Site default OG image — SPEC §10.4.
 *
 * Fixes defect 4: og:image was the logo at 457x107, below the 1200x630 minimum, so every
 * LinkedIn and X share rendered broken.
 *
 * No webfont is loaded here on purpose. next/og needs font binaries at request time, and
 * fetching them from Google at build/render time makes image generation depend on an
 * external host. To brand the type, drop .ttf files into public/brand/fonts/ and pass them
 * via the `fonts` option below.
 */

export const runtime = "nodejs";
export const alt = `${site.name} — AWS and DevOps consulting in Bengaluru`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A1728",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 10, height: 34, background: "#F97316" }} />
          {/* Satori requires explicit display on any element with more than one child. */}
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#FFFFFF" }}>
            <span>Duvaryne</span>
            <span style={{ color: "#2B7CE9" }}>Edge</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              maxWidth: 940,
            }}
          >
            AWS Cloud &amp; DevOps Consulting in Bengaluru
          </div>
          <div style={{ fontSize: 27, color: "rgba(255,255,255,0.66)", marginTop: 22 }}>
            Senior engineers only. Written scope, fixed price, code you own.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 26,
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
            borderTop: "1px solid #1E3A5F",
            paddingTop: 26,
          }}
        >
          <span>DPIIT-recognised</span>
          <span>·</span>
          <span>CKA</span>
          <span>·</span>
          <span>AWS Solutions Architect</span>
          <span>·</span>
          <span>13 years</span>
        </div>
      </div>
    ),
    size,
  );
}
