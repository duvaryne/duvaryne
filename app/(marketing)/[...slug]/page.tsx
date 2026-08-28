import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Container } from "@/components/layout/Container";
import { Section, SectionHeader } from "@/components/layout/Section";
import { PageHeader, type Crumb } from "@/components/marketing/PageHeader";
import { StatGrid } from "@/components/marketing/StatGrid";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { CTA } from "@/components/marketing/CTA";
import { Mdx } from "@/components/content/Mdx";
import { JsonLd } from "@/components/seo/JsonLd";

import { getPage, getPages } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  graph,
  serviceSchema,
  webPageSchema,
} from "@/lib/schema-org";

/**
 * Renders every file under content/pages/*.mdx — SPEC §7.
 *
 * Static at build time. A slug that has no MDX file (or whose file is draft-gated out of
 * this build) 404s rather than rendering an empty shell.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getPages().map((page) => ({ slug: page.slug.split("/") }));
}

type Props = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug.join("/"));
  if (!page) return {};

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/${page.slug}`,
    modifiedTime: page.updated,
  });
}

/**
 * "services/aws-cloud" -> Home / Services / AWS Cloud
 *
 * Intermediate segments are only included when a page actually exists at that path.
 * "legal/privacy" has no /legal/ hub, so it renders as Home / Privacy Policy rather than
 * linking — in the trail or in BreadcrumbList JSON-LD — to a URL that 404s.
 */
function buildCrumbs(page: { slug: string; h1: string }): Crumb[] {
  const parts = page.slug.split("/");
  const crumbs: Crumb[] = [{ name: "Home", path: "/" }];

  parts.forEach((part, i) => {
    const segment = parts.slice(0, i + 1).join("/");
    const isLast = i === parts.length - 1;

    if (isLast) {
      crumbs.push({ name: page.h1, path: `/${segment}/` });
      return;
    }

    const hub = getPage(segment);
    if (hub) crumbs.push({ name: hub.h1, path: `/${segment}/` });
  });

  return crumbs;
}

export default async function MarketingPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage(slug.join("/"));
  if (!page) notFound();

  const path = `/${page.slug}`;
  const crumbs = buildCrumbs(page);
  const isService = page.schema === "Service";

  return (
    <>
      <PageHeader
        h1={page.h1}
        eyebrow={page.eyebrow}
        crumbs={crumbs}
        updated={page.updated}
      />

      {page.stats.length ? (
        <Section tone="white" className="py-12 lg:py-14">
          <StatGrid stats={page.stats} columns={4} size="sm" />
        </Section>
      ) : null}

      <Section tone="paper" className="py-14 lg:py-20">
        <article className="prose-duvaryne">
          <Mdx source={page.body} cta={page.cta} factLists={page.factLists} />
        </article>
      </Section>

      {page.faqs.length ? (
        <Section tone="white" id="faq">
          <SectionHeader
            heading="Frequently asked questions"
            body="Straight answers to what technical buyers actually ask before a first call."
          />
          <div className="mt-10 max-w-[80ch]">
            <FaqAccordion faqs={page.faqs} headingLevel={3} />
          </div>
        </Section>
      ) : null}

      {/* The MDX body places <CTA /> itself; this is the fallback for pages that omit it. */}
      {page.cta && !page.body.includes("<CTA") ? (
        <Container className="pb-4">
          <CTA cta={page.cta} />
        </Container>
      ) : null}

      <JsonLd
        json={graph(
          webPageSchema({
            // A Service page still gets a WebPage node; the Service node is added alongside it.
            type: page.schema === "Service" ? "WebPage" : page.schema,
            title: page.title,
            description: page.description,
            path,
            updated: page.updated,
          }),
          isService
            ? serviceSchema({
                name: page.h1,
                description: page.description,
                serviceType: page.serviceType,
                path,
              })
            : null,
          faqPageSchema(page.faqs),
          breadcrumbSchema(crumbs.map((c) => ({ name: c.name, path: c.path }))),
        )}
      />
    </>
  );
}
