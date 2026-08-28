/**
 * Route-section gating.
 *
 * The site launched as Wave 0 + Phase 1, with case studies, the blog, /products/ and
 * /engagement-models/ built but excluded from production. All of it is now promoted, so
 * both sections below are on and every content file carries `draft: false`.
 *
 * The mechanism is kept rather than deleted: it is how any future page gets written,
 * reviewed on a preview deployment and merged without appearing on the live site. Set
 * `draft: true` in a file's frontmatter to hold it back, and flip the relevant section
 * here to false to withhold an entire route.
 *
 *     NEXT_PUBLIC_INCLUDE_DRAFTS=true   # render draft: true files too (set on Preview)
 *     (unset)                           # drafts hidden (Production)
 */
export const INCLUDE_DRAFTS = process.env.NEXT_PUBLIC_INCLUDE_DRAFTS === "true";

/**
 * Whole-route gates for composed TSX sections that have no frontmatter of their own.
 * When one is false the route 404s and disappears from the nav, the sitemap and every
 * internal link — production must never contain a link to a page it does not serve.
 */
export const sections = {
  caseStudies: true,
  blog: true,
} as const;

export type Sections = typeof sections;
