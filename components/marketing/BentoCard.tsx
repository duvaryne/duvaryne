import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/lib/content-schema";

/**
 * Bento grid card — SPEC §6.3 / §9.5.
 *
 * Three of the ten case studies are `featured` and render larger, so the grid itself
 * encodes which engagements are flagship. Structure is information, not decoration.
 */
export function BentoCard({
  caseStudy,
  large = false,
  className,
  headingLevel = 3,
}: {
  caseStudy: Pick<CaseStudy, "slug" | "h1" | "outcomeHeadline" | "stack" | "featured">;
  large?: boolean;
  className?: string;
  /**
   * Level for the card title. 3 is right on the home page, where the grid sits under a
   * section <h2>. The /case-studies/ grid has no section heading above it — the cards are
   * the first headings after the page <h1> — so it passes 2. h1 → h3 is a level skip and
   * fails WCAG 1.3.1 (axe `heading-order`); the level has to follow the context.
   */
  headingLevel?: 2 | 3;
}) {
  const { slug, h1, outcomeHeadline, stack } = caseStudy;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <Link
      href={`/case-studies/${slug}/`}
      className={cn( "group flex flex-col  border border-rule bg-surface p-7 transition-colors duration-200 hover:border-action",
        large && "lg:p-9",
        className,
      )}
    >
      {/* The GEO-extractable fact line, before any prose — SPEC §10.3. */}
      <p
        className={cn( "tabular font-medium leading-snug text-heading",
          large ? "text-[1.25rem] lg:text-[1.375rem]" : "text-[1.0625rem]",
        )}
      >
        {outcomeHeadline}
      </p>

      <Heading
        className={cn( "mt-4 flex-1 font-body font-normal leading-relaxed text-muted",
          large ? "text-[1rem]" : "text-[0.9375rem]",
        )}
      >
        {h1}
      </Heading>

      <ul className="mt-5 flex flex-wrap gap-1.5">
        {stack.slice(0, large ? 6 : 4).map((tech) => (
          <li
            key={tech}
            className="border border-rule px-2 py-0.5 text-[0.75rem] text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>

      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-action">
        Read the case study
        <ArrowRight
          size={15}
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
