import { Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Used sparingly in blog posts — SPEC §8.2. */
export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: "note" | "warning";
  title?: string;
  children: React.ReactNode;
}) {
  const isWarning = type === "warning";
  const Icon = isWarning ? TriangleAlert : Info;

  return (
    <div
      className={cn( "not-prose my-7 flex gap-3.5  border-l-[3px] px-5 py-4",
        isWarning
          ? "border-l-accent bg-tint"
          : "border-l-action bg-tint",
      )}
    >
      <Icon
        size={18}
        aria-hidden
        className={cn( "mt-0.5 shrink-0",
          isWarning ? "text-accent-strong" : "text-action",
        )}
      />
      <div className="text-[0.9375rem] leading-relaxed text-fg">
        {title ? <p className="mb-1 font-semibold">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}
