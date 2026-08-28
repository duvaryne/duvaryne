"use client";

import { useMemo, useState } from "react";
import { BentoCard } from "./BentoCard";
import { cn } from "@/lib/utils";

type Item = {
  slug: string;
  h1: string;
  outcomeHeadline: string;
  stack: string[];
  featured: boolean;
};

/**
 * Bento hub — SPEC §9.5. Three featured cards render larger, so the grid itself encodes
 * which engagements are flagship.
 *
 * Filtering is client-side with no router churn: changing a filter must not push history
 * entries or trigger a navigation, because the whole list is already in the payload.
 */
export function CaseStudyGrid({ studies }: { studies: Item[] }) {
  const [active, setActive] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of studies) {
      for (const tech of s.stack) counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
    return [...counts.entries()]
      .filter(([, n]) => n > 1)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([tech]) => tech);
  }, [studies]);

  const visible = active ? studies.filter((s) => s.stack.includes(active)) : studies;

  return (
    <>
      {tags.length ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[0.8125rem] font-medium text-muted">
            Filter by stack
          </span>
          <FilterChip label="All" active={active === null} onClick={() => setActive(null)} />
          {tags.map((tag) => (
            <FilterChip
              key={tag}
              label={tag}
              active={active === tag}
              onClick={() => setActive(active === tag ? null : tag)}
            />
          ))}
        </div>
      ) : null}

      <p aria-live="polite" className="tabular mt-5 text-[0.875rem] text-muted">
        {visible.length} of {studies.length} engagements
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((s) => (
          <BentoCard
            key={s.slug}
            caseStudy={s}
            large={s.featured}
            // No section heading sits between the page <h1> and these cards, so their
            // titles are the h2 level. Leaving the default h3 skips a level (defect: axe
            // heading-order, caught the first time CI scanned this route).
            headingLevel={2}
            // Featured cards span two columns on desktop — structure as information.
            className={s.featured ? "lg:col-span-2" : undefined}
          />
        ))}
      </div>
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn( "min-h-9  border px-3.5 text-[0.8125rem] font-medium transition-colors duration-150",
        active
          ? "border-inverse bg-inverse text-on-inverse"
          : "border-rule bg-surface text-muted hover:border-action hover:text-action",
      )}
    >
      {label}
    </button>
  );
}
