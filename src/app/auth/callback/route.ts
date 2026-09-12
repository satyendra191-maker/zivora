import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { supabaseServer } from '@/lib/supabase';
import { createSession, logout } from '@/lib/auth';
export async function GET(request: Request) {
  const url = new URL(request.url); const client = await supabaseServer(); const code = url.searchParams.get('code');
  if (client && code) {
    const { error } = await client.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await client.auth.getUser();
      if (user?.email) {
        const email = user.email.toLowerCase(); let [member] = await db.select().from(users).where(eq(users.email, email));
        if (!member) [member] = await db.insert(users).values({ id: randomUUID(), email, name: String(user.user_metadata.full_name || 'New member').slice(0, 70) }).returning();
        if (member.suspended) return NextResponse.redirect(`${url.origin}/?auth=suspended`);
        await logout(); await createSession(member.id); return NextResponse.redirect(`${url.origin}/?welcome=1`);
      }
    }
  }
  return NextResponse.redirect(`${url.origin}/?auth=error`);
}
