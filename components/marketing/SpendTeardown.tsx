"use client";

import { useId, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight } from "lucide-react";
import { home } from "@/content/data/home";

/**
 * `motion` is pulled in only by the ProgressBar, so the bar is loaded as its own chunk
 * after hydration — SPEC §11.1 requires motion to be dynamically imported to hold the
 * initial-JS budget. The placeholder reserves the exact height, so nothing shifts (CLS).
 */
const ProgressBar = dynamic(
  () => import("@/components/ui/progress-bar").then((m) => m.ProgressBar),
  { ssr: false, loading: () => <div className="h-[2.25rem]" aria-hidden /> },
);

/**
 * The signature element — SPEC §9.2. Homepage, directly below the hero.
 *
 * This is where boldness is spent; everything else on the page stays quiet. It is drawn
 * from the subject's own world, it is the first question every prospect actually has, and
 * it converts. Models the 30-50% waste band cited on /services/aws-cloud/.
 *
 * One of only three legitimate uses of the ProgressBar (§9.12) — the others are case-study
 * outcome meters and the contact form submit state.
 */

const WASTE_LOW = 0.3;
const WASTE_HIGH = 0.5;

/** Log-ish steps so the low end (where most prospects sit) has real resolution. */
const STEPS_USD = [
  1_000, 2_000, 3_000, 5_000, 7_500, 10_000, 15_000, 20_000, 30_000, 50_000, 75_000, 100_000,
  150_000, 200_000, 300_000, 500_000,
];

// Indicative only. The disclaimer says as much, and nothing here is billed on it.
const USD_TO_INR = 88;

type Currency = "INR" | "USD";

function useMoney(currency: Currency) {
  return useMemo(
    () =>
      new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }),
    [currency],
  );
}

export function SpendTeardown() {
  const copy = home.spendTeardown;
  const [index, setIndex] = useState(5); // $10k/month
  /* USD by default, with rupees one tap away.
     The currency the calculator opens in is a positioning decision, not a locale one. A
     US or EU buyer who lands on a figure in rupees prices the work as offshore before
     reading a sentence, and the same engagement bills very differently to the two
     audiences. India remains a first-class audience — hence the toggle rather than a
     removal — but it is the second thing the widget says, not the first. */
  const [currency, setCurrency] = useState<Currency>("USD");
  const groupId = useId();

  const fmt = useMoney(currency);
  const usd = STEPS_USD[index] ?? 10_000;
  const spend = currency === "INR" ? usd * USD_TO_INR : usd;

  const low = fmt.format(Math.round((spend * WASTE_LOW) / 100) * 100);
  const high = fmt.format(Math.round((spend * WASTE_HIGH) / 100) * 100);
  const spendLabel = fmt.format(spend);

  const result = copy.resultTemplate
    .replace("{spend}", spendLabel)
    .replace("{low}", low)
    .replace("{high}", high);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div>
        <h2 className="max-w-[18ch] text-[1.75rem] text-heading lg:text-[2rem]">
          {copy.heading}
        </h2>
        <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted">
          {copy.body}
        </p>
      </div>

      <div className="border border-rule bg-surface p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor={`${groupId}-slider`}
            className="text-[0.8125rem] font-medium text-muted"
          >
            {copy.sliderLabel}
          </label>

          <div
            role="group"
            aria-label="Currency"
            className="flex border border-rule p-0.5"
          >
            {(["USD", "INR"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                aria-pressed={currency === c}
                className={`tabular min-h-8  px-2.5 text-[0.8125rem] font-medium transition-colors duration-150 ${
                  currency === c
                    ? "bg-inverse text-on-inverse"
                    : "text-muted hover:text-heading"
                }`}
              >
                {c === "INR" ? "₹" : "$"}
              </button>
            ))}
          </div>
        </div>

        <output
          htmlFor={`${groupId}-slider`}
          className="tabular mt-3 block text-[2.25rem] font-medium leading-none tracking-[-0.01em] text-heading lg:text-[2.5rem]"
        >
          {spendLabel}
          <span className="ml-1 text-[1rem] font-normal text-muted">/month</span>
        </output>

        <input
          id={`${groupId}-slider`}
          type="range"
          min={0}
          max={STEPS_USD.length - 1}
          step={1}
          value={index}
          onChange={(e) => setIndex(Number(e.target.value))}
          data-analytics="spend_teardown_used"
          aria-valuetext={`${spendLabel} per month`}
          className="mt-6 h-11 w-full cursor-pointer accent-action"
        />

        <div className="mt-4">
          <ProgressBar
            value={index + 1}
            max={STEPS_USD.length}
            label="Recoverable waste band"
            valueText={`${low} to ${high} per month`}
          />
        </div>

        <p className="mt-6 border-t border-rule pt-6 text-[1.0625rem] leading-relaxed text-fg">
          {/* Split so the two money figures render in Plex Mono tabular like every other
              quantity on the site, while the sentence around them stays in Plex Sans. */}
          {result.split(/(\S*[₹$][\d,.]+\S*)/).map((part, i) =>
            /[₹$]/.test(part) ? (
              <strong key={i} className="tabular font-medium text-heading">
                {part}
              </strong>
            ) : (
              <span key={i}>{part}</span>
            ),
          )}
        </p>

        <a
          href={copy.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="cta_book_clicked"
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-action px-5 text-[0.9375rem] font-semibold text-on-action transition-colors duration-150 hover:bg-action-hover"
        >
          {copy.cta.label}
          <ArrowRight size={16} aria-hidden />
        </a>

        <p className="tabular mt-5 text-[0.8125rem] leading-relaxed text-muted">
          {copy.disclaimer}
        </p>
      </div>
    </div>
  );
}
