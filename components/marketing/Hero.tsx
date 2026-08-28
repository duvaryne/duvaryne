import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Mark } from "@/components/brand/Mark";
import { home } from "@/content/data/home";
import { sections } from "@/lib/phase";

/**
 * Engineered Grid hero.
 *
 * The energy here comes from structure, not colour — the palette is deliberately
 * restrained and adding to it would give away the thing that makes it distinctive.
 * So the grid is drawn: the lead spans two columns, the mark occupies a cell of its own
 * as a structural block rather than a logo, and the credibility line becomes bordered
 * cells instead of a run of dot-separated text.
 *
 * Text LCP only — no hero image or video. The LCP element is the H1, which is why Sora
 * and Chivo are the only preloaded faces.
 */
export function Hero() {
  const { hero } = home;

  // The secondary CTA points at /case-studies/, which is not in the Phase 1 production
  // build. Fall back to /services/ rather than shipping a link to a 404.
  const secondary = sections.caseStudies
    ? hero.secondaryCta
    : { label: "See what we do", href: "/services/" };

  const trust = hero.trustLine.split(" · ");

  return (
    <section className="on-inverse bg-inverse-deep text-on-inverse">
      <Container className="px-0">
        <div className="grid-frame grid grid-cols-1 lg:grid-cols-3">
          {/* Lead — spans two of three columns so the grid is asymmetric by default. */}
          <div className="px-5 py-14 lg:col-span-2 lg:px-12 lg:py-20">
            <p className="marker-inline font-mono text-[0.6875rem] uppercase tracking-[0.26em] text-on-inverse-muted">
              {hero.eyebrow}
            </p>

            <h1 className="mt-7 max-w-[20ch] text-[2.375rem] leading-[1.02] text-on-inverse lg:text-[3.5rem]">
              {hero.h1}
            </h1>

            <p className="mt-7 max-w-[54ch] text-[1.0625rem] leading-relaxed text-on-inverse/75 lg:text-[1.125rem]">
              {hero.sub}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={hero.primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="cta_book_clicked"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-action px-6 text-[0.9375rem] font-semibold text-on-action transition-colors duration-150 hover:bg-action-hover"
              >
                {hero.primaryCta.label}
                <ArrowRight size={16} aria-hidden />
              </a>

              <Link
                href={secondary.href}
                className="inline-flex min-h-12 items-center justify-center border border-inverse-rule px-6 text-[0.9375rem] font-medium text-on-inverse transition-colors duration-150 hover:border-decor"
              >
                {secondary.label}
              </Link>
            </div>
          </div>

          {/* The mark as a structural block. Decorative here — the wordmark in the header
              already names the brand, so it carries no title. */}
          <div className="flex items-center justify-center bg-inverse px-5 py-14 lg:py-20">
            <Mark size={132} tone="dark" className="w-[7.5rem] lg:w-[9.5rem]" />
          </div>
        </div>

        {/* Credibility strip as cells. Each fact gets its own bordered box, which reads
            as a specification sheet rather than a tagline. */}
        <ul className="grid-frame grid grid-cols-2 lg:grid-cols-5">
          {trust.map((item) => (
            <li
              key={item}
              className="px-5 py-5 text-[0.8125rem] leading-snug text-on-inverse-muted lg:px-6"
            >
              <span className={/\d/.test(item) ? "tabular" : undefined}>{item}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
