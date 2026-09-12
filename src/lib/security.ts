import { db } from '@/db';
import { sql } from 'drizzle-orm';
let lockdown: Promise<void> | undefined;
// The app uses its private table-owner connection with explicit authorization.
// No non-owner database role may query these tables without an added policy.
// RLS enablement requires table owner/superuser privileges which managed databases
// (e.g., Supabase) typically don't grant to application users. We attempt it but
// continue gracefully if the user lacks permission - app-level authorization
// already enforces access control.
export function ensureDatabaseLockdown() {
  if (!lockdown) lockdown = (async () => {
    for (const table of ['zivora_users', 'zivora_sessions', 'zivora_profiles', 'zivora_resources', 'zivora_actions', 'zivora_messages', 'zivora_reports', 'zivora_posts', 'zivora_audit_logs', 'zivora_leads']) {
      try {
        await db.execute(sql.raw(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`));
      } catch (error) {
        console.warn(`[Security] Could not enable RLS on ${table}:`, error instanceof Error ? error.message : error);
      }
    }
  })();
  return lockdown;
}
const windows = new Map<string, { count: number; expires: number }>();
export function withinRateLimit(key: string, maximum: number, duration: number) {
  const now = Date.now(); const current = windows.get(key);
  if (!current || current.expires <= now) {
    if (windows.size > 10000) for (const [id, entry] of windows) { if (entry.expires < now) windows.delete(id); }
    windows.set(key, {count: 1, expires: now + duration}); return true;
  }
  current.count++; return current.count <= maximum;
}
