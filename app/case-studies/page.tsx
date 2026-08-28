import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { CaseStudyGrid } from "@/components/marketing/CaseStudyGrid";
import { CTA } from "@/components/marketing/CTA";
import { JsonLd } from "@/components/seo/JsonLd";

import { getCaseStudies } from "@/lib/content";
import { sections } from "@/lib/phase";
import { buildMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema-org";

const UPDATED = new Date("2026-08-06");

export const metadata: Metadata = buildMetadata({
  title: "AWS & DevOps Case Studies | Duvaryne",
  description:
    "Ten production engagements in full technical detail: Karpenter and Spot cost cuts, multi-region DR, zero-trust supply chain, ephemeral environments. Numbers, not adjectives.",
  path: "/case-studies",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Case Studies", path: "/case-studies/" },
];

export default function CaseStudiesPage() {
  if (!sections.caseStudies) notFound();

  const studies = getCaseStudies();

  return (
    <>
      <PageHeader
        h1="Selected engagements"
        eyebrow="Case Studies"
        lede="Ten production builds, described in full technical detail — including the parts we would do differently. Client names withheld under NDA; everything else is on the page."
        crumbs={crumbs}
        updated={UPDATED}
      />

      <Section tone="paper">
        <CaseStudyGrid
          studies={studies.map((s) => ({
            slug: s.slug,
            h1: s.h1,
            outcomeHeadline: s.outcomeHeadline,
            stack: [...s.stack],
            featured: s.featured,
          }))}
        />
      </Section>

      <Container className="pb-8">
        <CTA />
      </Container>

      <JsonLd
        json={graph(
          webPageSchema({
            type: "WebPage",
            title: "AWS & DevOps Case Studies",
            description:
              "Ten production engagements in full technical detail, with the architecture and the numbers as delivered.",
            path: "/case-studies",
            updated: UPDATED,
          }),
          {
            "@type": "ItemList",
            itemListElement: studies.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.h1,
              url: absoluteUrl(`/case-studies/${s.slug}`),
            })),
          },
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
