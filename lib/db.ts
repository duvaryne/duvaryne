import { neon } from "@neondatabase/serverless";

/**
 * Neon over HTTP, not TCP.
 *
 * Cloudflare Workers cannot open arbitrary TCP sockets, so the usual `pg` driver is not
 * an option. Neon's serverless driver issues each statement as an HTTPS request, which is
 * the one shape of database access a Worker can actually perform.
 *
 * The client is created per call rather than at module scope on purpose: `DATABASE_URL`
 * is a Worker secret and is not present at build time, so a module-scope `neon(...)`
 * would throw during `next build` and fail the deploy.
 */
export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is not set");
    this.name = "DatabaseNotConfiguredError";
  }
}

export function getSql() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new DatabaseNotConfiguredError();
  return neon(url);
}

export type EnquiryRow = {
  name: string;
  email: string;
  company: string | null;
  message: string;
  budget: string | null;
  ip: string | null;
  userAgent: string | null;
};

/** Returns the new row's id. Throws DatabaseNotConfiguredError if the secret is missing. */
export async function insertEnquiry(row: EnquiryRow): Promise<number> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO enquiries (name, email, company, message, budget, ip, user_agent)
    VALUES (${row.name}, ${row.email}, ${row.company}, ${row.message},
            ${row.budget}, ${row.ip}, ${row.userAgent})
    RETURNING id
  `) as { id: number }[];

  const id = rows[0]?.id;
  if (id === undefined) throw new Error("insert returned no id");
  return id;
}
