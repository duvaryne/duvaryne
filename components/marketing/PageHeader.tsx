import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { formatDate } from "@/lib/seo";

export type Crumb = { name: string; path: string };

/**
 * The single H1 on every page — SPEC §6.5. Nothing else on a page may render an <h1>,
 * and the eyebrow above it is a <p>, not a stacked duplicate heading (defect 15).
 */
export function PageHeader({
  h1,
  eyebrow,
  lede,
  crumbs = [],
  updated,
  meta,
}: {
  h1: string;
  eyebrow?: string;
  lede?: string;
  crumbs?: Crumb[];
  updated?: Date;
  meta?: React.ReactNode;
}) {
  return (
    <div className="on-inverse bg-inverse pb-14 pt-10 text-on-inverse lg:pb-16 lg:pt-12">
      <Container>
        {crumbs.length ? (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1 text-[0.8125rem] text-on-inverse/60">
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center gap-1">
                  {i > 0 ? <ChevronRight size={13} aria-hidden className="text-on-inverse/35" /> : null}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-on-inverse/85">
                      {c.name}
                    </span>
                  ) : (
                    <Link
                      href={c.path}
                      className="transition-colors duration-150 hover:text-on-inverse"
                    >
                      {c.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.09em] text-on-inverse-muted">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="max-w-[20ch] text-[2.25rem] text-on-inverse lg:text-[2.5rem]">{h1}</h1>

        {lede ? (
          <p className="mt-5 max-w-[62ch] text-[1.125rem] leading-relaxed text-on-inverse/75">
            {lede}
          </p>
        ) : null}

        {meta ?? null}

        {updated ? (
          <p className="mt-7 text-[0.8125rem] text-on-inverse/50">
            Last updated <time dateTime={updated.toISOString()} className="tabular">{formatDate(updated)}</time>
          </p>
        ) : null}
      </Container>
    </div>
  );
}
