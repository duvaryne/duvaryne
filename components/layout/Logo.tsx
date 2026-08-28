import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * PLACEHOLDER WORDMARK — SPEC I1 / §11.3.
 *
 * No vector logo has been supplied; only a raster PNG exists on the old site. SPEC's logo
 * rule is explicit: never approximate the Duvaryne mark with generated shapes. This is
 * therefore a typographic wordmark, not a drawn logo — it makes no attempt to imitate the
 * real mark and is safe to ship until the SVG arrives.
 *
 * TO REPLACE: drop the official file at public/brand/logo.svg and swap the <span> below
 * for <Image src="/brand/logo.svg" .../>. Nothing else in the codebase references the mark.
 */
export function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "font-display text-[1.0625rem] font-bold tracking-[-0.02em]",
        tone === "dark" ? "text-white" : "text-navy-900",
        className,
      )}
    >
      Duvaryne
      <span className="text-blue-600">
        {tone === "dark" ? <span className="text-blue-300">Edge</span> : "Edge"}
      </span>
      <span className="sr-only"> — {site.name}</span>
    </span>
  );
}
