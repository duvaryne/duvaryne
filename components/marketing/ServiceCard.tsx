import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ServiceCard({
  title,
  href,
  summary,
  proof,
}: {
  title: string;
  href: string;
  summary: string;
  proof?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col border border-rule bg-surface p-7 transition-colors duration-200 hover:border-action"
    >
      <h3 className="text-[1.25rem] text-heading">{title}</h3>

      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">
        {summary}
      </p>

      {proof ? (
        <p className="tabular mt-5 text-[0.9375rem] font-medium text-heading">
          {proof}
        </p>
      ) : null}

      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-action">
        Read more
        <ArrowRight
          size={15}
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
