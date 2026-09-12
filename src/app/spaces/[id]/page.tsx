import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import { resources } from '@/db/schema';
import { ArrowRight, CalendarDays, HeartHandshake, MapPin, ShieldCheck, Users } from 'lucide-react';
export const dynamic = 'force-dynamic';
async function getSpace(id: string) { const [item] = await db.select().from(resources).where(and(eq(resources.id, id), eq(resources.status, 'active'), inArray(resources.kind, ['community', 'event']))); return item; }
export async function generateMetadata({params}: {params: Promise<{id: string}>}): Promise<Metadata> {
  const {id} = await params; const r = await getSpace(id);
  if (!r) return {title: 'Space not found — Zivora', robots: {index: false}};
  return {title: `${r.title} in ${r.city} — Zivora`, description: r.description.slice(0, 160), openGraph: {title: r.title, description: r.description.slice(0, 160), images: [r.image], type: 'website', locale: 'en_IN'}};
}
export default async function SpacePage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params; const r = await getSpace(id); if (!r) notFound();
  return <div className="public-space"><header><Link href="/" className="brand"><span className="brand-mark"><HeartHandshake size={30}/></span>ZIVORA<span className="brand-dot">.</span></Link><Link className="secondary-button" href="/">Find your people<ArrowRight size={15}/></Link></header><main><span className="eyebrow">REAL PEOPLE. SHARED POSSIBILITIES.</span><h1>A little common ground.<br/>A whole lot of belonging.</h1><article className="card public-resource"><img className="public-resource-photo" src={r.image} alt={r.title} fetchPriority="high" decoding="async"/><div className="public-resource-body"><span className="status-pill">{r.category} · {r.kind === 'event' ? 'Local experience' : 'Interest community'}</span><h2>{r.title}</h2><div className="public-facts"><span><MapPin size={17}/>{r.location || r.city}</span><span><Users size={17}/>{r.members.toLocaleString('en-IN')} {r.kind === 'event' ? 'going' : 'members'}</span>{r.date && <span><CalendarDays size={17}/>{new Date(r.date).toLocaleString('en-IN', {weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit'})}</span>}</div><p>{r.description}</p><Link className="primary-button" href={`/?space=${encodeURIComponent(r.id)}`}>{r.kind === 'event' ? 'Discover this experience' : 'Meet your community'}<ArrowRight size={17}/></Link><div className="info-banner"><ShieldCheck size={18}/>A thoughtful space for adults 18+. Join Zivora to participate, connect, and keep the conversation going.</div></div></article><footer><HeartHandshake size={18}/>Built for belonging. Designed for trust.<span>Made for India 🇮🇳</span></footer></main></div>;
}
