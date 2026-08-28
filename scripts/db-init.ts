/**
 * Creates the enquiries table. Idempotent — safe to re-run.
 *
 *   DATABASE_URL='postgresql://…' pnpm db:init
 */
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error("DATABASE_URL is not set.");
  console.error("Copy the pooled connection string from the Neon dashboard, then:");
  console.error("  DATABASE_URL='postgresql://…' pnpm db:init");
  process.exit(1);
}

const sql = neon(url);

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
