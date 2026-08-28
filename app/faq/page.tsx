import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { PageHeader } from "@/components/marketing/PageHeader";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CTA } from "@/components/marketing/CTA";
import { Container } from "@/components/layout/Container";
import { JsonLd } from "@/components/seo/JsonLd";

import { getAllFaqs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, graph, webPageSchema } from "@/lib/schema-org";

const UPDATED = new Date("2026-08-06");

export const metadata: Metadata = buildMetadata({
  title: "AWS & DevOps Consulting FAQs | Duvaryne",
  description:
    "Straight answers on AWS migration timelines, realistic cost savings, whether you need Kubernetes, certifications, pricing and how our engagements actually run.",
  path: "/faq",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq/" },
];

/**
 * Aggregates every faqs[] array across all content at build time — SPEC §9.8.
 *
 * Costs nothing, because the data already exists in frontmatter, and captures long-tail
 * question queries the individual service pages cannot rank for on their own.
 */
export default function FaqPage() {
  const groups = getAllFaqs();
  const all = groups.flatMap((g) => g.faqs);

  return (
    <>
      <PageHeader
        h1="Questions technical buyers actually ask"
        eyebrow="FAQ"
        lede="Every question from across the site, in one place. Answers are deliberately specific — if a number appears here, it came out of a production engagement."
        crumbs={crumbs}
        updated={UPDATED}
      />

      <Section tone="paper">
        <p className="tabular text-[0.875rem] text-slate-600">
          {all.length} questions across {groups.length} pages
        </p>

        <div className="mt-10 space-y-14">
          {groups.map((group) => (
            <div key={group.href}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-[1.375rem] text-navy-900">{group.group}</h2>
                <Link
                  href={group.href}
                  className="inline-flex items-center gap-1 text-[0.875rem] font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700"
                >
                  Read the full page
                  <ArrowUpRight size={14} aria-hidden />
                </Link>
              </div>
              <div className="mt-6">
                <FaqAccordion faqs={group.faqs} headingLevel={3} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Container className="pb-8">
        <CTA />
      </Container>

      <JsonLd
        json={graph(
          webPageSchema({
            type: "WebPage",
            title: "AWS & DevOps Consulting FAQs",
            description:
              "Straight answers on AWS migration timelines, realistic cost savings, whether you need Kubernetes, certifications, pricing and how our engagements run.",
            path: "/faq",
            updated: UPDATED,
          }),
          faqPageSchema(all),
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
