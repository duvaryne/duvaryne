import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Shared OG template for content routes — SPEC §10.4.
 *
 * `metric` is the headline number, rendered large so the fact is legible in a LinkedIn
 * card at thumbnail size. That is the whole point: the share itself should carry the
 * outcome, not just the title.
 */
export function renderOgImage({
  eyebrow,
  title,
  metric,
}: {
  eyebrow: string;
  title: string;
  metric?: string;
}) {
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
          padding: "68px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 10, height: 30, background: "#F97316" }} />
            {/* Satori requires explicit display on any element with more than one child. */}
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#FFFFFF" }}>
              <span>Duvaryne</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 19,
              color: "#2B7CE9",
              textTransform: "uppercase",
              letterSpacing: "0.09em",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {metric ? (
            <div
              style={{
                fontSize: 40,
                fontWeight: 600,
                color: "#2B7CE9",
                marginBottom: 20,
                maxWidth: 1000,
              }}
            >
              {metric}
            </div>
          ) : null}
          <div
            style={{
              fontSize: title.length > 68 ? 46 : 56,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.14,
              letterSpacing: "-0.02em",
              maxWidth: 1010,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
            borderTop: "1px solid #1E3A5F",
            paddingTop: 24,
          }}
        >
          duvaryne.com
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
