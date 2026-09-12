# Zivora — a little closer to your people

An India-first, adult-only connection application built with Next.js App Router, React, PostgreSQL, Drizzle, and a custom responsive design system.

## Working features
- Private, per-browser demo sessions with seeded Bengaluru profiles, communities, events, creators, and sample conversations.
- Email/password signup and sign-in, salted scrypt password hashes, hashed session tokens, secure HTTP-only cookies, and server-side adult confirmation.
- Optional Supabase Google OAuth, with verified server-side identity exchanged for an application session.
- Registered-member discovery, city/age/intent filtering, incognito enforcement, likes, real mutual matching, private message delivery, read states, duplicate-message detection, rate limiting, and two-way blocking.
- Community and event create/read/update/delete with organizer-only authorization. Capacity-safe RSVP transactions, saved events, join/leave communities, discussions and appreciation reactions.
- Private meeting plans, check-ins, reports, consent/safety guides, product feedback, and earned participation milestones.
- Creator follows and a progression preview. Live audio/video is explicitly not enabled.
- Account profiles, privacy controls, searchable browsing, notifications, sharing links, and SEO-friendly public event/community pages.
- Administrator report resolution, account suspension, community/event removal, and auditable moderation operations. Demo accounts cannot access admin functionality.

## Run
The platform manages DATABASE_URL and the preview server. Install dependencies, run `npx drizzle-kit push`, and use `npm run dev`. Demo content is seeded idempotently by the authenticated bootstrap endpoint. No payment credentials are needed.

Set `NEXT_PUBLIC_SITE_URL` to the deployed origin for absolute social sharing metadata.

## Optional Google authentication
Set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY. Enable Google in Supabase Auth and allow `<your-origin>/auth/callback` as a redirect URL. No Supabase secret is exposed in browser code. Email credentials use the local PostgreSQL identity store, while Google identity is verified by Supabase. Supabase is not used as the database transport; all data operations use server-only Drizzle.

## Admin provisioning
There is no public admin signup or default admin password. Create an account normally, then have a trusted database operator promote its `zivora_users.role` to `admin` through the database administration environment. All admin mutations verify this role on the server and record an audit log.

## Important boundaries
- Demo profiles and badge illustrations are fictional and do not represent identity verification. Demo chats save messages but do not send them to real people or generate pretend replies.
- Existing live accounts can match each other and exchange persistent messages. Updates use short polling, not a realtime service.
- Age confirmation is self-attestation, not documentary age verification. Add an appropriate age-assurance provider before unrestricted public deployment.
- Meeting plans are private notes and check-ins, not a mutual-consent workflow, automated alert service, live tracking service, or emergency response system. They do not contact trusted people automatically.
- Public events/communities expose descriptions and counts, not participant lists, emails, or private reports. Incognito excludes real profiles from discovery while preserving existing matches.
- All local DB access uses the server connection and explicit authorization; do not expose these tables directly through a public database API. Bootstrap enables default-deny row-level security for non-owner database roles. The application connection retains owner privileges and enforces access in the server API.
- No billing, advertising trackers, paid verification, automated moderation decisions, or actual live video is enabled. Subscription and broadcast UI describe future, configuration-dependent capabilities honestly.
- Production rollout should add transactional email, verified account recovery, durable distributed request throttling, a managed moderation team, backups, legal policies, and threat modeling.

## Validation
`npm run validate` (typecheck + lint + unit tests), `npx next typegen`, and `npm run build` must pass. The managed production preview also verifies `/api/health`.
