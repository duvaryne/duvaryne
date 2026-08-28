import { getPosts } from "@/lib/content";
import { sections } from "@/lib/phase";
import { absoluteUrl, site } from "@/lib/site";

/** Blog distribution feed — SPEC §10.5. */
export const dynamic = "force-static";

function escapeXml(s: string) {
  return s.replace(
    /[<>&'"]/g,
    (c) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c] as string,
  );
}

export function GET() {
  const posts = sections.blog ? getPosts() : [];
  const self = absoluteUrl("/rss.xml").replace(/\/$/, "");

  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${absoluteUrl(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/blog/${p.slug}`)}</guid>
      <description>${escapeXml(p.description)}</description>
      <pubDate>${p.published.toUTCString()}</pubDate>
      <dc:creator>${escapeXml(p.author)}</dc:creator>
${p.tags.map((t) => `      <category>${escapeXml(t)}</category>`).join("\n")}
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(site.name)} — Engineering Blog</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>Production notes on AWS, Kubernetes, DevOps and cloud cost from ${escapeXml(site.shortName)}.</description>
    <language>en-IN</language>
    <lastBuildDate>${(posts[0]?.published ?? new Date()).toUTCString()}</lastBuildDate>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
