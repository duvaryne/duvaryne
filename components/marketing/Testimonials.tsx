/**
 * Renders null while the array is empty — SPEC §9.1 / input I3.
 *
 * The section omits itself rather than shipping placeholder quotes. When 2-3 testimonials
 * arrive (anonymised is fine: "CTO, B2B SaaS, 40 engineers"), add them to the array below
 * and the section appears with no other change.
 */
export type Testimonial = {
  quote: string;
  attribution: string;
};

export const testimonials: Testimonial[] = [];

export function Testimonials({ items = testimonials }: { items?: Testimonial[] }) {
  if (!items.length) return null;

  return (
    <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t) => (
        <li
          key={t.attribution}
          className="rounded-lg border border-rule bg-white p-7"
        >
          <blockquote className="text-[1.0625rem] leading-relaxed text-ink">
            {t.quote}
          </blockquote>
          <p className="mt-5 text-[0.875rem] text-slate-600">{t.attribution}</p>
        </li>
      ))}
    </ul>
  );
}
