"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { site } from "@/lib/site";

/**
 * Lazy Calendly — loads on interaction, not on page load (SPEC §2, §9.11).
 *
 * Calendly's widget bundle is heavy and would otherwise land in the critical path of a
 * page whose LCP budget is 1.8s. Until the user asks for it, this is a static button.
 */
export function CalendlyEmbed() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <div className="border border-rule bg-surface p-8 text-center">
        <Calendar size={24} className="mx-auto text-action" aria-hidden />
        <h3 className="mt-4 text-[1.125rem] text-heading">
          Book a 30-minute review
        </h3>
        <p className="mx-auto mt-2.5 max-w-[46ch] text-[0.9375rem] leading-relaxed text-muted">
          Pick a slot that works for you. Bring your architecture and, if you have it, your Cost
          and Usage Report.
        </p>
        <button
          type="button"
          onClick={() => setLoaded(true)}
          data-analytics="cta_book_clicked"
          className="mt-6 inline-flex min-h-11 items-center justify-center border border-inverse px-5 text-[0.9375rem] font-semibold text-heading transition-colors duration-150 hover:bg-tint"
        >
          Show available times
        </button>
        <p className="mt-4 text-[0.8125rem] text-muted">
          Loads Calendly.{" "}
          <a
            href={site.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="text-action underline underline-offset-2"
          >
            Open in a new tab instead
          </a>
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={`${site.calendly}?hide_gdpr_banner=1&background_color=ffffff&primary_color=0b5ed7`}
      title="Book a 30-minute review with Duvaryne"
      loading="lazy"
      className="h-[700px] w-full border border-rule bg-surface"
    />
  );
}
