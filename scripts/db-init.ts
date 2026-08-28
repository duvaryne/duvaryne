/**
 * Creates the enquiries table. Idempotent — safe to re-run.
 *
 *   pnpm db:init                       # reads .env.local
 *   DATABASE_URL_UNPOOLED='…' pnpm db:init
 *
 * Uses the DIRECT (unpooled) connection deliberately. The pooled endpoint routes through
 * PgBouncer in transaction mode, which does not support session-level operations, and DDL
 * run through it fails in ways that never mention pooling — a SET that does not persist
 * past its own transaction, or a write inheriting a read-only transaction (SQLSTATE 25006).
 * Application traffic keeps using the pooled URL; only schema work comes through here.
 */
import { neon } from "@neondatabase/serverless";

// Node loads .env.local itself so the script works with no shell ceremony.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local — fall through to whatever is already in the environment.
}

const url = (process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL)?.trim();

if (!url) {
  console.error("Neither DATABASE_URL_UNPOOLED nor DATABASE_URL is set.");
  console.error("Run `neon link` to pull them into .env.local, or pass one explicitly.");
  process.exit(1);
}

if (url.includes("-pooler")) {
  console.warn(
    "⚠ Using the POOLED connection for DDL. Set DATABASE_URL_UNPOOLED to avoid\n" +
      "  transaction-mode pooling errors on schema changes.",
  );
}

const sql = neon(url);

// Wrapped rather than top-level await: tsx compiles this to CJS (the package has no
// "type": "module"), and esbuild rejects top-level await in that output format.
async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS enquiries (
      id          SERIAL PRIMARY KEY,
      name        TEXT        NOT NULL,
      email       TEXT        NOT NULL,
      company     TEXT,
      message     TEXT        NOT NULL,
      budget      TEXT,
      ip          TEXT,
      user_agent  TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  // Enquiries are read newest-first in every case; without this the table scans.
  await sql`CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC)`;

  const rows = (await sql`SELECT count(*)::int AS count FROM enquiries`) as { count: number }[];
  const count = rows[0]?.count ?? 0;

  console.log(`✔ enquiries table ready (${count} row${count === 1 ? "" : "s"})`);
}

main().catch((err) => {
  console.error("db:init failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
