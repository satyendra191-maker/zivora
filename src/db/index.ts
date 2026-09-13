import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

// Allow `next build` / lint to run without a live database. Queries will fail
// at request time with a clear error, while the health endpoint reports ok:false.
if (!databaseUrl && process.env.NODE_ENV !== "production") {
  console.warn("DATABASE_URL is not set; database queries will fail until it is configured.");
}

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

// Modern pg treats sslmode=require as verify-full, which fails on managed TLS
// endpoints (e.g. Supabase poolers) that present self-signed intermediates, and
// a sslmode in the URL overrides any explicit ssl option. Strip the mode from
// the URL and encrypt without pinning instead, restoring the legacy libpq
// "require" semantics the managed database URLs assume.
let connectionString = databaseUrl ?? "postgresql://127.0.0.1:5432/unconfigured";
let ssl: { rejectUnauthorized: boolean } | undefined;
if (databaseUrl && databaseUrl.includes("sslmode=require")) {
  connectionString = databaseUrl.replace(/[?&]sslmode=require(?=&|$)/, "");
  ssl = { rejectUnauthorized: false };
}

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString,
    ssl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
