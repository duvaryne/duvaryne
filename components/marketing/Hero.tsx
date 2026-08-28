import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { home } from "@/content/data/home";
import { sections } from "@/lib/phase";

/**
 * Text LCP only — no hero image or video (SPEC §9.1). The LCP element is the H1, which is
 * why Archivo and Plex Sans are the only preloaded fonts.
 */
export function Hero() {
  const { hero } = home;

  // The secondary CTA points at /case-studies/, which is not in the Phase 1 production
  // build. Fall back to /services/ rather than shipping a link to a 404.
  const secondary = sections.caseStudies
    ? hero.secondaryCta
    : { label: "See what we do", href: "/services/" };

  return (
    <section className="on-navy bg-navy-900 pb-16 pt-14 text-white lg:pb-24 lg:pt-20">
      <Container>
        <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.09em] text-blue-300">
          {hero.eyebrow}
        </p>

        <h1 className="mt-5 max-w-[17ch] text-[2.25rem] leading-[1.1] text-white lg:text-[3.5rem]">
          {hero.h1}
        </h1>

        <p className="mt-6 max-w-[60ch] text-[1.0625rem] leading-relaxed text-white/75 lg:text-[1.1875rem]">
          {hero.sub}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={hero.primaryCta.href}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="cta_book_clicked"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-orange-500 px-6 text-[0.9375rem] font-semibold text-navy-900 transition-colors duration-150 hover:bg-[#ea6a0c]"
          >
            {hero.primaryCta.label}
            <ArrowRight size={16} aria-hidden />
          </a>

          <Link
            href={secondary.href}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-navy-600 px-6 text-[0.9375rem] font-medium text-white transition-colors duration-150 hover:border-blue-500 hover:bg-white/5"
          >
            {secondary.label}
          </Link>
        </div>

        {/* Credibility strip under the fold line — replaces the old "Expert Team" card. */}
        <ul className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-navy-600 pt-7 text-[0.8125rem] text-white/60">
          {hero.trustLine.split(" · ").map((item, i) => (
            <li key={item} className="flex items-center gap-3">
              {i > 0 ? <span aria-hidden className="text-white/25">·</span> : null}
              <span className={/\d/.test(item) ? "tabular" : undefined}>{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
