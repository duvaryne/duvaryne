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
      className={cn(
        "not-prose my-7 flex gap-3.5 rounded-md border-l-[3px] px-5 py-4",
        isWarning
          ? "border-l-orange-500 bg-orange-050"
          : "border-l-blue-600 bg-blue-050",
      )}
    >
      <Icon
        size={18}
        aria-hidden
        className={cn(
          "mt-0.5 shrink-0",
          isWarning ? "text-[#b4530a]" : "text-blue-600",
        )}
      />
      <div className="text-[0.9375rem] leading-relaxed text-ink">
        {title ? <p className="mb-1 font-semibold">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}
