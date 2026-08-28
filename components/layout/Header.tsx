import Link from "next/link";
import { site } from "@/lib/site";
import { primaryNav } from "@/lib/nav";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NavDisclosure } from "./NavDisclosure";

/**
 * The single header. There is exactly one <nav> in the DOM site-wide — SPEC §6.5.
 *
 * Server component; only the mobile open/close state is client-side. The link list is
 * rendered once and shared between the desktop row and the mobile sheet.
 */
export function Header() {
  const links = (
    <nav aria-label="Primary" className="lg:flex lg:items-center lg:gap-8">
      <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-7">
        {primaryNav.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex min-h-11 items-center text-[0.9375rem] font-medium text-navy-900 transition-colors duration-150 hover:text-blue-600 lg:min-h-0"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <a
        href={site.calendly}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics="cta_book_clicked"
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-orange-500 px-4 text-[0.9375rem] font-semibold text-navy-900 transition-colors duration-150 hover:bg-[#ea6a0c] lg:mt-0"
      >
        Book a free review
      </a>
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur-sm">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center" aria-label={`${site.name} — home`}>
          <Logo />
        </Link>

        {/* Rendered exactly once. On desktop NavDisclosure's panel is forced visible by
            CSS; on mobile it collapses behind the toggle. One <nav> in the DOM, always. */}
        <NavDisclosure>{links}</NavDisclosure>
      </Container>
    </header>
  );
}
