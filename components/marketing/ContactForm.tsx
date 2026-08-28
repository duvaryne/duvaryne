"use client";

import { useId, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, CheckCircle2, TriangleAlert } from "lucide-react";
import { BUDGET_BANDS } from "@/lib/budget";
import { site } from "@/lib/site";

/** Submit-state bar only appears after a click, so its chunk is never on the critical path. */
const ProgressBar = dynamic(
  () => import("@/components/ui/progress-bar").then((m) => m.ProgressBar),
  { ssr: false },
);

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

type Status = "idle" | "submitting" | "success" | "error";

type Payload = {
  name: string;
  email: string;
  company: string;
  message: string;
  budget: string;
  website: string;
  turnstileToken: string;
};

/** Messages are kept identical to the server's so the user never sees two wordings. */
function firstProblem(p: Payload): { field: string; message: string } | null {
  if (p.name.trim().length < 2) return { field: "name", message: "Please tell us your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim()))
    return { field: "email", message: "That email address does not look right." };
  if (p.message.trim().length < 20)
    return {
      field: "message",
      message: "Please give us at least a sentence or two so the first reply is useful.",
    };
  if (p.message.trim().length > 5000)
    return { field: "message", message: "Please keep this under 5,000 characters." };
  return null;
}

/**
 * Field chrome.
 *
 * The border is `border-muted` (pewter-400), not `border-rule`. Moonstone reads as a
 * hairline against the platinum ground at 1.21:1 — correct for a decorative divider,
 * but an input is an interactive control and its boundary needs 3:1 to be perceivable.
 * Pewter-400 clears it at 4.9:1 against the white field.
 */
const field =
  "mt-1.5 block w-full border border-muted bg-surface px-3.5 py-2.5 text-[1rem] text-fg transition-colors duration-150 placeholder:text-muted focus:border-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const payload: Payload = {
      name: data.name ?? "",
      email: data.email ?? "",
      company: data.company ?? "",
      message: data.message ?? "",
      budget: data.budget ?? "",
      website: data.website ?? "",
      turnstileToken: data["cf-turnstile-response"] ?? "",
    };

    // Immediate feedback only. lib/contact.ts is the authoritative schema and runs on the
    // server for every submission; it is deliberately not imported here, because shipping
    // zod to the browser costs ~13KB against the initial-JS budget for no security gain.
    const local = firstProblem(payload);
    if (local) {
      setStatus("error");
      setError(local.message);
      setFieldError(local.field);
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as { ok?: boolean; error?: string; field?: string };

      if (!res.ok) {
        setStatus("error");
        setError(body.error ?? "That did not go through. Please try again.");
        setFieldError(body.field ?? null);
        window.turnstile?.reset(widgetId.current ?? undefined);
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError(
        `We could not reach the server. Check your connection and try again, or email ${site.email} directly.`,
      );
      window.turnstile?.reset(widgetId.current ?? undefined);
    }
  }

  if (status === "success") {
    return (
      <div className="border border-rule bg-surface p-8">
        <CheckCircle2 size={26} className="text-accent" aria-hidden />
        <h2 className="mt-4 text-[1.375rem] text-heading">Message received</h2>
        <p className="mt-3 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted">
          It lands in {site.email} and a person reads it — usually the same working day. If it is
          urgent, book a slot directly and skip the queue.
        </p>
        <ol className="mt-6 space-y-2.5 text-[0.9375rem] text-muted">
          <li>
            <span className="tabular font-medium text-heading">01</span> &nbsp;We read
            it and reply with either questions or a proposed time.
          </li>
          <li>
            <span className="tabular font-medium text-heading">02</span> &nbsp;Thirty
            minutes on your architecture and your bill.
          </li>
          <li>
            <span className="tabular font-medium text-heading">03</span> &nbsp;Written
            scope and a fixed price, or an honest &ldquo;you do not need us yet&rdquo;.
          </li>
        </ol>
        <a
          href={site.calendly}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="cta_book_clicked"
          className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 bg-action px-5 text-[0.9375rem] font-semibold text-on-action transition-colors duration-150 hover:bg-action-hover"
        >
          Book the call now
          <ArrowRight size={16} aria-hidden />
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      data-analytics="contact_form_submitted"
      className="border border-rule bg-surface p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${id}-name`}
          name="name"
          label="Name"
          required
          autoComplete="name"
          invalid={fieldError === "name"}
        />
        <Field
          id={`${id}-email`}
          name="email"
          type="email"
          label="Work email"
          required
          autoComplete="email"
          invalid={fieldError === "email"}
        />
        <Field
          id={`${id}-company`}
          name="company"
          label="Company"
          autoComplete="organization"
          invalid={fieldError === "company"}
        />

        <div>
          <label
            htmlFor={`${id}-budget`}
            className="text-[0.875rem] font-medium text-heading"
          >
            Budget band <span className="font-normal text-muted">(optional)</span>
          </label>
          <select id={`${id}-budget`} name="budget" defaultValue="" className={field}>
            <option value="">Prefer not to say</option>
            {BUDGET_BANDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor={`${id}-message`}
          className="text-[0.875rem] font-medium text-heading"
        >
          What are you trying to fix? <span aria-hidden className="text-accent">*</span>
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={6}
          required
          aria-invalid={fieldError === "message" || undefined}
          placeholder="Your stack, what is going wrong, and what good would look like. The more specific, the more useful the first reply."
          className={field}
        />
      </div>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {siteKey ? (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="lazyOnload"
            onLoad={() => {
              if (widgetRef.current && window.turnstile && !widgetId.current) {
                widgetId.current = window.turnstile.render(widgetRef.current, {
                  sitekey: siteKey,
                  theme: "light",
                });
              }
            }}
          />
          <div ref={widgetRef} className="mt-5" />
        </>
      ) : null}

      {status === "submitting" ? (
        <div className="mt-6">
          {/* Indeterminate ProgressBar for submit state — SPEC §9.11. */}
          <ProgressBar value={0} indeterminate label="Sending your message" />
        </div>
      ) : null}

      {status === "error" && error ? (
        <p
          role="alert"
          className="mt-5 flex items-start gap-2.5 border-l-[3px] border-l-accent bg-tint px-4 py-3 text-[0.9375rem] text-fg"
        >
          <TriangleAlert size={17} className="mt-0.5 shrink-0 text-accent-strong" aria-hidden />
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-action px-6 text-[0.9375rem] font-semibold text-on-action transition-colors duration-150 hover:bg-action-hover disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        {status === "submitting" ? null : <ArrowRight size={16} aria-hidden />}
      </button>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
        We reply from {site.email}. We do not add you to a mailing list — see our{" "}
        <Link
          href="/legal/privacy/"
          className="text-action underline underline-offset-2"
        >
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required = false,
  autoComplete,
  invalid,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  invalid?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-[0.875rem] font-medium text-heading">
        {label}{" "}
        {required ? (
          <span aria-hidden className="text-accent">
            *
          </span>
        ) : (
          <span className="font-normal text-muted">(optional)</span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
        className={field}
      />
    </div>
  );
}
