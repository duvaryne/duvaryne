import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "paper" | "white" | "navy" | "tint";

const tones: Record<Tone, string> = {
  paper: "bg-paper text-ink",
  white: "bg-white text-ink",
  // `on-navy` switches the focus-ring colour so it still clears 3:1 against the dark ground.
  navy: "on-navy bg-navy-800 text-white",
  tint: "bg-blue-050 text-ink",
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
  tone = "light",
  className,
  id,
}: {
  heading: string;
  body?: string;
  tone?: "light" | "dark";
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("max-w-[52ch]", className)}>
      <h2
        id={id}
        className={cn(
          "text-[1.75rem] lg:text-[2rem]",
          tone === "dark" ? "text-white" : "text-navy-900",
        )}
      >
        {heading}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-4 text-[1.0625rem] leading-relaxed",
            tone === "dark" ? "text-white/70" : "text-slate-600",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
