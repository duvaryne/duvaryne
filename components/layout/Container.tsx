import { cn } from "@/lib/utils";

/** 1200px max content width, 72px gutters desktop / 20px mobile — SPEC §6.3. */
export function Container({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[1200px] px-5 lg:px-[72px]", className)}>
      {children}
    </Tag>
  );
}
