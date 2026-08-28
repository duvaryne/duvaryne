import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";

import { getMdxComponents } from "./mdx-components";
import type { Cta, FactLists } from "@/lib/content-schema";

/** Code highlighting is mandatory — blog posts and case studies are technical. SPEC §2. */
const prettyCode: PrettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
  defaultLang: { block: "bash", inline: "plaintext" },
};

const autolink = {
  behavior: "append" as const,
  properties: {
    className: ["heading-anchor"],
    ariaLabel: "Link to this section",
    tabIndex: 0,
  },
  content: { type: "text" as const, value: " #" },
};

/**
 * Renders an MDX body as a server component. next-mdx-remote/rsc keeps this off the client
 * bundle entirely — content pages ship near-zero JavaScript.
 */
export function Mdx({
  source,
  cta,
  factLists,
}: {
  source: string;
  cta?: Cta;
  factLists?: FactLists;
}) {
  return (
    <MDXRemote
      source={source}
      components={getMdxComponents(cta, factLists)}
      options={{
        parseFrontmatter: false, // gray-matter already stripped it in lib/content.ts
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, autolink],
            [rehypePrettyCode, prettyCode],
          ],
        },
      }}
    />
  );
}
