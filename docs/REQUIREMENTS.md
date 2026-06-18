# Al-Furqan Institute — Moonsighting Website Requirements

## 1. Overview
A website for **Al-Furqan Institute** centered on their **moonsighting** effort:
determining Hijri (Islamic lunar) months by sighting the new crescent (hilal),
and keeping the community informed about official verdicts and sighting trips.

## 2. Context & Key Decisions
- **Authority / location:** Verdicts are issued **for Melbourne, Victoria, Australia**.
  **Indonesian sightings are used as supporting evidence** (Indonesia sights earlier /
  further west), so the data model records *where* a sighting came from even though the
  published ruling is Melbourne-local.
- **Publishing model:** **Admin-only.** No public submission. Authority and trust are paramount.
- **Notifications:** **Email** subscriptions.
- **Language:** **English only** (left-to-right).
- **Maintainers:** **Non-technical staff** — must have a simple, no-code admin dashboard.

## 3. Functional Requirements

### 3.1 Public Site
1. **Hero / current status** — Prominent current Hijri date with Gregorian equivalent
   (e.g. "Today is 12 Dhul-Hijjah 1447 AH · Thursday 18 June 2026") plus the latest verdict.
2. **Latest verdict banner** — Clear, timestamped, unambiguous:
   *Sighted / Not sighted → month begins [date]*. Optimized for the "is tomorrow Eid?" moment.
3. **Hijri calendar** — Month-by-month view showing confirmed start dates and key Islamic
   dates (Ramadan, Eid al-Fitr, Eid al-Adha, Ashura, Day of Arafah, etc.).
   Confirmed vs. estimated months visually distinguished.
4. **Moonsighting trips**
   - *Upcoming:* date, sunset/moonset times, location, conditions, attendees.
   - *Past:* archive with the outcome of each trip.
5. **Sighting reports** — Per attempt: date, location (Melbourne / Indonesia / other),
   observer, method (naked eye / optical aid), result, weather/visibility notes.
   Indonesian reports flagged as supporting evidence.
6. **Announcements / news feed** — General institute updates.
7. **Email subscription** — Sign up to be alerted the moment a month is confirmed;
   double opt-in + unsubscribe (compliance).
8. **About / Methodology** — Which criteria the institute follows (local sighting, role of
   Indonesian sightings, naked-eye vs. aided) and contact info. Establishes trust.

### 3.2 Admin Dashboard (no-code, for staff)
9. Post/edit verdicts → triggers the email blast.
10. Create/edit moonsighting trips and their outcomes.
11. Add sighting reports (with region tag).
12. Manage calendar months, announcements, and the subscriber list.
13. Login/auth with roles (admin vs. editor).

## 4. Non-Functional Requirements
- **Mobile-first** — Most traffic is phones, at night, the evening of a sighting.
- **Spike-tolerant** — Large surges the eve of Ramadan/Eid; static/cached pages +
  serverless backend handle this cheaply.
- **Accurate timezones** — All times in **AEST/AEDT (Australia/Melbourne)**;
  Indonesian report times clearly labeled in their zone.
- **Accessibility** — WCAG AA.
- **SEO** — People search "is it Eid tomorrow Melbourne"; fast, indexable pages.
- **Low maintenance & low cost** — Small, likely volunteer-run institute.

## 5. Recommended Tech Stack
| Layer | Recommendation | Why |
|---|---|---|
| Framework | **Next.js (App Router)** | SSR/static for SEO + speed; one codebase for site + admin |
| CMS / Admin | **Payload CMS** (Next-native, self-hosted in same app) | Polished no-code admin UI; structured collections; role-based auth built in |
| Database | **Postgres** (Supabase or Neon) | Reliable, managed, free tier |
| Email | **Resend** + React Email | Simple API, good deliverability, audience/unsubscribe management |
| Hosting | **Vercel** | Auto-scaling + CDN caching absorbs Ramadan/Eid spikes; generous free tier |
| Hijri dates | Vetted Hijri↔Gregorian library, but **confirmed months always come from admin-entered verdicts**, never auto-computed | Calculation ≠ sighting; the institute's ruling is the source of truth |

> **Alternative:** Next.js + Supabase with a small custom admin. Payload wins for
> non-technical staff because the dashboard comes free.

## 6. Core Data Model
- **Verdict** — hijriMonth, hijriYear, gregorianStartDate, status (sighted/not-sighted),
  region (Melbourne), summary, publishedAt → fires email.
- **SightingReport** — date, region (Melbourne/Indonesia/other), observer, method, result,
  conditions, linked Trip.
- **Trip** — title, scheduledDate, sunsetTime, moonsetTime, location, attendees, status, outcome.
- **HijriMonth** — name, year, confirmedStartDate, isConfirmed.
- **Announcement** — title, body, publishedAt.
- **Subscriber** — email, confirmedAt, unsubscribeToken.

## 7. Open Points (non-blocking)
1. **Email volume/budget** — Expected subscriber count? (Resend free tier ≈ 3k emails/month.)
2. **Domain** — Existing domain, or need one registered?
3. **Branding** — Existing logo/colors, or should the design establish them?
4. **Past data** — Historical verdicts/trips to seed the calendar, or start fresh?
