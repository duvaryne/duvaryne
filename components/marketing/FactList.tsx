import { cn } from "@/lib/utils";

/**
 * Label/value fact pairs — the product summary blocks on /products/.
 *
 * These used to be markdown tables. GFM cannot express a table without a header row, so the
 * source carried a literal `| | |` and rendered two empty `<th>` cells. That is four axe
 * `empty-table-header` violations, and worse in practice: a screen reader announces the
 * blank column header before every single value.
 *
 * The data was never tabular — it is label/value pairs — so `<dl>` is both the accessible
 * markup and the more extractable one for answer engines (SPEC §10.3). Same shape as
 * StatGrid, which reaches for `<dl>` for the same reason.
 */
export function FactList({
  facts,
  className,
}: {
  facts: readonly { label: string; value: string }[];
  className?: string;
}) {
  if (!facts.length) return null;

  return (
    // not-prose: this renders inside MDX bodies; prose spacing must not reach it.
    <dl className={cn("not-prose my-7 border-t border-rule", className)}>
      {facts.map((f) => (
        <div
          key={f.label}
          className="flex flex-col gap-1 border-b border-rule py-3 sm:flex-row sm:gap-6"
        >
          <dt className="text-[0.9375rem] font-medium text-navy-900 sm:w-44 sm:shrink-0">
            {f.label}
          </dt>
          <dd className="text-[0.9375rem] leading-relaxed text-slate-600">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}
