import { cookies } from 'next/headers';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { and, eq, gt } from 'drizzle-orm';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
export const tokenHash = (value: string) => createHash('sha256').update(value).digest('hex');
export function hashPassword(password: string) { const salt = randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`; }
export function verifyPassword(password: string, hash: string) { const [salt, key] = hash.split(':'); if (!salt || !key) return false; const stored = Buffer.from(key, 'hex'); const actual = scryptSync(password, salt, 64); return stored.length === actual.length && timingSafeEqual(stored, actual); }
export async function createSession(userId: string) {
  const token = randomBytes(32).toString('hex');
  await db.insert(sessions).values({ token: tokenHash(token), userId, expiresAt: new Date(Date.now() + 30 * 86400000) });
  (await cookies()).set('zivora_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 30 * 86400 });
}
export async function currentUser() {
  const token = (await cookies()).get('zivora_session')?.value;
  if (!token) return null;
  const [row] = await db.select({ user: users }).from(sessions).innerJoin(users, eq(users.id, sessions.userId)).where(and(eq(sessions.token, tokenHash(token)), gt(sessions.expiresAt, new Date())));
  if (!row || row.user.suspended) return null;
  return row.user;
}
export async function logout() { const store = await cookies(); const token = store.get('zivora_session')?.value; if (token) await db.delete(sessions).where(eq(sessions.token, tokenHash(token))); store.delete('zivora_session'); store.set('zivora_session', '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 }); }
export function publicUser(user: typeof users.$inferSelect) { const { password, ...safe } = user; void password; return safe; }
