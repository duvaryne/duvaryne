import { Stat } from "./Stat";
import { cn } from "@/lib/utils";
import type { Stat as StatType } from "@/lib/content-schema";

export function StatGrid({
  stats,
  tone = "light",
  columns = 3,
  size = "md",
  className,
}: {
  stats: readonly StatType[];
  tone?: "light" | "dark";
  columns?: 2 | 3 | 4;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (!stats.length) return null;

  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  /* Drawn cells rather than gaps. A measured number reads as a specification when it
     sits in a ruled box and as a marketing claim when it floats in whitespace, and
     these are all sourced figures from the case studies. */
  return (
    <dl className={cn("grid-frame grid grid-cols-1", cols, className)}>
      {stats.map((s, i) => (
        <div key={`${s.value}-${i}`} className="px-5 py-7 lg:px-7 lg:py-8">
          {/* dt/dd carry the semantics; Stat carries the visual treatment. */}
          <dt className="sr-only">{s.label}</dt>
          <dd>
            <Stat value={s.value} label={s.label} source={s.source} tone={tone} size={size} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
