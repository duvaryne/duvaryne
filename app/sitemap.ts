import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getCaseStudies, getPages, getPosts } from "@/lib/content";
import { sections } from "@/lib/phase";

/**
 * Reads the content directory — never hand-maintained (SPEC §10.5).
 *
 * Draft-gated content is already filtered out by lib/content.ts, so the sitemap can only
 * ever advertise URLs this build actually serves.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const pages: MetadataRoute.Sitemap = getPages().map((page) => ({
    url: absoluteUrl(`/${page.slug}`),
    lastModified: page.updated,
    changeFrequency: "monthly",
    // Service pages carry commercial intent; legal pages do not.
    priority: page.slug.startsWith("legal/") ? 0.3 : page.schema === "Service" ? 0.9 : 0.7,
  }));

  const caseStudies: MetadataRoute.Sitemap = sections.caseStudies
    ? [
        {
          url: absoluteUrl("/case-studies"),
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        },
        ...getCaseStudies().map((cs) => ({
          url: absoluteUrl(`/case-studies/${cs.slug}`),
          lastModified: cs.updated,
          changeFrequency: "yearly" as const,
          priority: cs.featured ? 0.8 : 0.6,
        })),
      ]
    : [];

  const blog: MetadataRoute.Sitemap = sections.blog
    ? [
        {
          url: absoluteUrl("/blog"),
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        },
        ...getPosts().map((post) => ({
          url: absoluteUrl(`/blog/${post.slug}`),
          lastModified: post.updated,
          changeFrequency: "yearly" as const,
          priority: 0.6,
        })),
      ]
    : [];

  return [...staticRoutes, ...pages, ...caseStudies, ...blog];
}
