import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  caseStudySchema,
  marketingPageSchema,
  postSchema,
  type CaseStudy,
  type Faq,
  type MarketingPage,
  type Post,
} from "./content-schema";
import { INCLUDE_DRAFTS } from "./phase";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Entry<T> = T & { body: string; filePath: string };

/** Every .mdx under `dir`, recursively. Nested dirs become nested routes (legal/privacy). */
function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return walk(full);
    return e.isFile() && e.name.endsWith(".mdx") ? [full] : [];
  });
}

/**
 * Read + parse + validate. A file that fails its schema throws with the path and the
 * exact field, which fails `next build` — a bad meta description can never reach production.
 */
function load<S extends z.ZodType>(dir: string, schema: S): Entry<z.infer<S>>[] {
  const entries = walk(path.join(CONTENT_DIR, dir)).map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const rel = path.relative(process.cwd(), filePath);
      const issues = parsed.error.issues
        .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("\n");
      throw new Error(`Invalid frontmatter in ${rel}\n${issues}`);
    }

    return { ...parsed.data, body: content, filePath } as Entry<z.infer<S>>;
  });

  const slugs = new Set<string>();
  for (const e of entries) {
    const slug = (e as { slug: string }).slug;
    if (slugs.has(slug)) throw new Error(`Duplicate slug "${slug}" in content/${dir}`);
    slugs.add(slug);
  }

  // Drafts render in preview (NEXT_PUBLIC_INCLUDE_DRAFTS=true) and vanish in production.
  return INCLUDE_DRAFTS ? entries : entries.filter((e) => !(e as { draft: boolean }).draft);
}

/* ── Marketing pages ─────────────────────────────────────────────────────── */

let _pages: Entry<MarketingPage>[] | null = null;
export function getPages(): Entry<MarketingPage>[] {
  _pages ??= load("pages", marketingPageSchema);
  return _pages;
}

export function getPage(slug: string): Entry<MarketingPage> | undefined {
  return getPages().find((p) => p.slug === slug.replace(/^\/|\/$/g, ""));
}

/* ── Case studies ────────────────────────────────────────────────────────── */

let _caseStudies: Entry<CaseStudy>[] | null = null;
export function getCaseStudies(): Entry<CaseStudy>[] {
  _caseStudies ??= load("case-studies", caseStudySchema).sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
  return _caseStudies;
}

export function getCaseStudy(slug: string): Entry<CaseStudy> | undefined {
  return getCaseStudies().find((c) => c.slug === slug);
}

/* ── Blog ────────────────────────────────────────────────────────────────── */

let _posts: Entry<Post>[] | null = null;
export function getPosts(): Entry<Post>[] {
  _posts ??= load("blog", postSchema).sort(
    (a, b) => b.published.getTime() - a.published.getTime(),
  );
  return _posts;
}

export function getPost(slug: string): Entry<Post> | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/* ── Cross-content helpers ───────────────────────────────────────────────── */

/**
 * Every FAQ on the site, grouped by the page that owns it. Feeds /faq/ (SPEC §9.8) and
 * costs nothing, because the data already exists in frontmatter.
 */
export function getAllFaqs(): { group: string; href: string; faqs: Faq[] }[] {
  const groups: { group: string; href: string; faqs: Faq[] }[] = [];

  for (const page of getPages()) {
    if (page.faqs.length) {
      groups.push({ group: page.h1, href: `/${page.slug}/`, faqs: page.faqs });
    }
  }
  for (const cs of getCaseStudies()) {
    if (cs.faqs.length) {
      groups.push({ group: cs.h1, href: `/case-studies/${cs.slug}/`, faqs: cs.faqs });
    }
  }
  for (const post of getPosts()) {
    if (post.faqs.length) {
      groups.push({ group: post.h1, href: `/blog/${post.slug}/`, faqs: post.faqs });
    }
  }

  return groups;
}

/** Resolves a `source` slug on a <Stat> to a case-study link, or null when not shipped. */
export function caseStudyHref(slug?: string): string | null {
  if (!slug) return null;
  return getCaseStudy(slug) ? `/case-studies/${slug}/` : null;
}
