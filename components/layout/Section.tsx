import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "paper" | "white" | "navy" | "tint";

const tones: Record<Tone, string> = {
  paper: "bg-ground text-fg",
  white: "bg-surface text-fg",
  // `on-inverse` switches the focus-ring colour so it still clears 3:1 against the dark ground.
  navy: "on-inverse bg-inverse text-on-inverse",
  tint: "bg-tint text-fg",
};

export function Section({
  tone = "paper",
  className,
  containerClassName,
  children,
  id,
  as: Tag = "section",
  bleed = false,
}: {
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  id?: string;
  as?: React.ElementType;
  /** Skip the Container when the child manages its own width. */
  bleed?: boolean;
}) {
  return (
    <Tag id={id} className={cn("py-16 lg:py-24", tones[tone], className)}>
      {bleed ? children : <Container className={containerClassName}>{children}</Container>}
    </Tag>
  );
}

/** Section heading + optional lede. Keeps the h2/lede rhythm identical site-wide. */
export function SectionHeader({
  heading,
  body,
  eyebrow,
  tone = "light",
  className,
  id,
}: {
  heading: string;
  body?: string;
  /** Short mono label above the heading. Carries the section's single saffron marker. */
  eyebrow?: string;
  tone?: "light" | "dark";
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("max-w-[52ch]", className)}>
      {eyebrow ? (
        <p
          className={cn(
            "marker-inline mb-5 font-mono text-[0.6875rem] uppercase tracking-[0.26em]",
            tone === "dark" ? "text-on-inverse-muted" : "text-muted",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn( "text-[2rem] lg:text-[2.375rem]",
          tone === "dark" ? "text-on-inverse" : "text-heading",
        )}
      >
        {heading}
      </h2>
      {body ? (
        <p
          className={cn( "mt-4 text-[1.0625rem] leading-relaxed",
            tone === "dark" ? "text-on-inverse/70" : "text-muted",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
