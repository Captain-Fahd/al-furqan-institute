# CLAUDE.md

Guidance for working in this repository.

## Project
Website for **Al-Furqan Institute**, an Islamic institute, centered on their **moonsighting**
effort: determining Hijri (Islamic lunar) months by sighting the new crescent (hilal) and
keeping the community informed about official verdicts and sighting trips.

See [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) for the full requirements.

## Key Domain Decisions
- **Verdicts are issued for Melbourne, Victoria, Australia.** All times default to
  **AEST/AEDT (Australia/Melbourne)**.
- **Indonesian sightings are supporting evidence** (Indonesia sights earlier / further west).
  Sighting reports must record their **region** even though the published ruling is Melbourne-local.
- **Admin-only publishing.** No public submission of sightings — authority and trust are paramount.
- **Confirmed Hijri months always come from admin-entered verdicts, never auto-computed.**
  Calculation ≠ sighting; the institute's ruling is the source of truth. A Hijri↔Gregorian
  library may *estimate/display* upcoming dates but must never override a verdict.
- **English only**, left-to-right.
- **Email** is the notification channel; double opt-in + unsubscribe required.
- Maintainers are **non-technical staff** — the admin experience must be no-code.

## Tech Stack
| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** | SSR/static for SEO + speed; one codebase for site + admin |
| UI (frontend) | **Chakra UI** (`@chakra-ui/react` + Emotion) | Component library for the public site; SSR-wired Provider, scoped to `(frontend)` so it doesn't touch Payload admin styling |
| CMS / Admin | **Payload CMS** (Next-native, self-hosted in-app) | No-code admin UI, structured collections, role-based auth |
| Database | **Postgres** (Supabase or Neon) | Managed, free tier |
| Email | **Resend** + React Email | Deliverability, audience/unsubscribe management |
| Hosting | **Vercel** | Auto-scaling + CDN caching for Ramadan/Eid traffic spikes |
| Dates | Vetted Hijri↔Gregorian library | For display/estimates only — see domain decisions above |

## Core Data Model
- **Verdict** — hijriMonth, hijriYear, gregorianStartDate, status (sighted/not-sighted),
  region (Melbourne), summary, publishedAt → fires email.
- **SightingReport** — date, region (Melbourne/Indonesia/other), observer, method, result,
  conditions, linked Trip.
- **Trip** — title, scheduledDate, sunsetTime, moonsetTime, location, attendees, status, outcome.
- **HijriMonth** — name, year, confirmedStartDate, isConfirmed.
- **Announcement** — title, body, publishedAt.
- **Subscriber** — email, confirmedAt, unsubscribeToken.

## Non-Functional Priorities
- **Mobile-first** — most traffic is phones, at night, the evening of a sighting.
- **Spike-tolerant** — surges the eve of Ramadan/Eid; prefer static/cached pages + serverless.
- **Accessible** (WCAG AA) and **SEO-friendly** (e.g. "is it Eid tomorrow Melbourne").
- **Low maintenance & low cost** — small, volunteer-run institute.

## Conventions
- **Bun** is the package manager and runtime — use `bun install`, `bun run <script>`, `bunx`
  (commit `bun.lock`, not `package-lock.json`).
- Times stored in UTC, displayed in Australia/Melbourne; label Indonesian report times with
  their own zone.
- The latest verdict must be the most prominent, unambiguous element on the homepage
  (the "is tomorrow Eid?" moment).
