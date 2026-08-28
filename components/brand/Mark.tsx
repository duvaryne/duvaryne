import { cn } from "@/lib/utils";

/**
 * The Duvaryne mark — three hexagonal thresholds, open at the base.
 *
 * Geometry is transcribed from the identity system and must not be redrawn. The rules
 * that make it correct, and that a well-meaning edit tends to break:
 *
 *   - The base is OPEN on every ring. A gateway that closes is not a gateway; the
 *     bottom edge is deliberately absent, which is why each path stops rather than
 *     returning to its start point.
 *   - The centre is EMPTY. Nothing is drawn there. The space is the point.
 *   - Joins are mitred and caps are butt, with no radius anywhere. "Engineered, not
 *     softened" — a stroke-linejoin of "round" quietly undoes the whole identity.
 *   - Saffron appears on the innermost threshold only. It is the single accent.
 *
 * Ring count reduces with size, per the identity's "in use" plate: below 48px the middle
 * threshold closes up visually, and below 24px only the outer ring survives legibly.
 */

const OUTER = "M139 167.56 L178 100 L139 32.44 L61 32.44 L22 100 L61 167.56";
const MIDDLE = "M127 146.77 L154 100 L127 53.23 L73 53.23 L46 100 L73 146.77";
const INNER = "M115 125.98 L130 100 L115 74.02 L85 74.02 L70 100 L85 125.98";

export type MarkTone = "light" | "dark" | "mono";

/** Stroke colours per tone. `mono` is the single-colour lockup for stamp, etch and fax. */
const TONES: Record<MarkTone, { outer: string; middle: string; inner: string }> = {
  light: { outer: "#6E7880", middle: "#9AA3AC", inner: "#C8922E" },
  dark: { outer: "#F4F6F8", middle: "#9AA3AC", inner: "#E0AE4E" },
  mono: { outer: "currentColor", middle: "currentColor", inner: "currentColor" },
};

export function Mark({
  size = 40,
  tone = "light",
  className,
  title,
}: {
  size?: number;
  tone?: MarkTone;
  className?: string;
  /** Omit for decorative use next to the wordmark; the text already names the brand. */
  title?: string;
}) {
  const c = TONES[tone];

  // Stroke weights are not simply scaled: at small sizes the rings are thickened so the
  // form still reads once antialiasing takes over. These values are from the identity.
  const rings =
    size >= 48
      ? [
          { d: OUTER, stroke: c.outer, width: 9 },
          { d: MIDDLE, stroke: c.middle, width: 7.5 },
          { d: INNER, stroke: c.inner, width: 6.5 },
        ]
      : size >= 32
        ? [
            { d: OUTER, stroke: c.outer, width: 11 },
            { d: INNER, stroke: c.inner, width: 11 },
          ]
        : size >= 20
          ? [
              { d: OUTER, stroke: c.outer, width: 16 },
              { d: INNER, stroke: c.inner, width: 18 },
            ]
          : [{ d: OUTER, stroke: tone === "mono" ? "currentColor" : "#40474E", width: 22 }];

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <g fill="none" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit={10}>
        {rings.map((r) => (
          <path key={r.d} d={r.d} stroke={r.stroke} strokeWidth={r.width} />
        ))}
      </g>
    </svg>
  );
}
