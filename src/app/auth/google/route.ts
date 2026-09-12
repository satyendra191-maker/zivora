import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const client = await supabaseServer();
  if (!client) return NextResponse.redirect(`${origin}/?auth=unavailable`);
  const { data, error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${origin}/auth/callback` } });
  if (error || !data.url) return NextResponse.redirect(`${origin}/?auth=error`);
  return NextResponse.redirect(data.url);
}
