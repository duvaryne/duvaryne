import { site } from "./site";

/**
 * Best-effort enquiry notification over HTTP.
 *
 * Deliberately not SMTP: nodemailer needs a raw TCP socket, which a Cloudflare Worker
 * does not have. Resend's REST API is a plain fetch and works inside the runtime.
 *
 * Every failure here is swallowed and logged. The enquiry is already durable in Neon by
 * the time this runs, so a bounced notification must never turn a successful submission
 * into an error for the visitor — it would make them submit again and create duplicates.
 */
export async function notifyEnquiry(input: {
  id: number;
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
}): Promise<{ sent: boolean; reason?: string }> {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.NOTIFY_FROM?.trim();
  // `||`, not `??`: an env var set to an empty string is a real deployment mistake, and
  // `??` would happily pass "" through as the recipient. Empty means "not configured".
  const to = process.env.NOTIFY_TO?.trim() || site.email;

  if (!key || !from) return { sent: false, reason: "not-configured" };

  const lines = [
    `Name:    ${input.name}`,
    `Email:   ${input.email}`,
    input.company ? `Company: ${input.company}` : null,
    input.budget ? `Budget:  ${input.budget}` : null,
    `Ref:     #${input.id}`, "",
    input.message,
  ].filter((l): l is string => l !== null);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`, "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${site.shortName} Website <${from}>`,
        to: [to],
        reply_to: input.email,
        subject: `Enquiry from ${input.name}${input.company ? ` (${input.company})` : ""}`,
        text: lines.join("\n"),
      }),
    });

    if (!res.ok) {
      return { sent: false, reason: `resend ${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err instanceof Error ? err.message : "fetch failed" };
  }
}
