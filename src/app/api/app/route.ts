import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { and, asc, count, desc, eq, gt, gte, inArray, lt, or, ne, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users, profiles, resources, actions, messages, reports, posts, auditLogs, sessions, leads } from '@/db/schema';
import { currentUser, createSession, hashPassword, verifyPassword, logout, publicUser } from '@/lib/auth';
import { seed } from '@/lib/seed';
import { ensureDatabaseLockdown, withinRateLimit } from '@/lib/security';
import { ApiError, leadStatus, num, rangeDays, text } from '@/lib/validators';
export const dynamic = 'force-dynamic';
async function snapshot(user: typeof users.$inferSelect) {
  const [people, items, activity, chat, ownReports, discussions] = await Promise.all([
    db.select().from(profiles).limit(200), db.select().from(resources).where(sql`${resources.kind} != 'meeting' OR ${resources.ownerId} = ${user.id}`).limit(200),
    db.select().from(actions).where(eq(actions.userId, user.id)).limit(2000), db.select().from(messages).where(eq(messages.userId, user.id)).orderBy(desc(messages.createdAt)).limit(500),
    db.select().from(reports).where(user.role === 'admin' ? undefined : eq(reports.userId, user.id)).orderBy(desc(reports.createdAt)).limit(100), db.select().from(posts).orderBy(desc(posts.createdAt)).limit(100),
  ]);
  // Newest-first fetch keeps the latest 500 under the cap; restore chronological order for the client.
  chat.reverse();
  const blockedBy = await db.select().from(actions).where(and(eq(actions.targetId, user.id), eq(actions.kind, 'block'))).limit(2000);
  const blocked = [...activity.filter(a => a.kind === 'block').map(a => a.targetId), ...blockedBy.map(a => a.userId)];
  const realMembers = await db.select().from(users).where(and(eq(users.demo, false), eq(users.adult, true), eq(users.suspended, false), ne(users.id, user.id))).limit(500);
  const realProfiles = (user.adult && !user.demo ? realMembers : []).filter(m => !blocked.includes(m.id) && (!m.incognito || activity.some(a => a.kind === 'match' && a.targetId === m.id))).map(m => ({ id: m.id, name: m.name, age: m.age, city: m.city, distance: -1, bio: m.bio || 'A new face, a new possibility. Say hello and get to know me.', intent: m.intent, interests: [m.intent, m.city], image: '/images/member-avatar.svg', verified: false, online: false, compatibility: 0, demo: false }));
  const publicItems = items.filter(r => r.status !== 'removed' || r.ownerId === user.id || user.role === 'admin');
  return { user: publicUser(user), profiles: [...people.filter(p => !blocked.includes(p.id)).map(p => ({...p, demo: true})), ...realProfiles], resources: publicItems, actions: activity, messages: chat.filter(m => !blocked.includes(m.profileId)), reports: ownReports, posts: discussions.filter(p => publicItems.some(r => r.id === p.resourceId)), googleEnabled: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)), ...(user.role === 'admin' ? { members: (await db.select().from(users).limit(500)).map(publicUser), audit: await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100), leads: await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(200) } : {}) };
}
export async function GET() { try { const user = await currentUser(); if (!user) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 }); return NextResponse.json(await snapshot(user)); } catch (e) { console.error(e); return NextResponse.json({ error: 'Unable to load your space. Please try again.' }, { status: 500 }); } }
export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin');
    if (origin) {
      let originHost = '';
      try { originHost = new URL(origin).host; } catch { throw new ApiError('Request origin is not allowed.', 403); }
      const requestHost = request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).host;
      if (originHost !== requestHost) throw new ApiError('Request origin is not allowed.', 403);
    }
    const body = await request.json(); const action = text(body.action, 40);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    if (['signup', 'login'].includes(action) && !withinRateLimit(`auth:${ip}`, 20, 15 * 60000)) throw new ApiError('Too many sign-in attempts. Please try again in 15 minutes.', 429);
    if (!withinRateLimit(`requests:${ip}`, 180, 60000)) throw new ApiError('A little pause. Please try again shortly.', 429);
    let user = await currentUser();
    if (action === 'bootstrap') {
      await ensureDatabaseLockdown();
      await seed();
      // Opportunistic cleanup: expired sessions are never read again, so purge them on entry.
      await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
      if (!user) {
        const id = randomUUID();
        [user] = await db.insert(users).values({ id, name: 'Aarav Sharma', age: 26, city: 'Bengaluru', demo: true, bio: 'Coffee, good conversations, and new perspectives. Finding my people in Bengaluru.', intent: 'Relationship' }).returning();
        await createSession(id);
        await db.insert(actions).values([{ id: randomUUID(), userId: id, targetId: 'ananya', kind: 'match' }, { id: randomUUID(), userId: id, targetId: 'riya', kind: 'match' }]);
        await db.insert(messages).values([{ id: randomUUID(), userId: id, profileId: 'ananya', text: 'Hey Aarav! Your travel photos are lovely. What’s your favourite weekend escape from the city? 🌿', incoming: true }, { id: randomUUID(), userId: id, profileId: 'riya', text: 'Coffee and a good playlist — looks like we have a few things in common! ☕', incoming: true }]);
      }
      return NextResponse.json(await snapshot(user));
    }
    if (action === 'signup' || action === 'login') {
      const email = text(body.email, 180).toLowerCase(), password = text(body.password, 128);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError('Please enter a valid email address.');
      if (action === 'signup') {
        if (body.adult !== true) throw new ApiError('Zivora is exclusively for adults aged 18 and over.');
        if (password.length < 8) throw new ApiError('Choose a password with at least 8 characters.');
        const [existing] = await db.select().from(users).where(eq(users.email, email)); if (existing) throw new ApiError('An account already exists. Please sign in.');
        const age = num(body.age, 18, 100);
        [user] = await db.insert(users).values({ id: randomUUID(), email, password: hashPassword(password), name: text(body.name, 70), age, adult: true }).returning();
        if (typeof body.referral === 'string' && body.referral) {
          const [referrer] = await db.select().from(users).where(eq(users.id, body.referral));
          if (referrer && referrer.id !== user.id) await db.insert(leads).values({ id: randomUUID(), userId: user.id, name: user.name, email, source: 'referral', details: `Referred by ${referrer.name}` });
        }
      } else {
        const [found] = await db.select().from(users).where(eq(users.email, email));
        if (!found?.password || !verifyPassword(password, found.password)) throw new ApiError('Email or password is incorrect.', 401);
        if (found.suspended) throw new ApiError('Your account is suspended. Contact safety@zivora.app.', 403);
        user = found;
      }
      await logout(); await createSession(user.id); return NextResponse.json(await snapshot(user));
    }
    if (action === 'logout') { await logout(); return NextResponse.json({ ok: true }); }
    if (!user) throw new ApiError('Please sign in to continue.', 401);
    if (action === 'adult') { if (body.confirmed !== true) throw new ApiError('Adult confirmation is required.'); [user] = await db.update(users).set({ adult: true }).where(eq(users.id, user.id)).returning(); return NextResponse.json(await snapshot(user)); }
    if (!user.adult) throw new ApiError('Please confirm that you are 18 or older.', 403);
    const id = typeof body.id === 'string' ? body.id : '';
    if (action === 'profile') {
      const intent = text(body.intent, 40); if (!['Relationship', 'Friendship', 'Activity partners', 'Dating'].includes(intent)) throw new ApiError('Choose a valid connection intent.');
      [user] = await db.update(users).set({ name: text(body.name, 70), age: num(body.age, 18, 100), city: text(body.city, 60), bio: text(body.bio, 1000, false), intent, incognito: body.incognito === true }).where(eq(users.id, user.id)).returning();
    } else if (action === 'toggle') {
      const kind = text(body.kind, 30); if (!['like', 'save', 'block', 'follow', 'reaction'].includes(kind)) throw new ApiError('Unsupported action.');
      const [person] = await db.select().from(profiles).where(eq(profiles.id, id)); const [member] = await db.select().from(users).where(and(eq(users.id, id), eq(users.demo, false), eq(users.adult, true), eq(users.suspended, false))); const [item] = await db.select().from(resources).where(eq(resources.id, id)); const [post] = await db.select().from(posts).where(eq(posts.id, id));
      if (id === user.id || (['like', 'block'].includes(kind) && !person && !member) || (['save', 'follow'].includes(kind) && (!item || item.status !== 'active' || item.kind === 'meeting')) || (kind === 'reaction' && !post)) throw new ApiError('This item is no longer available.', 404);
      if (kind === 'like' && member) {
        const [existingMatch] = await db.select().from(actions).where(and(eq(actions.userId, user.id), eq(actions.targetId, id), eq(actions.kind, 'match')));
        const [block] = await db.select().from(actions).where(and(eq(actions.kind, 'block'), or(and(eq(actions.userId, user.id), eq(actions.targetId, id)), and(eq(actions.userId, id), eq(actions.targetId, user.id)))));
        if (user.demo || block || (member.incognito && !existingMatch)) throw new ApiError('This profile is not available for a connection.', 403);
      }
      const filter = and(eq(actions.userId, user.id), eq(actions.targetId, id), eq(actions.kind, kind)); const [exists] = await db.select().from(actions).where(filter);
      if (exists) await db.delete(actions).where(filter); else await db.insert(actions).values({ id: randomUUID(), userId: user.id, targetId: id, kind }).onConflictDoNothing();
      if (kind === 'like' && !exists && member) {
        await db.transaction(async tx => {
          const ids = [user!.id, id].sort(); await tx.select().from(users).where(inArray(users.id, ids)).orderBy(asc(users.id)).for('update');
          const [reciprocal] = await tx.select().from(actions).where(and(eq(actions.userId, id), eq(actions.targetId, user!.id), eq(actions.kind, 'like')));
          if (reciprocal) await tx.insert(actions).values([{id: randomUUID(), userId: user!.id, targetId: id, kind: 'match'}, {id: randomUUID(), userId: id, targetId: user!.id, kind: 'match'}]).onConflictDoNothing();
        });
      }
    } else if (action === 'join') {
      await db.transaction(async tx => {
        const [item] = await tx.select().from(resources).where(eq(resources.id, id)).for('update');
        if (!item || !['event', 'community'].includes(item.kind) || item.status !== 'active') throw new ApiError('This space is not available.', 404);
        const filter = and(eq(actions.userId, user!.id), eq(actions.targetId, id), eq(actions.kind, 'join'));
        const [exists] = await tx.select().from(actions).where(filter);
        if (exists) { await tx.delete(actions).where(filter); await tx.update(resources).set({ members: Math.max(0, item.members - 1) }).where(eq(resources.id, id)); }
        else { if (item.members >= item.capacity) throw new ApiError('This event is full. Please check back later.'); await tx.insert(actions).values({ id: randomUUID(), userId: user!.id, targetId: id, kind: 'join' }); await tx.update(resources).set({ members: item.members + 1 }).where(eq(resources.id, id)); }
      });
    } else if (action === 'create' || action === 'update') {
      const kind = text(body.kind, 30); if (!['community', 'event', 'meeting'].includes(kind)) throw new ApiError('Unsupported resource.');
      let existing: typeof resources.$inferSelect | undefined;
      if (action === 'update') { [existing] = await db.select().from(resources).where(eq(resources.id, id)); if (!existing || existing.ownerId !== user.id || existing.kind !== kind) throw new ApiError('Only the organizer can edit this.', 403); }
      const date = text(body.date, 40, kind !== 'community'); if (date && (Number.isNaN(Date.parse(date)) || Date.parse(date) < Date.now())) throw new ApiError('Choose a date and time in the future.');
      const capacity = kind === 'community' ? 10000 : num(body.capacity || 2, 2, 10000); if (existing && capacity < existing.members) throw new ApiError('Capacity cannot be lower than attendance.');
      const values = { kind, title: text(body.title, 100), description: text(body.description, 3000), category: text(body.category || (kind === 'meeting' ? 'Personal plan' : 'Social'), 60), city: text(body.city || user.city, 60), location: text(body.location, 180, kind !== 'community'), date, capacity, image: kind === 'event' ? 'https://images.pexels.com/photos/4878006/pexels-photo-4878006.jpeg?auto=compress&cs=tinysrgb&w=900' : 'https://images.pexels.com/photos/1036444/pexels-photo-1036444.jpeg?auto=compress&cs=tinysrgb&w=900' };
      if (action === 'update') await db.update(resources).set(values).where(and(eq(resources.id, id), eq(resources.ownerId, user.id)));
      else await db.insert(resources).values({ id: randomUUID(), ownerId: user.id, ...values });
    } else if (action === 'delete') {
      const [item] = await db.select().from(resources).where(eq(resources.id, id)); if (!item || item.ownerId !== user.id) throw new ApiError('Only the organizer can delete this.', 403);
      await db.transaction(async tx => { await tx.delete(actions).where(eq(actions.targetId, id)); await tx.delete(resources).where(eq(resources.id, id)); });
    } else if (action === 'message') {
      const [matched] = await db.select().from(actions).where(and(eq(actions.userId, user.id), eq(actions.targetId, id), eq(actions.kind, 'match')));
      const [blocked] = await db.select().from(actions).where(and(eq(actions.kind, 'block'), or(and(eq(actions.userId, user.id), eq(actions.targetId, id)), and(eq(actions.userId, id), eq(actions.targetId, user.id)))));
      const [recipient] = await db.select().from(users).where(and(eq(users.id, id), eq(users.suspended, false), eq(users.adult, true), eq(users.demo, false)));
      const [sample] = await db.select().from(profiles).where(eq(profiles.id, id));
      if (!matched || blocked || (!recipient && !sample)) throw new ApiError('Messaging is only available for unblocked mutual matches.', 403);
      const content = text(body.text, 2000); const recent = await db.select().from(messages).where(and(eq(messages.userId, user.id), eq(messages.incoming, false), gt(messages.createdAt, new Date(Date.now() - 60000))));
      if (recent.length >= 10) throw new ApiError('Take a moment. You can send more messages shortly.', 429);
      if (recent.some(m => m.text.toLowerCase() === content.toLowerCase())) throw new ApiError('Make it personal. Repeated copy-paste messages are not allowed.');
      const messageId = randomUUID();
      await db.transaction(async tx => { await tx.insert(messages).values({ id: `${messageId}:out`, userId: user!.id, profileId: id, text: content }); if (recipient && !user!.demo) await tx.insert(messages).values({ id: `${messageId}:in`, userId: id, profileId: user!.id, text: content, incoming: true }); });
    } else if (action === 'read') {
      await db.transaction(async tx => {
        const received = await tx.update(messages).set({ read: true }).where(and(eq(messages.userId, user!.id), eq(messages.profileId, id), eq(messages.incoming, true))).returning();
        const originals = received.filter(m => m.id.endsWith(':in')).map(m => m.id.replace(/:in$/, ':out'));
        if (originals.length) await tx.update(messages).set({read: true}).where(and(eq(messages.userId, id), eq(messages.profileId, user!.id), inArray(messages.id, originals)));
      });
    } else if (action === 'post') {
      const [member] = await db.select().from(actions).where(and(eq(actions.userId, user.id), eq(actions.targetId, id), eq(actions.kind, 'join')));
      const [item] = await db.select().from(resources).where(eq(resources.id, id)); if (!item || item.kind !== 'community' || item.status !== 'active' || (!member && item.ownerId !== user.id)) throw new ApiError('Join this community to start a discussion.', 403);
      await db.insert(posts).values({ id: randomUUID(), resourceId: id, userId: user.id, author: user.name, text: text(body.text, 2000) });
    } else if (action === 'deletePost') { await db.delete(posts).where(and(eq(posts.id, id), eq(posts.userId, user.id))); }
    else if (action === 'report' || action === 'feedback') {
      const reason = text(body.reason, 100); const details = text(body.details, 3000);
      await db.insert(reports).values({ id: randomUUID(), userId: user.id, targetId: action === 'feedback' ? 'product-feedback' : text(id, 120), reason, details });
      if (action === 'feedback') await db.insert(leads).values({ id: randomUUID(), userId: user.id, name: user.name, email: user.email || '', source: reason === 'Creator program interest' ? 'creator' : 'feedback', details: `${reason} — ${details}` });
    }
    else if (action === 'checkin') { const [plan] = await db.select().from(resources).where(and(eq(resources.id, id), eq(resources.ownerId, user.id), eq(resources.kind, 'meeting'))); if (!plan) throw new ApiError('Meeting plan not found.', 404); await db.update(resources).set({ status: 'checked-in' }).where(eq(resources.id, id)); }
    else if (action === 'moderate') {
      if (user.role !== 'admin') throw new ApiError('Administrator access required.', 403);
      if (body.kind === 'report') await db.update(reports).set({ status: body.status === 'resolved' ? 'resolved' : 'reviewing' }).where(eq(reports.id, id));
      else if (body.kind === 'user') { if (id === user.id) throw new ApiError('You cannot suspend yourself.'); await db.update(users).set({ suspended: body.suspended === true }).where(eq(users.id, id)); }
      else if (body.kind === 'resource') await db.update(resources).set({ status: body.status === 'removed' ? 'removed' : 'active' }).where(eq(resources.id, id));
      else throw new ApiError('Unknown moderation action.');
      await db.insert(auditLogs).values({ id: randomUUID(), userId: user.id, targetId: id, action: `moderate:${body.kind}:${body.status || body.suspended}` });
    } else if (action === 'adminStats') {
      if (user.role !== 'admin') throw new ApiError('Administrator access required.', 403);
      const days = rangeDays(body.days);
      const since = new Date(Date.now() - days * 86400000);
      const [signups, messageVolume, joins, userTotal, messageTotal, resourceKinds, userCities, reportStates] = await Promise.all([
        db.select({ day: sql<string>`date(${users.createdAt})`, city: users.city, n: count() }).from(users).where(gte(users.createdAt, since)).groupBy(sql`date(${users.createdAt})`, users.city).orderBy(asc(sql`date(${users.createdAt})`)),
        db.select({ day: sql<string>`date(${messages.createdAt})`, city: users.city, n: count() }).from(messages).innerJoin(users, eq(users.id, messages.userId)).where(gte(messages.createdAt, since)).groupBy(sql`date(${messages.createdAt})`, users.city).orderBy(asc(sql`date(${messages.createdAt})`)),
        db.select({ day: sql<string>`date(${actions.createdAt})`, city: users.city, n: count() }).from(actions).innerJoin(users, eq(users.id, actions.userId)).where(and(eq(actions.kind, 'join'), gte(actions.createdAt, since))).groupBy(sql`date(${actions.createdAt})`, users.city).orderBy(asc(sql`date(${actions.createdAt})`)),
        db.select({ n: count() }).from(users),
        db.select({ n: count() }).from(messages),
        db.select({ kind: resources.kind, n: count() }).from(resources).groupBy(resources.kind),
        db.select({ city: users.city, n: count() }).from(users).groupBy(users.city).orderBy(desc(count())).limit(12),
        db.select({ status: reports.status, n: count() }).from(reports).groupBy(reports.status),
      ]);
      return NextResponse.json({ days, signups, messages: messageVolume, joins, totals: { users: userTotal[0]?.n ?? 0, messages: messageTotal[0]?.n ?? 0 }, resourceKinds, userCities, reportStates });
    } else if (action === 'updateLead') {
      if (user.role !== 'admin') throw new ApiError('Administrator access required.', 403);
      const status = leadStatus(body.status);
      await db.update(leads).set({ status }).where(eq(leads.id, id));
      await db.insert(auditLogs).values({ id: randomUUID(), userId: user.id, targetId: id, action: `moderate:lead:${status}` });
    } else if (action === 'deleteLead') {
      if (user.role !== 'admin') throw new ApiError('Administrator access required.', 403);
      await db.delete(leads).where(eq(leads.id, id));
      await db.insert(auditLogs).values({ id: randomUUID(), userId: user.id, targetId: id, action: 'moderate:lead:deleted' });
    } else throw new ApiError('Unknown action.');
    return NextResponse.json(await snapshot(user));
  } catch (e) { if (e instanceof ApiError) return NextResponse.json({ error: e.message }, { status: e.status }); console.error(e); return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 }); }
}
