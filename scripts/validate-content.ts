/**
 * Content checks that zod cannot express — run with `pnpm content:validate`.
 *
 * zod already fails the build on a bad title or description (SPEC §8.1). This catches the
 * softer problems: FAQ answers outside the featured-snippet sweet spot, <Stat source="…">
 * pointing at a case study that does not exist, and blog posts mapped to a missing study.
 *
 * Warnings do not fail; errors exit non-zero.
 */
import { getCaseStudies, getPages, getPosts } from "../lib/content";

const errors: string[] = [];
const warnings: string[] = [];

function words(s: string) {
  return s.trim().split(/\s+/).length;
}

const caseStudySlugs = new Set(getCaseStudies().map((c) => c.slug));
const postSlugs = new Set(getPosts().map((p) => p.slug));

const rel = (p: string) => p.replace(`${process.cwd()}/`, "");

/* FAQ answers: 40-60 words is the featured-snippet sweet spot; warn above 90. SPEC §8.1. */
for (const entry of [...getPages(), ...getCaseStudies(), ...getPosts()]) {
  for (const faq of entry.faqs) {
    const n = words(faq.a);
    if (n > 90) {
      warnings.push(`${rel(entry.filePath)}: FAQ answer is ${n} words (>90): "${faq.q}"`);
    }
  }

  /* Every <Stat source="…"> and relatedCaseStudies entry must resolve. */
  for (const slug of entry.relatedCaseStudies) {
    if (!caseStudySlugs.has(slug)) {
      warnings.push(`${rel(entry.filePath)}: relatedCaseStudies -> unknown "${slug}"`);
    }
  }
  for (const slug of entry.relatedPosts) {
    if (!postSlugs.has(slug)) {
      warnings.push(`${rel(entry.filePath)}: relatedPosts -> unknown "${slug}"`);
    }
  }
  for (const stat of entry.stats) {
    if (stat.source && !caseStudySlugs.has(stat.source)) {
      warnings.push(`${rel(entry.filePath)}: stat source -> unknown "${stat.source}"`);
    }
  }

  /* An MDX body must not introduce a second <h1>: the template owns the only one. */
  if (/^#\s/m.test(entry.body)) {
    errors.push(`${rel(entry.filePath)}: body contains an H1 ("# "); the template renders it`);
  }
}

/* The NDA line is a standing commitment on every case study — SPEC §8.4. */
for (const cs of getCaseStudies()) {
  if (!cs.body.includes("withheld under NDA")) {
    errors.push(`${rel(cs.filePath)}: missing the standing NDA line`);
  }
  if (!cs.body.includes("What we would do differently")) {
    errors.push(`${rel(cs.filePath)}: missing "What we would do differently"`);
  }
}

/* mapsToCaseStudy drives the contextual CTA — a broken one silently drops it. */
for (const post of getPosts()) {
  if (post.mapsToCaseStudy && !caseStudySlugs.has(post.mapsToCaseStudy)) {
    errors.push(`${rel(post.filePath)}: mapsToCaseStudy -> unknown "${post.mapsToCaseStudy}"`);
  }
}

const counts = {
  pages: getPages().length,
  caseStudies: getCaseStudies().length,
  posts: getPosts().length,
  faqs: [...getPages(), ...getCaseStudies(), ...getPosts()].reduce(
    (n, e) => n + e.faqs.length,
    0,
  ),
};

console.log(
  `Content: ${counts.pages} pages · ${counts.caseStudies} case studies · ` +
    `${counts.posts} posts · ${counts.faqs} FAQs`,
);

for (const w of warnings) console.warn(`  warn  ${w}`);
for (const e of errors) console.error(`  ERROR ${e}`);

if (errors.length) {
  console.error(`\n${errors.length} error(s).`);
  process.exit(1);
}
console.log(warnings.length ? `\n${warnings.length} warning(s), no errors.` : "\nAll checks passed.");
