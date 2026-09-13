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
// endpoints (e.g. Supabase poolers) that use self-signed intermediates. Restore
// the legacy libpq "require" meaning: encrypt, but do not pin the certificate.
const ssl = databaseUrl?.includes("sslmode=require")
  ? { rejectUnauthorized: false }
  : undefined;

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl ?? "postgresql://127.0.0.1:5432/unconfigured",
    ssl,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
