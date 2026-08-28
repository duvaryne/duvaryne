import { z } from "zod";

/**
 * Frontmatter contract for everything under /content — SPEC §8.1.
 *
 * The build fails loudly on a bad file rather than shipping a page with no meta
 * description. This is what prevents defect 14 (auto-generated content-dump descriptions
 * like "Projects Projects Our Projects Contact us creative solution") from recurring.
 */

export const faqSchema = z.object({
  q: z.string().min(10),
  /** 40-60 words is the featured-snippet sweet spot. Warn above 90. */
  a: z.string().min(40),
});

export const statSchema = z.object({
  /** Rendered in IBM Plex Mono, tabular figures. */
  value: z.string(),
  label: z.string(),
  /** Slug of the case study this number came from. Enforces "no unsourced claims". */
  source: z.string().optional(),
});

export const factSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const ctaSchema = z.object({
  heading: z.string(),
  body: z.string(),
  buttonLabel: z.string(),
  href: z.string(),
});

const base = {
  title: z.string().max(60, "Title tag must be <= 60 characters"),
  description: z
    .string()
    .min(150, "Meta description must be at least 150 characters")
    .max(160, "Meta description must be at most 160 characters"),
  h1: z.string(),
  /** Route segment, without leading or trailing slash. */
  slug: z.string(),
  updated: z.coerce.date(),
  faqs: z.array(faqSchema).default([]),
  stats: z.array(statSchema).default([]),
  /** Case-study slugs surfaced as proof on this page. */
  relatedCaseStudies: z.array(z.string()).default([]),
  relatedPosts: z.array(z.string()).default([]),
  /**
   * Excluded from the production build when true — see lib/phase.ts. Not part of the
   * original SPEC; added to gate Phase 1 without deleting finished work from the repo.
   */
  draft: z.boolean().default(false),
};

export const marketingPageSchema = z.object({
  ...base,
  eyebrow: z.string().optional(),
  schema: z.enum(["Service", "WebPage", "AboutPage", "ContactPage"]),
  serviceType: z.string().optional(),
  cta: ctaSchema.optional(),
  /**
   * Named fact tables, referenced from the body as <FactList name="key" />.
   *
   * These live in frontmatter rather than as an inline `facts={[...]}` prop because
   * next-mdx-remote's RSC renderer silently drops JSX *expression* attributes — the
   * component is invoked with `{}` and renders nothing, with no error. Literal string
   * attributes do survive, so the body passes a key and the data is resolved here,
   * where zod also validates it.
   */
  factLists: z.record(z.string(), z.array(factSchema)).default({}),
});

export const caseStudySchema = z.object({
  ...base,
  /** NDA enforced by the type system — SPEC §1.2. No industry, size, region or logo. */
  client: z.literal("An enterprise client"),
  /** Drives bento sizing on the hub. */
  featured: z.boolean().default(false),
  diagram: z.string(),
  /** Defect 9: the ten empty alts become structurally impossible to ship. */
  diagramAlt: z.string().min(40, "diagramAlt must be at least 40 characters"),
  stack: z.array(z.string()).min(3),
  /** The GEO-extractable fact line, rendered before any prose. */
  outcomeHeadline: z.string(),
  /** Service page this study's CTA points at. */
  mapsToService: z.string().optional(),
  cta: ctaSchema.optional(),
});

export const postSchema = z.object({
  ...base,
  published: z.coerce.date(),
  author: z.literal("Abhinav Banerjee"),
  readingMinutes: z.number().int().positive(),
  tags: z.array(z.string()).min(1),
  /** Drives the contextual CTA: blog post -> case study -> service page -> Calendly. */
  mapsToCaseStudy: z.string().optional(),
  cta: ctaSchema.optional(),
});

export type MarketingPage = z.infer<typeof marketingPageSchema>;
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type Post = z.infer<typeof postSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type Stat = z.infer<typeof statSchema>;
export type Cta = z.infer<typeof ctaSchema>;
export type Fact = z.infer<typeof factSchema>;
export type FactLists = z.infer<typeof marketingPageSchema>["factLists"];
