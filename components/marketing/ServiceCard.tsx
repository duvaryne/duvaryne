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
      className="group flex flex-col rounded-lg border border-rule bg-white p-7 transition-colors duration-200 hover:border-blue-600"
    >
      <h3 className="text-[1.25rem] text-navy-900">{title}</h3>

      <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-slate-600">
        {summary}
      </p>

      {proof ? (
        <p className="tabular mt-5 text-[0.9375rem] font-medium text-navy-900">
          {proof}
        </p>
      ) : null}

      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-blue-600">
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
