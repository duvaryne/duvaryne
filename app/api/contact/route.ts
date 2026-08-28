import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact";
import { site } from "@/lib/site";
import { DatabaseNotConfiguredError, insertEnquiry } from "@/lib/db";
import { notifyEnquiry } from "@/lib/notify";

/**
 * Contact form handler.
 *
 * Neon is the system of record; email is only a notification. That ordering matters: the
 * visitor is told "received" the moment the row commits, so a mail outage can never lose
 * an enquiry or push someone into submitting twice.
 *
 * Server-side validation is authoritative; the client copy of the schema exists purely
 * for immediate feedback. Errors state what happened and what to do — never a bare
 * "something went wrong".
 */

async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // No secret configured (e.g. a preview deploy before Turnstile is wired): skip rather
  // than hard-fail, so the form stays testable. Production sets the key.
  if (!secret) return { ok: true as const, skipped: true };
  if (!token) return { ok: false as const, reason: "missing" };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.append("remoteip", ip);

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const data = (await res.json()) as { success: boolean };
    return data.success ? ({ ok: true } as const) : ({ ok: false, reason: "rejected" } as const);
  } catch {
    return { ok: false as const, reason: "unreachable" };
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "We could not read that submission. Please try again." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      {
        error: first?.message ?? "Please check the form and try again.",
        field: first?.path[0] ?? null,
      },
      { status: 400 },
    );
  }

  const { name, email, company, message, budget, turnstileToken, website } = parsed.data;

  // Honeypot tripped — accept silently so the bot does not learn it was caught.
  if (website) return NextResponse.json({ ok: true }, { status: 200 });

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip");

  const turnstile = await verifyTurnstile(turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json(
      {
        error:
          turnstile.reason === "unreachable"
            ? `We could not reach the spam-check service. Please try again in a moment, or email ${site.email} directly.`
            : "The spam check did not pass. Please reload the page and try again.",
      },
      { status: 400 },
    );
  }

  let id: number;
  try {
    id = await insertEnquiry({
      name,
      email,
      company: company || null,
      message,
      budget: budget || null,
      ip,
      userAgent: request.headers.get("user-agent"),
    });
  } catch (err) {
    if (err instanceof DatabaseNotConfiguredError) {
      console.error("[contact] DATABASE_URL is not set on this deployment");
      return NextResponse.json(
        {
          error: `Our contact form is not configured correctly right now. Please email ${site.email} directly and we will reply the same day.`,
        },
        { status: 503 },
      );
    }
    console.error(
      `[contact] enquiry insert failed: ${err instanceof Error ? err.message : String(err)}`,
    );
    return NextResponse.json(
      {
        error: `We could not save your message. Please email ${site.email} directly and we will reply the same day.`,
      },
      { status: 502 },
    );
  }

  // Stored. From here nothing may fail the request.
  const notified = await notifyEnquiry({ id, name, email, company, budget, message });
  if (!notified.sent) {
    console.warn(`[contact] enquiry #${id} stored but not emailed: ${notified.reason}`);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
