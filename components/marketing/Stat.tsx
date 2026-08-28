import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudyHref } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The signature type rule — SPEC §6.2. Every quantity on this site is set in IBM Plex Mono
 * with tabular figures, so outcomes read as instrument readings rather than marketing claims.
 *
 * `source` is a case-study slug. When that study is in the build the value links to it,
 * which is what enforces "no unsourced claims". When it is not (Phase 1 production, where
 * case studies are gated out) the number still renders but does not link to a 404.
 */
export function Stat({
  value,
  label,
  source,
  tone = "light",
  size = "md",
  className,
}: {
  value: string;
  label: string;
  source?: string;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const href = caseStudyHref(source);

  const valueSize = {
    sm: "text-[1.5rem]",
    md: "text-[2rem] lg:text-[2.25rem]",
    lg: "text-[2.5rem] lg:text-[3rem]",
  }[size];

  const body = (
    <>
      <span
        className={cn( "tabular block font-medium leading-none tracking-[-0.01em]",
          valueSize,
          tone === "dark" ? "text-on-inverse" : "text-heading",
        )}
      >
        {value}
      </span>
      <span
        className={cn( "mt-2.5 block text-[0.9375rem] leading-snug",
          tone === "dark" ? "text-on-inverse/70" : "text-muted",
        )}
      >
        {label}
      </span>
      {href ? (
        <span
          className={cn( "mt-3 inline-flex items-center gap-1 text-[0.8125rem] font-medium",
            tone === "dark" ? "text-on-inverse-muted" : "text-action",
          )}
        >
          Read the case study
          <ArrowUpRight size={13} aria-hidden />
        </span>
      ) : null}
    </>
  );

  const shell = cn(
    // not-prose: this renders inside MDX bodies; prose link styling must not reach it. "not-prose block border-l-2 pl-5",
    tone === "dark" ? "border-inverse-rule" : "border-rule",
    href && "transition-colors duration-150",
    href && (tone === "dark" ? "hover:border-decor" : "hover:border-action"),
    className,
  );

  return href ? (
    <Link href={href} className={shell}>
      {body}
    </Link>
  ) : (
    <div className={shell}>{body}</div>
  );
}
