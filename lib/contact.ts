import { z } from "zod";
import { BUDGET_BANDS } from "./budget";

/**
 * Server-side contract for the contact form. This is the authoritative validation; the
 * client does a lightweight equivalent purely for immediate feedback and never imports
 * this module (see lib/budget.ts for why).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  email: z.string().trim().email("That email address does not look right.").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please give us at least a sentence or two so the first reply is useful.")
    .max(5000, "Please keep this under 5,000 characters."),
  budget: z.enum(BUDGET_BANDS).optional().or(z.literal("")),
  turnstileToken: z.string().optional(),
  /** Honeypot. Real users never see this field, so anything in it is a bot. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactPayload = z.infer<typeof contactSchema>;
