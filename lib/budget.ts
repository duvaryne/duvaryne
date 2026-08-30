/**
 * Deliberately its own module with no imports.
 *
 * The client form needs these labels; it must not need zod. Importing them from
 * lib/contact.ts would drag the schema — and therefore zod — into the browser bundle,
 * because `contactSchema = z.object(...)` is a module-level call the bundler cannot
 * prove is side-effect free.
 */
/**
 * Bands start at $15k because the lowest band you offer is a price signal, not a filter.
 * Listing "Under $5k" invited the enquiry that consumes the most scoping time for the
 * least revenue, and removing it does not stop those enquiries arriving — it stops the
 * form telling people that size of engagement is on the menu. The stated minimum next to
 * the field is what actually does the filtering.
 *
 * Existing rows in Neon still hold retired band labels. Nothing reads them back as an
 * enum, so old enquiries keep their original value and only new submissions are
 * validated against this list.
 */
export const BUDGET_BANDS = [ "$15k – $50k", "$50k – $150k", "$150k+", "Retainer (monthly)", "Not sure yet",
] as const;

export type BudgetBand = (typeof BUDGET_BANDS)[number];
