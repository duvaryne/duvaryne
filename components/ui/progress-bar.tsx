"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * ProgressBar — the 21st.dev component, re-tokenised per SPEC §9.12.
 *
 * NOTE: the original file was not supplied with this build, so it is reconstructed from
 * the specification's description of it. The accessibility contract §9.12 requires be
 * preserved is implemented in full and must not be refactored away:
 *
 *   - useId label association
 *   - role="progressbar" with aria-valuemin / max / now / valuetext
 *   - an aria-live="polite" status region
 *   - useReducedMotion collapsing transitions to INSTANT
 *
 * Token corrections applied (the shipped component clashes with the brand palette):
 *   bg-[#4568FF]  -> --color-blue-600   (#4568FF is periwinkle, not brand Tech Blue)
 *   stone-*       -> slate / navy tokens (stone is a WARM grey; muddy against navy)
 *   #1D1D1A       -> --color-navy-800   (warm near-black -> navy)
 *   rgba(28,25,23) -> rgba(10,23,40)    (warm stone shadow -> navy shadow)
 *
 * Import is `motion/react` (Motion), NOT `framer-motion`.
 */

const INSTANT = { duration: 0 } as const;
const EASED = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

export function ProgressBar({
  value,
  max = 100,
  label,
  valueText,
  indeterminate = false,
  className,
  barClassName,
  showValue = false,
}: {
  value: number;
  max?: number;
  label: string;
  /** Human-readable value for screen readers, e.g. "₹4,50,000 per month". */
  valueText?: string;
  indeterminate?: boolean;
  className?: string;
  barClassName?: string;
  showValue?: boolean;
}) {
  const id = useId();
  const reduced = useReducedMotion();
  const transition = reduced ? INSTANT : EASED;

  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label
          id={`${id}-label`}
          htmlFor={id}
          className="text-[0.8125rem] font-medium text-slate-600"
        >
          {label}
        </label>
        {showValue ? (
          <span className="tabular text-[0.8125rem] font-medium text-navy-900">
            {valueText ?? `${Math.round(pct)}%`}
          </span>
        ) : null}
      </div>

      <div
        id={id}
        role="progressbar"
        aria-labelledby={`${id}-label`}
        aria-valuemin={0}
        aria-valuemax={max}
        {...(indeterminate ? {} : { "aria-valuenow": value })}
        aria-valuetext={valueText}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-[#E4E9F1]",
          "shadow-[inset_0_1px_2px_rgba(10,23,40,0.10)]",
          barClassName,
        )}
      >
        {indeterminate ? (
          <motion.span
            className="absolute inset-y-0 w-1/3 rounded-full bg-blue-600"
            animate={reduced ? { x: 0 } : { x: ["-100%", "300%"] }}
            transition={
              reduced ? INSTANT : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }
            }
          />
        ) : (
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full bg-blue-600"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={transition}
          />
        )}
      </div>

      {/* Screen readers are told the value changed without the visual bar being re-announced. */}
      <span aria-live="polite" className="sr-only">
        {indeterminate ? `${label}: in progress` : (valueText ?? `${Math.round(pct)}%`)}
      </span>
    </div>
  );
}
