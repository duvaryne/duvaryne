import Link from "next/link";
import { Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { site } from "@/lib/site";
import { legalNav, primaryNav, serviceNav } from "@/lib/nav";
import { Container } from "./Container";
import { Logo } from "./Logo";

/**
 * The single footer. Every value comes from lib/site.ts — SPEC §5.3.
 *
 * Fixes carried by this one component:
 *   defect 2  — LinkedIn was "http://inkedin.com/..." (missing the l), dead link
 *   defect 6  — /project/ showed a different phone number to every other page
 *   defect 10 — LinkedIn pointed at /company/105586850/admin/dashboard/, which 404s for visitors
 *   defect 12 — copyright year hardcoded to 2025; it is computed below
 *   defect 16 — stray "creative solution" text leaking above the footer
 */
export function Footer() {
  const year = new Date().getFullYear();

  // Derived from lib/site.ts rather than listed here, so removing a network from the
  // brand cannot leave a dead icon in the footer — the original site shipped exactly
  // that bug twice.
  const socialMeta = {
    linkedin: { label: "LinkedIn", Icon: Linkedin },
    x: { label: "X", Icon: Twitter },
  } as const;

  const socials = (Object.keys(socialMeta) as (keyof typeof socialMeta)[])
    .filter((key) => Boolean(site.social[key]))
    .map((key) => ({ href: site.social[key], ...socialMeta[key] }));

  return (
    <footer className="on-inverse bg-inverse-deep text-on-inverse/70">
      <Container className="py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:pr-6">
            <Logo tone="dark" />
            <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed">
              Senior-led AWS and DevOps consulting from {site.locality}. We cut cloud bills,
              ship pipelines that deploy on a Friday, and hand it over as code you own.
            </p>
            <ul className="mt-5 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center border border-inverse-rule transition-colors duration-150 hover:border-decor hover:text-on-inverse"
                  >
                    <Icon size={17} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <FooterColumn title="Services" links={serviceNav} />
          <FooterColumn title="Company" links={primaryNav} />

          <div>
            <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-on-inverse">
              Contact
            </h2>
            <ul className="mt-4 space-y-3 text-[0.9375rem]">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-1 shrink-0" aria-hidden />
                <span>
                  {site.locality}, {site.region}, {site.countryName}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-1 shrink-0" aria-hidden />
                {/* The ONE phone number. Nothing else appears anywhere on the site. */}
                <a
                  href={site.phoneHref}
                  className="tabular transition-colors duration-150 hover:text-on-inverse"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-1 shrink-0" aria-hidden />
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors duration-150 hover:text-on-inverse"
                >
                  {site.email}
                </a>
              </li>
            </ul>

            <a
              href={site.calendly}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics="cta_book_clicked"
              className="mt-6 inline-flex min-h-11 items-center justify-center bg-action px-4 text-[0.9375rem] font-semibold text-on-action transition-colors duration-150 hover:bg-action-hover"
            >
              Book a free 30-minute review
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-inverse-rule pt-6 text-[0.875rem] md:flex-row md:items-center md:justify-between">
          {/* Computed, never hardcoded — defect 12. */}
          <p>
            © <span className="tabular">{year}</span> {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors duration-150 hover:text-on-inverse"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-on-inverse">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="transition-colors duration-150 hover:text-on-inverse"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
