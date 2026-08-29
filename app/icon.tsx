import { ImageResponse } from "next/og";

/**
 * Favicon, generated rather than committed as a binary.
 *
 * At 32px the identity drops the middle threshold and thickens the two survivors — see
 * the "in use" plate. Drawing all three here produces mush once antialiasing lands.
 * The base stays open and the centre stays empty at every size.
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
          background: "#23282D",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 200 200">
          <g fill="none" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={10}>
            <path
              d="M139 167.56 L178 100 L139 32.44 L61 32.44 L22 100 L61 167.56"
              stroke="#F4F6F8"
              strokeWidth={16}
            />
            <path
              d="M115 125.98 L130 100 L115 74.02 L85 74.02 L70 100 L85 125.98"
              stroke="#F5B935"
              strokeWidth={18}
            />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
