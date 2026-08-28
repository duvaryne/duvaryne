# duvaryne.com

Marketing site for **Duvaryne LLP** — AWS and DevOps consulting, Bengaluru.
Next.js 16 (App Router) on Cloudflare Workers, with Neon Postgres behind the contact form.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router, React 19 |
| Styling | Tailwind CSS v4 (CSS-first, no `tailwind.config`) |
| Content | MDX in `content/`, frontmatter validated by zod at build time |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` |
| Database | Neon Postgres over HTTP (`@neondatabase/serverless`) |
| Spam | Cloudflare Turnstile + honeypot |
| Notifications | Resend HTTP API (optional) |

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in DATABASE_URL to exercise the contact form
pnpm dev
```

## Scripts

| Script | Does |
|---|---|
| `pnpm dev` | Next dev server on :3000 |
| `pnpm check` | typecheck → lint → build. Run before pushing. |
| `pnpm cf:build` | Production build + OpenNext bundle |
| `pnpm cf:preview` | Build, populate cache, serve the real Worker on :8787 |
| `pnpm cf:deploy` | Build, populate remote cache, deploy |
| `pnpm db:init` | Create the `enquiries` table (idempotent) |
| `pnpm content:validate` | Check frontmatter without a full build |

`pnpm cf:preview` runs the actual Worker in workerd. Anything runtime-specific — the
contact route, the incremental cache — must be verified there, not under `pnpm dev`.

## Layout

```
app/            routes; (marketing)/[...slug] renders content/pages/**
components/     layout/, marketing/, content/ (MDX), seo/, ui/
content/        pages/, case-studies/ (10), blog/ (10 stubs), data/home.ts
lib/            site.ts (brand facts), seo.ts, schema-org.ts, db.ts, notify.ts
docs/           DEPLOYMENT.md
```

**`lib/site.ts` is the single source of truth** for the name, phone, email, socials and
credentials. Nothing may re-type those values into a component — the predecessor site
shipped three different phone numbers and two LinkedIn URLs because they lived in
templates.

## Content rules, enforced by the build

`lib/content-schema.ts` fails the build rather than shipping a bad page:

- `title` ≤ 60 characters
- `description` 150–160 characters, hand-written
- case studies need a `diagramAlt` of ≥ 40 characters
- FAQ answers ≥ 40 characters

Editing content is editing MDX. A bad frontmatter field stops the build with the file
name and the field.

### Passing structured data to MDX components

Use a frontmatter key and reference it by name:

```yaml
factLists:
  tendercopilot:
    - label: "Market"
      value: "Indian public procurement (CPPP)"
```

```mdx
<FactList name="tendercopilot" />
```

Do **not** pass `facts={[...]}` inline. `next-mdx-remote`'s RSC renderer silently drops
JSX *expression* attributes — the component receives `{}` and renders nothing, with no
error. Literal string attributes do survive, which is why the key travels as one.

## Known gaps

- The ten blog posts in `content/blog/` are frontmatter-only stubs. Routing, schema and
  internal linking are wired; the prose has not been written.
- `components/layout/Logo.tsx` is a typographic placeholder. Drop the real SVG at
  `public/brand/logo.svg` and swap the span for `next/image`.
- Social URLs and the Calendly link in `lib/site.ts` are assumed, not confirmed.

## Deploying

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Read the DNS step first — the domain has
live email that a careless nameserver change will break.
