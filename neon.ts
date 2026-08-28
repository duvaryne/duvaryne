import { defineConfig } from "@neon/config/v1";

/**
 * Neon infrastructure as code for duvaryne.com.
 *
 * Declares what the branch should have, so `neon deploy` reconciles it and `neon env pull`
 * only fetches the services listed here.
 *
 * `auth: true` reflects what the project already has provisioned — this site does NOT use
 * Neon Auth today. It is declared rather than omitted because omitting it makes the next
 * `neon deploy` deprovision it. If you want Auth gone, remove it here deliberately and
 * run `neon config plan` first to see exactly what would change.
 *
 * Lakebase Postgres ships with every project and needs no declaration; it is what the
 * contact form writes to via lib/db.ts.
 */
export default defineConfig({
  auth: true,
});
