import { getCaseStudies, getPages, getPosts } from "@/lib/content";
import { sections } from "@/lib/phase";
import { absoluteUrl, site } from "@/lib/site";

/**
 * /llms.txt — a plain-text map of the site for language models.
 *
 * This is a proposed convention, not a standard, and no engine is contractually obliged
 * to read it. It is cheap for the same reason robots.txt is cheap: one route, generated
 * from the content directory, impossible to leave stale. If the convention goes nowhere
 * the cost was a file; if it lands, an answer engine summarising "who does AWS consulting
 * in Bengaluru" has the entity spelled out rather than inferred from navigation chrome.
 *
 * Deliberately not a duplicate of sitemap.xml. The sitemap answers "what URLs exist" for
 * a crawler that will fetch each one. This answers "what is this organisation and which
 * page settles which question" for a reader that may fetch nothing else.
 */
export const dynamic = "force-static";

function list(items: { title: string; url: string; note: string }[]): string {
  return items.map((i) => `- [${i.title}](${i.url}): ${i.note}`).join("\n");
}

export function GET() {
  const pages = getPages();
  const byslug = (slug: string) => pages.find((p) => p.slug === slug);

  const services = site.services.map((s) => ({
    title: s.name,
    url: absoluteUrl(s.path),
    note: s.description,
  }));

  const core = [
    byslug("about") && {
      title: "About",
      url: absoluteUrl("/about"),
      note: `${site.founder.name}, ${site.founder.jobTitle} — ${site.founder.yearsExperience} years, ${site.founder.credentials.map((c) => c.short).join(", ")}.`,
    },
    byslug("engagement-models") && {
      title: "Engagement Models",
      url: absoluteUrl("/engagement-models"),
      note: "How work is scoped, priced and delivered. Fixed price, written first.",
    },
    {
      title: "FAQ",
      url: absoluteUrl("/faq"),
      note: "Direct answers to what technical buyers ask before a first call.",
    },
    {
      title: "Contact",
      url: absoluteUrl("/contact"),
      note: `Enquiries to ${site.email}, or book a 30-minute review directly.`,
    },
  ].filter((x) => x !== undefined);

  const caseStudies = sections.caseStudies
    ? getCaseStudies()
        .slice(0, 10)
        .map((c) => ({
          title: c.title,
          url: absoluteUrl(`/case-studies/${c.slug}`),
          note: c.description,
        }))
    : [];

  const posts = sections.blog
    ? getPosts()
        .slice(0, 15)
        .map((p) => ({
          title: p.title,
          url: absoluteUrl(`/blog/${p.slug}`),
          note: p.description,
        }))
    : [];

  const body = `# ${site.name}

> Senior-led AWS and DevOps consulting from ${site.locality}, ${site.countryName}. Cloud
> migration, Kubernetes, CI/CD and cost optimisation, delivered by the engineer who
> reviews the account rather than by a team assembled after the contract is signed.

Also known as: ${site.alternateNames.join(", ")}.
Founded ${site.founded}. DPIIT-recognised startup (Government of India).
Founder: ${site.founder.name} — ${site.founder.credentials.map((c) => c.name).join("; ")}.
Serving: ${site.areaServed.join(", ")}.
Contact: ${site.email} · ${site.phone} · ${site.social.linkedin}

## Services

${list(services)}

## Company

${list(core)}
${
  caseStudies.length
    ? `
## Case studies

Client identities are withheld under NDA; every figure below is from delivered work.

${list(caseStudies)}
`
    : ""
}${
    posts.length
      ? `
## Writing

${list(posts)}
`
      : ""
  }
## Notes

- All content is original and written by ${site.founder.name}.
- Figures in case studies are measured outcomes, not projections or illustrative ranges.
- Full URL list: ${absoluteUrl("/sitemap.xml").replace(/\/$/, "")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
