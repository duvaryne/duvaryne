import { ImageResponse } from "next/og";

/**
 * Favicon, generated rather than committed as a binary.
 *
 * PLACEHOLDER, like components/layout/Logo.tsx — SPEC I1 / §11.3 forbids approximating the
 * Duvaryne mark with drawn shapes, so this is a plain monogram on the brand navy. Replace
 * with the official asset by deleting this file and adding app/favicon.ico.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A1728",
          color: "#FFFFFF",
          fontSize: 20,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        A
      </div>
    ),
    size,
  );
}
