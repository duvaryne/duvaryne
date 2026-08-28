import type { Metadata } from "next";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { PageHeader } from "@/components/marketing/PageHeader";
import { ContactForm } from "@/components/marketing/ContactForm";
import { CalendlyEmbed } from "@/components/marketing/CalendlyEmbed";
import { JsonLd } from "@/components/seo/JsonLd";

import { site } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, localBusinessSchema, webPageSchema } from "@/lib/schema-org";

const UPDATED = new Date("2026-08-06");

export const metadata: Metadata = buildMetadata({
  title: "Contact Duvaryne | AWS & DevOps, Bengaluru",
  description:
    "Talk to the engineer who would do the work. Send a message or book a free 30-minute review of your AWS architecture and bill. Bengaluru, working across India, US and EU.",
  path: "/contact",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact/" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        h1="Talk to an engineer"
        eyebrow="Contact"
        lede="No account managers, no discovery call about a discovery call. Tell us what is broken and you will get a technical reply from the person who would fix it."
        crumbs={crumbs}
      />

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
          <div>
            <h2 className="sr-only">Send a message</h2>
            <ContactForm />
          </div>

          <div>
            {/* NAP block — every value from lib/site.ts, so the phone number here is the
                same one in the footer and in LocalBusiness JSON-LD (defects 6, 7). */}
            <h2 className="text-[1.25rem] text-navy-900">Duvaryne LLP</h2>
            <ul className="mt-5 space-y-4 text-[1rem]">
              <li className="flex items-start gap-3">
                <MapPin size={17} className="mt-1 shrink-0 text-slate-600" aria-hidden />
                <span className="text-ink">
                  {site.locality}, {site.region}
                  <br />
                  {site.countryName}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={17} className="mt-1 shrink-0 text-slate-600" aria-hidden />
                <a
                  href={site.phoneHref}
                  className="tabular text-blue-600 transition-colors duration-150 hover:text-blue-700"
                >
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={17} className="mt-1 shrink-0 text-slate-600" aria-hidden />
                <a
                  href={`mailto:${site.email}`}
                  className="text-blue-600 transition-colors duration-150 hover:text-blue-700"
                >
                  {site.email}
                </a>
              </li>
            </ul>

            <ul className="mt-6 flex gap-2">
              <li>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-rule text-slate-600 transition-colors duration-150 hover:border-blue-600 hover:text-blue-600"
                >
                  <Linkedin size={17} aria-hidden />
                </a>
              </li>
              <li>
                <a
                  href={site.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-rule text-slate-600 transition-colors duration-150 hover:border-blue-600 hover:text-blue-600"
                >
                  <Github size={17} aria-hidden />
                </a>
              </li>
            </ul>

            <dl className="mt-8 space-y-4 border-t border-rule pt-8 text-[0.9375rem]">
              <div>
                <dt className="font-medium text-navy-900">Response time</dt>
                <dd className="mt-1 text-slate-600">
                  Same working day, Monday to Friday, IST.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-navy-900">Where we work</dt>
                <dd className="mt-1 text-slate-600">
                  Across India, and remotely with teams in the US and EU. Primary AWS regions{" "}
                  <span className="tabular">ap-south-1</span> and{" "}
                  <span className="tabular">ap-south-2</span>.
                </dd>
              </div>
              <div>
                <dt className="font-medium text-navy-900">What to bring</dt>
                <dd className="mt-1 text-slate-600">
                  Your architecture, and read-only access to your Cost and Usage Report if the
                  bill is the problem.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      <Section tone="white">
        <div className="mx-auto max-w-[720px]">
          <h2 className="text-center text-[1.75rem] text-navy-900">
            Or skip the form
          </h2>
          <p className="mx-auto mt-3 max-w-[52ch] text-center text-[1.0625rem] leading-relaxed text-slate-600">
            Thirty minutes, free, with the engineer who would do the work.
          </p>
          <div className="mt-9">
            <CalendlyEmbed />
          </div>
        </div>
      </Section>

      <JsonLd
        json={graph(
          webPageSchema({
            type: "ContactPage",
            title: "Contact Duvaryne",
            description:
              "Talk to the engineer who would do the work. Send a message or book a free 30-minute review of your AWS architecture and bill.",
            path: "/contact",
            updated: UPDATED,
          }),
          localBusinessSchema(),
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  );
}
