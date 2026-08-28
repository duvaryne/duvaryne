import Link from "next/link";
import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import { ArrowUpRight } from "lucide-react";

import { Stat } from "@/components/marketing/Stat";
import { StatGrid } from "@/components/marketing/StatGrid";
import { CTA } from "@/components/marketing/CTA";
import { Callout } from "@/components/marketing/Callout";
import { FactList } from "@/components/marketing/FactList";
import type { Cta, FactLists } from "@/lib/content-schema";

/**
 * MDX component registry — SPEC §8.2.
 *
 * `pageCta` is closed over so that <CTA /> in a body needs no props: it always resolves to
 * the `cta` block in that page's own frontmatter. One CTA definition per page.
 */
export function getMdxComponents(pageCta?: Cta, factLists?: FactLists): MDXComponents {
  return {
    Stat,
    StatGrid,
    Callout,
    // Resolved by key from frontmatter — see marketingPageSchema.factLists for why the
    // data cannot travel as a JSX expression attribute.
    FactList: ({ name }: { name?: string }) => (
      <FactList facts={(name && factLists?.[name]) || []} />
    ),
    CTA: () => <CTA cta={pageCta} />,

    a: ({ href = "", children, ...props }) => {
      const external = /^https?:\/\//.test(href) && !href.includes("duvaryne.com");

      if (external) {
        return (
          // Outbound citation to primary sources raises reciprocal citation odds — SPEC §10.3.
          <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
            {children}
            <ArrowUpRight size={13} className="ml-0.5 inline-block align-baseline" aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        );
      }

      if (href.startsWith("#")) {
        return (
          <a href={href} {...props}>
            {children}
          </a>
        );
      }

      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    },

    img: ({ src, alt, width, height }) => {
      if (typeof src !== "string") return null;
      return (
        <Image
          src={src}
          // Alt is mandatory upstream: caseStudySchema requires a 40-char diagramAlt (defect 9).
          alt={alt ?? ""}
          width={Number(width) || 1600}
          height={Number(height) || 900}
          className="my-8 h-auto w-full border border-rule bg-surface"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      );
    },

    // Wide tables scroll inside their own container; the page body never scrolls sideways.
    table: ({ children, ...props }) => (
      <div className="my-7 overflow-x-auto">
        <table {...props}>{children}</table>
      </div>
    ),
  };
}
