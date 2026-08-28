import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { primaryNav } from "@/lib/nav";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <Container className="py-24 lg:py-32">
      <p className="tabular text-[0.875rem] font-medium text-blue-600">404</p>
      <h1 className="mt-4 max-w-[18ch] text-[2.25rem] text-navy-900">
        That page does not exist
      </h1>
      <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-relaxed text-slate-600">
        The link may be out of date, or the page may have moved during our rebuild. Everything
        below still works.
      </p>

      <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
        {primaryNav.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[0.9375rem] font-medium text-blue-600 transition-colors duration-150 hover:text-blue-700"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-[0.9375rem] text-slate-600">
        Looking for something specific?{" "}
        <a
          href={`mailto:${site.email}`}
          className="text-blue-600 underline underline-offset-2"
        >
          {site.email}
        </a>
      </p>
    </Container>
  );
}
