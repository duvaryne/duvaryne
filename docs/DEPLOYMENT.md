# Deployment runbook — duvaryne.com

Cloudflare Workers + Neon Postgres. Everything here is on a free tier.

> ⚠️ **Read Step 6 before you touch DNS.** `duvaryne.com` currently has live GoDaddy
> email (`MX → smtp.secureserver.net`, SPF `include:spf.em.secureserver.net`). Moving
> nameservers to Cloudflare without recreating those records **breaks the mailbox**.

---

## Contents

| Phase | Steps | Time |
|---|---|---|
| Database | 1 | ~10 min |
| First deploy | 2–5 | ~30 min |
| DNS cutover | 6–7 | ~20 min + propagation |
| Hardening | 8–10 | ~20 min |

---

## Step 1. Neon database

The project is already provisioned: **`curly-mud-99483022`** in organisation
**Duvaryne** (`org-frosty-surf-08952346`), region `aws-ap-southeast-1`, branch
`production`. The `enquiries` table exists.

To set it up on a new machine:

```bash
npm i -g neon
neon auth                       # browser OAuth
neon link --org-id org-frosty-surf-08952346 --project-id curly-mud-99483022 -y
```

`link` writes the IDs to a git-ignored `.neon` file and pulls the branch's variables into
`.env.local` — `DATABASE_URL` (pooled), `DATABASE_URL_UNPOOLED` (direct), and the Neon
Auth URLs. Then:

```bash
pnpm db:init                    # idempotent; creates enquiries + its index
```

Two things about connections:

- **`DATABASE_URL` is pooled** (`-pooler` in the host) and is what the Worker uses. Neon's
  serverless driver speaks HTTPS, which is the only thing a Worker can do — a direct
  string will fail at runtime.
- **`DATABASE_URL_UNPOOLED` is direct** and is what schema work must use. DDL through
  PgBouncer's transaction mode fails in ways that never mention pooling. `pnpm db:init`
  prefers it automatically and warns if only the pooled URL is available.

`neon.ts` declares the branch's services. `neon config plan` dry-runs a diff; `neon deploy`
applies it. It currently declares `auth: true` to match what is provisioned — omitting it
would make the next deploy **deprovision Neon Auth**.

> **OAuth tokens expire**, and mid-session expiry shows up as *"supplied credentials do not
> pass authentication"*. For CI or unattended use, mint an API key at
> <https://console.neon.tech/app/settings/api-keys> and set `NEON_API_KEY` instead.

---

## Step 2. Create the Cloudflare Worker

```bash
npx wrangler login
```

The worker name is `duvaryne`, from `wrangler.jsonc`. It is created on first deploy.

---

## Step 3. Set the secrets

These never go in the repo — `wrangler.jsonc` holds only `NEXT_PUBLIC_SITE_URL`.

```bash
npx wrangler secret put DATABASE_URL
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put NOTIFY_FROM
npx wrangler secret put NOTIFY_TO
```

Only `DATABASE_URL` is strictly required. With the others unset the form still works:
Turnstile is skipped and the notification email is a no-op, both by design.

---

## Step 4. Turnstile (spam protection)

1. Cloudflare dashboard → **Turnstile** → **Add site** → domain `duvaryne.com`.
2. Put the **site key** in `wrangler.jsonc` under `vars` as `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   (it is public and the build inlines it).
3. Put the **secret key** in via `wrangler secret put TURNSTILE_SECRET_KEY`.

---

## Step 4b. Contact-form notifications (Resend → Titan)

Titan receives your mail; it cannot send the form's alert. A Cloudflare Worker has no
usable SMTP path — outbound port 25 is blocked and `nodemailer` needs Node's `net`/`tls`,
which the runtime does not provide. So the alert goes out over HTTP through Resend and
lands **in the Titan mailbox**. Titan remains the mailbox; Resend is only the transport.

Neon is the system of record. If Resend is unset or failing, the enquiry is still stored
and the visitor still gets a success response — the failure is logged, never surfaced.

1. Sign up at <https://resend.com> (free tier: 3,000 emails/month, ample here).
2. **Verify a subdomain, not the apex.** Add `send.duvaryne.com`. Resend gives you DKIM
   and SPF records scoped to that subdomain, which you add in Cloudflare DNS. Verifying
   the apex instead would have you editing the apex SPF record that Titan depends on.
3. Set the secrets:

   ```bash
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put NOTIFY_FROM   # noreply@send.duvaryne.com
   npx wrangler secret put NOTIFY_TO     # contact@duvaryne.com
   ```

`reply_to` on the notification is set to the enquirer's address, so replying from the
Titan inbox goes straight to them rather than to Resend.

---

## Step 5. First deploy

```bash
pnpm cf:deploy
```

That runs `next build --webpack`, bundles with OpenNext, uploads the prerendered pages
as static assets, then deploys. You get a `*.workers.dev` URL.

**Verify before touching DNS:**

```bash
BASE=https://duvaryne.<your-subdomain>.workers.dev
for p in / /about/ /products/ /services/aws-cloud/ \
         /case-studies/karpenter-spot-eks-cost-optimisation/ \
         /blog/lambda-cold-starts/ /sitemap.xml /robots.txt /rss.xml; do
  echo "$(curl -s -o /dev/null -w '%{http_code}' "$BASE$p")  $p"
done
```

All must be `200`. If dynamic routes 404 while `/` works, the cache was not populated —
run `npx opennextjs-cloudflare populateCache remote` and redeploy.

Submit the contact form once and confirm the row lands:

```sql
SELECT id, name, email, created_at FROM enquiries ORDER BY created_at DESC LIMIT 5;
```

---

## Step 6. DNS — done, and mail survived

The nameserver cutover is complete. `duvaryne.com` is on Cloudflare
(`keenan.ns.cloudflare.com`, `violet.ns.cloudflare.com`), and the mail records came
across intact:

| Type | Value | Priority |
|---|---|---|
| MX | `smtp.secureserver.net` | 0 |
| MX | `mailstore1.secureserver.net` | 10 |
| TXT | `v=spf1 include:spf.em.secureserver.net ?all` | — |

That is GoDaddy-hosted **Titan**, and it is the mailbox for `contact@duvaryne.com`.

**Do not let anything change the apex `MX` or the SPF `TXT` record.** In particular,
enabling Cloudflare Email Routing will offer to replace the MX records with its own,
which would silently stop mail reaching Titan. Decline it unless you are deliberately
migrating away from Titan.

Re-verify any time with:

```bash
dig +short duvaryne.com MX
dig +short duvaryne.com TXT
```

---

## Step 7. Point the domain at the Worker

Cloudflare dashboard → **Workers & Pages → duvaryne → Settings → Domains & Routes** →
**Add custom domain** → `duvaryne.com`, then repeat for `www.duvaryne.com`.

Cloudflare creates the proxied records and issues the certificate. Verify:

```bash
curl -sI https://duvaryne.com/ | head -3
```

---

## Step 8. Continuous deployment

`.github/workflows/ci.yml` deploys on every push to `main` once typecheck, lint, build,
axe and Lighthouse pass. Add two repository secrets:

- `CLOUDFLARE_API_TOKEN` — dashboard → My Profile → API Tokens → **Edit Cloudflare Workers**
- `CLOUDFLARE_ACCOUNT_ID` — right-hand sidebar of any dashboard page

---

## Step 9. Search consoles

1. [Google Search Console](https://search.google.com/search-console) → add `duvaryne.com`
   → verify by DNS TXT (Cloudflare makes this a one-liner) → submit
   `https://duvaryne.com/sitemap.xml`.
2. [Bing Webmaster Tools](https://www.bing.com/webmasters) → import from Google.

`app/robots.ts` only allows indexing when `NEXT_PUBLIC_SITE_URL` contains `duvaryne.com`,
so `*.workers.dev` previews stay `noindex` without any extra configuration.

---

## Step 10. Post-launch checks

- [ ] `https://duvaryne.com/sitemap.xml` lists every route
- [ ] OG image renders — paste a URL into the [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [ ] Contact form writes to Neon **and** sends the notification
- [ ] Rich Results Test passes on `/`, a service page and a case study
- [ ] Mailbox still receives mail (re-check a week after cutover)

---

## Notes on the build

Three things here are not the framework defaults, and each has a reason:

- **`--webpack` is pinned.** Turbopack, the Next 16 default, does not emit the
  prerendered `.html`/`.rsc` layout that the OpenNext adapter copies from. Build with
  Turbopack and every SSG route 404s in the Worker.
- **`output: "standalone"`.** The adapter reads `.next/standalone`. `cf:build` drives
  `next build` itself, so this must be set in `next.config.ts` rather than injected.
- **`incrementalCache` is set in `open-next.config.ts`.** Without it, prerendered
  dynamic routes fail with `NoFallbackError` while static routes keep working — a
  failure that looks like a routing bug. The static-assets implementation needs no R2
  or KV. Its trade-off is an immutable per-deploy cache: on-demand revalidation is not
  available, which is free here because the site rebuilds on push.

`next start` does not work with `output: "standalone"`; use `node .next/standalone/server.js`,
as CI does.
