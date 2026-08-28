import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Section } from "@/components/layout/Section";
import { PageHeader } from "@/components/marketing/PageHeader";
import { JsonLd } from "@/components/seo/JsonLd";

import { getPosts } from "@/lib/content";
import { sections } from "@/lib/phase";
import { buildMetadata, formatDate } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema-org";

const UPDATED = new Date("2026-08-06");

export const metadata: Metadata = buildMetadata({
  title: "AWS & DevOps Engineering Blog | Duvaryne",
  description:
    "Production notes on AWS cost, Terraform, EKS networking, Lambda cold starts, IAM and drift detection — written by the engineer who ran them, not a content team.",
  path: "/blog",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog/" },
];

export default function BlogIndex() {
  if (!sections.blog) notFound();

  const posts = getPosts();

  return (
    <>
      <PageHeader
        h1="Notes from production"
        eyebrow="Blog"
        lede="Specific problems, specific fixes, and the commands that produced them. Every post maps to an engagement where we hit the thing it describes."
        crumbs={crumbs}
        updated={UPDATED}
      />

      <Section tone="paper">
        <ul className="divide-y divide-rule border-y border-rule">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}/`} className="group block py-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-slate-600">
                  <time dateTime={post.published.toISOString()} className="tabular">
                    {formatDate(post.published)}
                  </time>
                  <span aria-hidden>·</span>
                  <span className="tabular">{post.readingMinutes} min read</span>
                  <span aria-hidden>·</span>
                  <span>{post.tags.join(", ")}</span>
                </div>

                <h2 className="mt-2.5 max-w-[34ch] text-[1.375rem] text-navy-900 transition-colors duration-150 group-hover:text-blue-600">
                  {post.h1}
                </h2>

                <p className="mt-3 max-w-[68ch] text-[1rem] leading-relaxed text-slate-600">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {posts.length === 0 ? (
          <p className="text-[1.0625rem] text-slate-600">
            No posts published yet.
          </p>
        ) : null}
      </Section>

      <JsonLd
        json={graph(
          webPageSchema({
            type: "WebPage",
            title: "AWS & DevOps Engineering Blog",
            description:
              "Production notes on AWS cost, Terraform, EKS networking, Lambda cold starts, IAM and drift detection.",
            path: "/blog",
            updated: UPDATED,
          }),
          {
            "@type": "Blog",
            "@id": `${absoluteUrl("/blog")}#blog`,
            name: "Duvaryne Engineering Blog",
            url: absoluteUrl("/blog"),
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: absoluteUrl(`/blog/${p.slug}`),
              datePublished: p.published.toISOString(),
            })),
          },
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
