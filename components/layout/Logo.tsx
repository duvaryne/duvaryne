import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { Mark, type MarkTone } from "@/components/brand/Mark";

/**
 * The Duvaryne lockup.
 *
 * Four configurations are approved by the identity system; two of them are used on this
 * site. `horizontal` is the primary and is what the header carries. `stacked` is for
 * decks and signage and is available for the OG plates.
 *
 * Typography is fixed by the identity and is the part most likely to be "tidied" into
 * something wrong: the name is Sora at 200 tracked 0.42em, the descriptor is JetBrains
 * Mono tracked 0.4em. Both need a matching text-indent, because letter-spacing in CSS
 * adds trailing space after the final glyph and would otherwise push the whole lockup
 * off-centre by half a space.
 */
export function Logo({
  className,
  tone = "theme",
  variant = "horizontal",
}: {
  className?: string;
  tone?: MarkTone;
  variant?: "horizontal" | "stacked";
}) {
  const nameColour = tone === "dark" ? "text-on-inverse" : "text-heading";
  const subColour = tone === "dark" ? "text-on-inverse-muted" : "text-muted";

  const wordmark = (
    <span className={cn("block", variant === "stacked" && "text-center")}>
      <span
        className={cn(
          "block font-display text-[1.0625rem] font-extralight leading-none",
          nameColour,
        )}
        style={{ letterSpacing: "0.42em", textIndent: "0.42em" }}
      >
        {site.wordmark}
      </span>
      <span
        className={cn(
          "mt-1.5 hidden font-mono text-[0.5rem] leading-none sm:block",
          subColour,
        )}
        style={{ letterSpacing: "0.4em", textIndent: "0.4em" }}
      >
        {site.wordmarkSub}
      </span>
    </span>
  );

  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center gap-3", className)}>
        <Mark size={52} tone={tone} />
        {wordmark}
        <span className="sr-only">{site.name}</span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Mark size={34} tone={tone} />
      {/* The hairline is part of the lockup, not decoration between two things. */}
      <span
        aria-hidden
        className={cn("h-8 w-px", tone === "dark" ? "bg-inverse-rule" : "bg-rule")}
      />
      {wordmark}
      <span className="sr-only">{site.name}</span>
    </span>
  );
}
