import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Section, SectionHeader } from "@/components/layout/Section";
import { Hero } from "@/components/marketing/Hero";
import { SpendTeardown } from "@/components/marketing/SpendTeardown";
import { StatGrid } from "@/components/marketing/StatGrid";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { Testimonials } from "@/components/marketing/Testimonials";
import { BentoCard } from "@/components/marketing/BentoCard";
import { CTA } from "@/components/marketing/CTA";

import { home } from "@/content/data/home";
import { getCaseStudies } from "@/lib/content";
import { sections } from "@/lib/phase";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: home.meta.title,
  description: home.meta.description,
  path: "/",
});

export default function HomePage() {
  const featured = sections.caseStudies
    ? home.caseStudies.featured
        .map((slug) => getCaseStudies().find((c) => c.slug === slug))
        .filter((c) => c !== undefined)
    : [];

  return (
    <>
      <Hero />

      {/* Signature element — SPEC §9.2, directly below the hero. */}
      <Section tone="paper" id="spend-teardown">
        <SpendTeardown />
      </Section>

      <Section tone="white">
        <SectionHeader heading={home.proof.heading} body={home.proof.body} />
        <div className="mt-12">
          <StatGrid stats={home.proof.stats} columns={3} />
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeader heading={home.services.heading} body={home.services.body} />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {home.services.items.map((s) => (
            <ServiceCard
              key={s.href}
              title={s.title}
              href={s.href}
              summary={s.summary}
              proof={s.proof}
            />
          ))}
        </div>
      </Section>

      {featured.length ? (
        <Section tone="white">
          <SectionHeader heading={home.caseStudies.heading} body={home.caseStudies.body} />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((cs) => (
              <BentoCard key={cs.slug} caseStudy={cs} />
            ))}
          </div>
          <Link
            href={home.caseStudies.href}
            className="mt-10 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700"
          >
            {home.caseStudies.linkLabel}
            <ArrowRight size={15} aria-hidden />
          </Link>
        </Section>
      ) : null}

      <Section tone="navy">
        <SectionHeader heading={home.process.heading} tone="dark" />
        <div className="mt-12">
          <ProcessSteps steps={home.process.steps} />
        </div>
      </Section>

      {/* Renders nothing until testimonials are supplied (I3). */}
      <Testimonials />

      <Section tone="paper">
        <div className="max-w-[68ch]">
          <h2 className="text-[1.75rem] text-navy-900 lg:text-[2rem]">
            {home.credibility.heading}
          </h2>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-slate-600">
            {home.credibility.body}
          </p>
          <Link
            href={home.credibility.href}
            className="mt-7 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700"
          >
            {home.credibility.linkLabel}
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </Section>

      <Section tone="white" className="pb-20 pt-0 lg:pt-0">
        <CTA
          cta={{
            heading: home.closingCta.heading,
            body: home.closingCta.body,
            buttonLabel: home.closingCta.buttonLabel,
            href: home.closingCta.href,
          }}
          className="my-0"
        />
      </Section>
    </>
  );
}
