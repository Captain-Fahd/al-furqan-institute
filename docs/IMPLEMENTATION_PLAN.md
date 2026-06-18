# Implementation Plan — Al-Furqan Institute Moonsighting Website

## Context
The repo is greenfield (only `README.md`, `CLAUDE.md`, `docs/REQUIREMENTS.md`). We're
building a public website for Al-Furqan Institute centered on **moonsighting** — publishing
official Hijri-month verdicts for Melbourne, Australia (with Indonesian sightings as supporting
evidence), showing the Hijri calendar and moonsighting trips, and emailing subscribers the
moment a month is confirmed.

Decisions are locked (see `CLAUDE.md`): **Next.js App Router + Payload CMS (v3, Next-native) +
Postgres + Resend email + Vercel**, English-only, admin-only publishing, non-technical
maintainers. Confirmed months **always come from admin-entered verdicts, never auto-computed**.

This plan scaffolds the project, models the data as Payload collections, builds the public
pages, and wires up the verdict→email flow.

## Phase 1 — Scaffold & Tooling
- Initialize the app **in-place** with `npx create-payload-app@latest` using the **blank**
  template + **Postgres** adapter (Payload v3 lives inside Next.js App Router under an
  `(payload)` route group; public pages go under `(frontend)`).
- Result structure:
  ```
  src/
    app/(payload)/        # Payload admin + API (auto-generated)
    app/(frontend)/       # public site
    collections/          # Payload collection configs
    payload.config.ts
  ```
- Add **Chakra UI** for the frontend (`@chakra-ui/react` + `@emotion/react`). Wrap the
  `(frontend)` layout in a Chakra `Provider`; register it as a client component and use
  Next.js App Router SSR setup (`@chakra-ui/next-js` / Emotion cache) so styles render on the
  server. Define a custom theme (institute colors, fonts) in `src/theme.ts`. Keep Chakra
  scoped to `(frontend)` so it doesn't interfere with Payload's own admin styling.
- `.env`: `DATABASE_URL`, `PAYLOAD_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SERVER_URL`.
- Provision Postgres (Neon or Supabase free tier) for local + production.
- Use **Bun** as the package manager and runtime (`create-payload-app --use-bun`); commit
  `bun.lock` and run scripts via `bun run` / `bunx`.

## Phase 2 — Data Model (Payload collections)
One file per collection in `src/collections/`, registered in `payload.config.ts`.

- **Users** — `auth: true`, `roles` select field (`admin` | `editor`), `saveToJWT: true`,
  role updates restricted to admins. (Pattern from Payload RBAC docs.)
- **Verdicts** — `hijriMonth` (select of 12 Islamic months), `hijriYear` (number),
  `gregorianStartDate` (date), `status` (`sighted` | `not-sighted`), `region` (default
  Melbourne), `summary` (richText), `publishedAt`. An `afterChange` hook fires the subscriber
  email when a verdict is first published.
- **SightingReports** — `date`, `region` (`melbourne` | `indonesia` | `other`), `observer`,
  `method` (`naked-eye` | `optical-aid`), `result` (`sighted` | `not-sighted`), `conditions`,
  relationship → **Trips**. Indonesian reports surface as supporting evidence.
- **Trips** — `title`, `scheduledDate`, `sunsetTime`, `moonsetTime`, `location`, `attendees`,
  `status` (`upcoming` | `completed` | `cancelled`), `outcome` (richText).
- **HijriMonths** — `name`, `year`, `confirmedStartDate`, `isConfirmed` (bool). Drives the
  calendar; confirmed entries derive from Verdicts.
- **Announcements** — `title`, `body` (richText), `publishedAt`.
- **Subscribers** — `email` (unique), `confirmedAt`, `unsubscribeToken`. Double opt-in.

Access control: all collections **read: public** for published content; **create/update/delete**
restricted to authenticated `admin`/`editor`. Subscribers collection is admin-read only (PII).

## Phase 3 — Email (Resend)
- Configure `resendAdapter` in `payload.config.ts` (`defaultFromAddress`, `defaultFromName`,
  `apiKey`).
- **Subscribe flow:** public API route creates a `Subscriber` with an `unsubscribeToken`,
  sends a confirmation email (double opt-in); a `/confirm` route sets `confirmedAt`.
- **Verdict blast:** Verdict `afterChange` hook → on first publish, query confirmed subscribers
  and send the verdict email (React Email template) with an unsubscribe link.
- **Unsubscribe:** tokenized route clears the subscriber.

## Phase 4 — Public Site (`app/(frontend)`)
Server components fetching via the Payload Local API; all dates rendered in
**Australia/Melbourne** (Indonesian report times labeled with their own zone).

- **Home `/`** — hero with current Hijri date + Gregorian equivalent; **latest verdict banner**
  as the most prominent, unambiguous element ("is tomorrow Eid?"); next upcoming trip; email
  signup; recent announcements.
- **Calendar `/calendar`** — month-by-month Hijri view; confirmed vs. estimated distinguished
  (estimates from a vetted Hijri↔Gregorian library, **display-only**, never overriding verdicts);
  key dates (Ramadan, both Eids, Ashura, Arafah).
- **Trips `/trips`** — upcoming (date, sunset/moonset, location, attendees) + past archive with
  outcomes and linked sighting reports.
- **Verdicts `/verdicts`** — chronological archive of rulings.
- **About `/about`** — institute info + methodology (local sighting, role of Indonesian
  sightings, naked-eye vs. aided), contact.
- Shared: responsive mobile-first layout, header/footer nav, SEO metadata + Open Graph,
  WCAG AA.

## Phase 5 — Deploy
- Push to Vercel; set env vars; point at managed Postgres.
- Run Payload migrations (`push: false` + migrations in production).
- Configure Resend domain (SPF/DKIM) for deliverability.
- Verify CDN caching of public pages (static/ISR) to absorb Ramadan/Eid spikes.

## Key Files
- `src/payload.config.ts` — adapters (Postgres, Resend), collections, admin config.
- `src/collections/*.ts` — one per collection above.
- `src/collections/Verdicts.ts` — contains the `afterChange` email hook.
- `src/app/(frontend)/**` — public pages.
- `src/lib/hijri.ts` — display-only Hijri↔Gregorian conversion + Melbourne timezone formatting.
- `src/lib/email/` — Resend send helpers + React Email templates.
- `.env.example` — documents required env vars.
- `src/theme.ts` + `src/app/(frontend)/providers.tsx` — Chakra theme and client-side `Provider`.

## Reuse / References
- Payload v3 scaffolding: `npx create-payload-app` (blank + Postgres).
- Postgres adapter, Resend adapter, and RBAC `roles` patterns from Payload docs
  (`@payloadcms/db-postgres`, `@payloadcms/email-resend`).
- Payload **Local API** for data fetching in server components (no extra REST layer needed).

## Verification
1. `bun run dev` → visit `/admin`, create the first admin user.
2. In admin, create a Trip, a SightingReport (Melbourne + one Indonesia), and publish a Verdict.
3. Confirm the homepage shows the current Hijri date and the latest verdict banner; `/calendar`,
   `/trips`, `/verdicts`, `/about` render correctly on mobile widths.
4. Subscribe with a test email → receive double opt-in → confirm → publishing a new Verdict
   sends the blast; unsubscribe link works (check Resend dashboard/logs).
5. Verify all public times display in AEST/AEDT and Indonesian report times are labeled.
6. `bun run build` succeeds; deploy to Vercel and smoke-test the same flows in production.
