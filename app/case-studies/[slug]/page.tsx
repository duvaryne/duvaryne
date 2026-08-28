import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { StatGrid } from "@/components/marketing/StatGrid";
import { Mdx } from "@/components/content/Mdx";
import { JsonLd } from "@/components/seo/JsonLd";

import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { sections } from "@/lib/phase";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, caseStudyArticleSchema, graph } from "@/lib/schema-org";

export const dynamicParams = false;

export function generateStaticParams() {
  return sections.caseStudies ? getCaseStudies().map((c) => ({ slug: c.slug })) : [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};

  return buildMetadata({
    title: cs.title,
    description: cs.description,
    path: `/case-studies/${cs.slug}`,
    type: "article",
    modifiedTime: cs.updated,
    authors: ["Abhinav Banerjee"],
  });
}

export default async function CaseStudyPage({ params }: Props) {
  if (!sections.caseStudies) notFound();

  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Case Studies", path: "/case-studies/" },
    { name: cs.h1, path: `/case-studies/${cs.slug}/` },
  ];

  return (
    <>
      <PageHeader
        h1={cs.h1}
        eyebrow="Case Study"
        crumbs={crumbs}
        updated={cs.updated}
        meta={
          <>
            {/* The GEO-extractable fact line, before any prose — SPEC §8.4 step 1. */}
            <p className="tabular mt-6 max-w-[62ch] border-l-2 border-blue-500 pl-5 text-[1.125rem] font-medium leading-relaxed text-white">
              {cs.outcomeHeadline}
            </p>
            <ul className="mt-7 flex flex-wrap gap-1.5">
              {cs.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded border border-navy-600 px-2.5 py-1 text-[0.75rem] text-white/70"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </>
        }
      />

      <Section tone="white" className="py-12 lg:py-14">
        <StatGrid stats={cs.stats} columns={4} size="sm" />
      </Section>

      <Section tone="paper" className="py-14 lg:py-20">
        <article className="prose-duvaryne">
          <Mdx source={cs.body} cta={cs.cta} />
        </article>
      </Section>

      {cs.mapsToService ? (
        <Container className="pb-16">
          <Link
            href={cs.mapsToService}
            className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700"
          >
            See the service behind this work
            <ArrowRight size={15} aria-hidden />
          </Link>
        </Container>
      ) : null}

      <JsonLd
        json={graph(
          caseStudyArticleSchema({
            title: cs.title,
            description: cs.description,
            path: `/case-studies/${cs.slug}`,
            updated: cs.updated,
            stack: [...cs.stack],
          }),
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
