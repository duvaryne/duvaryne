/**
 * Deliberately its own module with no imports.
 *
 * The client form needs these labels; it must not need zod. Importing them from
 * lib/contact.ts would drag the schema — and therefore zod — into the browser bundle,
 * because `contactSchema = z.object(...)` is a module-level call the bundler cannot
 * prove is side-effect free.
 */
export const BUDGET_BANDS = [
  "Under $5k",
  "$5k – $15k",
  "$15k – $50k",
  "$50k+",
  "Retainer",
  "Not sure yet",
] as const;

export type BudgetBand = (typeof BUDGET_BANDS)[number];
