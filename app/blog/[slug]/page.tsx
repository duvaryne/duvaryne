import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { Mdx } from "@/components/content/Mdx";
import { JsonLd } from "@/components/seo/JsonLd";

import { getCaseStudy, getPost, getPosts } from "@/lib/content";
import { sections } from "@/lib/phase";
import { buildMetadata, formatDate } from "@/lib/seo";
import { site } from "@/lib/site";
import { articleSchema, breadcrumbSchema, faqPageSchema, graph } from "@/lib/schema-org";

export const dynamicParams = false;

export function generateStaticParams() {
  return sections.blog ? getPosts().map((p) => ({ slug: p.slug })) : [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.published,
    modifiedTime: post.updated,
    authors: [post.author],
  });
}

export default async function PostPage({ params }: Props) {
  if (!sections.blog) notFound();

  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog/" },
    { name: post.h1, path: `/blog/${post.slug}/` },
  ];

  // The link graph that is the actual SEO architecture:
  // blog post -> case study -> service page -> Calendly. SPEC §8.3.
  const mapped = post.mapsToCaseStudy ? getCaseStudy(post.mapsToCaseStudy) : undefined;

  return (
    <>
      <PageHeader
        h1={post.h1}
        eyebrow="Blog"
        crumbs={crumbs}
        meta={
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.875rem] text-on-inverse/60">
            <span>
              By{" "}
              <Link href="/about/" className="text-on-inverse/85 underline underline-offset-2">
                {post.author}
              </Link>
            </span>
            <span aria-hidden>·</span>
            <time dateTime={post.published.toISOString()} className="tabular">
              {formatDate(post.published)}
            </time>
            <span aria-hidden>·</span>
            <span className="tabular">{post.readingMinutes} min read</span>
          </div>
        }
      />

      <Section tone="paper" className="py-14 lg:py-20">
        <article className="prose-duvaryne">
          <Mdx source={post.body} cta={post.cta} />
        </article>
      </Section>

      {post.faqs.length ? (
        <Section tone="white">
          <h2 className="text-[1.5rem] text-heading">Questions this raises</h2>
          <div className="mt-8 max-w-[80ch]">
            <FaqAccordion faqs={post.faqs} headingLevel={3} />
          </div>
        </Section>
      ) : null}

      {mapped ? (
        <Container className="pb-16">
          {/* Contextual CTA from mapsToCaseStudy — never a generic "contact us". */}
          <aside className="border border-rule bg-surface p-7">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.09em] text-action">
              We hit this in production
            </p>
            <p className="tabular mt-3 text-[1.125rem] font-medium leading-snug text-heading">
              {mapped.outcomeHeadline}
            </p>
            <Link
              href={`/case-studies/${mapped.slug}/`}
              className="mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-action transition-colors duration-150 hover:text-action-hover"
            >
              Read the case study
              <ArrowRight size={15} aria-hidden />
            </Link>
          </aside>
        </Container>
      ) : null}

      <JsonLd
        json={graph(
          articleSchema({
            title: post.title,
            description: post.description,
            path: `/blog/${post.slug}`,
            published: post.published,
            updated: post.updated,
            tags: [...post.tags],
          }),
          faqPageSchema(post.faqs),
          breadcrumbSchema(crumbs),
        )}
      />
      <meta name="author" content={site.founder.name} />
    </>
  );
}
