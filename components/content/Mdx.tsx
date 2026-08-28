import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import { getMdxComponents } from "./mdx-components";
import type { Cta, FactLists } from "@/lib/content-schema";

/**
 * Code highlighting is mandatory — blog posts and case studies are technical.
 *
 * Shiki is loaded fine-grained rather than via its default bundle, which carries every
 * grammar it supports: 9.1 MB of languages, for a site that uses six. Cloudflare's free
 * tier caps a Worker at 3 MiB compressed and the full bundle put this build at 3.04 MiB —
 * over the limit for grammars nothing references.
 *
 * The JavaScript regex engine replaces the default Oniguruma one for the same reason: it
 * drops a WASM binary the Worker would otherwise have to carry.
 *
 * rehype-pretty-code cannot be used for this: it does `import { getSingletonHighlighter }
 * from "shiki"` at module scope, which drags in the whole bundle no matter what you pass
 * to its getHighlighter option. @shikijs/rehype/core takes an instance instead.
 *
 * Adding a language here is a deliberate act. An unlisted language renders unhighlighted
 * rather than failing, so check this list when a new code fence looks plain.
 */
const highlighter = createHighlighterCore({
  themes: [import("@shikijs/themes/github-light")],
  langs: [
    import("@shikijs/langs/bash"),
    import("@shikijs/langs/yaml"),
    import("@shikijs/langs/json"),
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/hcl"),
    import("@shikijs/langs/sql"),
  ],
  engine: createJavaScriptRegexEngine(),
});

const shikiOptions = {
  theme: "github-light",
  defaultLanguage: "bash",
  fallbackLanguage: "bash",
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
export async function Mdx({
  source,
  cta,
  factLists,
}: {
  source: string;
  cta?: Cta;
  factLists?: FactLists;
}) {
  // Awaited once here rather than per plugin invocation; createHighlighterCore returns a
  // promise and the module-level constant memoises it across renders.
  const shiki = await highlighter;

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
            [rehypeShikiFromHighlighter, shiki, shikiOptions],
          ],
        },
      }}
    />
  );
}
