import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Cta } from "@/lib/content-schema";

/**
 * One call-to-action definition per page, read from that page's own frontmatter — SPEC §8.2.
 * <CTA /> in MDX takes no props; the MDX provider injects the page's `cta` block.
 *
 * Orange discipline (SPEC §6.1): --color-accent appears on the primary button here and
 * nowhere else on the site. Not on icons, not on underlines, not on badges.
 */
export function CTA({ cta, className }: { cta?: Cta; className?: string }) {
  const block: Cta = cta ?? {
    heading: "Start with the bill, not a proposal",
    body: "Thirty minutes on your architecture and your Cost and Usage Report. You leave with the three largest savings in your account, quantified. If there is nothing worth doing, we will tell you.",
    buttonLabel: "Book a free 30-minute review",
    href: site.calendly,
  };

  const external = block.href.startsWith("http");

  return (
    <aside
      className={cn( "on-inverse not-prose my-14  bg-inverse px-6 py-10 text-on-inverse sm:px-10",
        className,
      )}
    >
      <h2 className="max-w-[24ch] text-[1.5rem] text-on-inverse lg:text-[1.75rem]">
        {block.heading}
      </h2>
      <p className="mt-4 max-w-[58ch] text-[1.0625rem] leading-relaxed text-on-inverse/75">
        {block.body}
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        {external ? (
          <a
            href={block.href}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="cta_book_clicked"
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-action px-5 text-[0.9375rem] font-semibold text-on-action transition-colors duration-150 hover:bg-action-hover"
          >
            {block.buttonLabel}
            <ArrowRight size={16} aria-hidden />
          </a>
        ) : (
          <Link
            href={block.href}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-action px-5 text-[0.9375rem] font-semibold text-on-action transition-colors duration-150 hover:bg-action-hover"
          >
            {block.buttonLabel}
            <ArrowRight size={16} aria-hidden />
          </Link>
        )}

        <a
          href={`mailto:${site.email}`}
          className="inline-flex min-h-11 items-center justify-center text-[0.9375rem] font-medium text-on-inverse/80 underline-offset-4 transition-colors duration-150 hover:text-on-inverse hover:underline sm:px-2"
        >
          {site.email}
        </a>
      </div>
    </aside>
  );
}
