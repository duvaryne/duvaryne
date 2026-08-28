import { Plus } from "lucide-react";
import type { Faq } from "@/lib/content-schema";

/**
 * Built on native <details>/<summary> rather than a JS disclosure.
 *
 * SPEC §11.1 permits "use client" here, but native elements are strictly better for this
 * page's job: zero JavaScript against the <120KB budget, correct expand/collapse semantics
 * and keyboard support for free, and — the reason that actually matters — the answer text
 * is in the DOM whether or not the panel is open, so it stays extractable for featured
 * snippets and AI answers. That extractability is the entire point of the AEO work in §10.6.
 */
export function FaqAccordion({ faqs, headingLevel = 2 }: { faqs: Faq[]; headingLevel?: 2 | 3 }) {
  if (!faqs.length) return null;
  const H = `h${headingLevel}` as "h2" | "h3";

  return (
    <div className="divide-y divide-rule border-y border-rule">
      {faqs.map((faq, i) => (
        <details key={i} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
            <H className="text-[1.0625rem] font-semibold leading-snug text-navy-900 lg:text-[1.125rem]">
              {faq.q}
            </H>
            <Plus
              size={19}
              aria-hidden
              className="mt-0.5 shrink-0 text-slate-600 transition-transform duration-200 group-open:rotate-45"
            />
          </summary>
          {/* 40-60 words, directly beneath the question — the extractable unit. SPEC §10.3. */}
          <p className="max-w-[68ch] pb-6 pr-10 text-[1.0625rem] leading-relaxed text-slate-600">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}
