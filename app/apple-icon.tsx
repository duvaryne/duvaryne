import { ImageResponse } from "next/og";

/**
 * Apple touch icon. At 180px all three thresholds are legible, so the full mark is used
 * at the identity's stroke weights (9 / 7.5 / 6.5).
 *
 * iOS composites this on the home screen without a margin of its own, so the mark is
 * inset rather than bled to the edge.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F6F8",
        }}
      >
        <svg width="132" height="132" viewBox="0 0 200 200">
          <g fill="none" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={10}>
            <path
              d="M139 167.56 L178 100 L139 32.44 L61 32.44 L22 100 L61 167.56"
              stroke="#6E7880"
              strokeWidth={9}
            />
            <path
              d="M127 146.77 L154 100 L127 53.23 L73 53.23 L46 100 L73 146.77"
              stroke="#9AA3AC"
              strokeWidth={7.5}
            />
            <path
              d="M115 125.98 L130 100 L115 74.02 L85 74.02 L70 100 L85 125.98"
              stroke="#C8922E"
              strokeWidth={6.5}
            />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
