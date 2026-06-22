---
name: Next Project Phases
overview: Early Phase 1 scaffold is done; Hijri estimate display (Step 1) is largely wired. Remaining work finishes Phase A foundation, builds the Payload data model, wires email notifications, ships the public site around the verdict banner, and deploys to production — aligned with [AGENTS.md](AGENTS.md) and [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md).
todos:
  - id: phase-a-foundation
    content: "Phase A: Tooling cleanup, Users RBAC, Hijri test/fixture polish, E2E updates"
    status: in_progress
  - id: phase-b-collections
    content: "Phase B: All domain Payload collections + access control + Verdict→HijriMonth hook"
    status: pending
  - id: phase-c-email
    content: "Phase C: Resend adapter, subscribe/confirm/unsubscribe routes, verdict email blast"
    status: pending
  - id: phase-d-homepage
    content: "Phase D: Payload data layer, verdict override resolver, verdict banner, homepage + /subscribe"
    status: pending
  - id: phase-e-pages
    content: "Phase E: /calendar, /trips, /reports, /verdicts, /about"
    status: pending
  - id: phase-f-launch
    content: "Phase F: ISR/caching, Vercel deploy, Resend DNS, E2E smoke tests"
    status: pending
isProject: false
---

# Al-Furqan Institute — Next Phases

## Current state


| Area                                   | Status                                                                                                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Payload + Next.js + Postgres adapter   | Done ([`payload.config.ts`](src/app/(payload)/payload.config.ts))                                                                                                                                      |
| Chakra UI, brand theme, layout, navbar | Done ([`theme.ts`](src/components/theme.ts), [`Navbar.tsx`](src/components/nav/Navbar.tsx))                                                                                                            |
| Homepage hero — Hijri date             | **Live estimates** via `hijri-date`, Melbourne timezone ([`hijriDate.ts`](src/lib/controllers/hijriDate.ts) → [`hijri.ts`](src/lib/hijri/hijri.ts) → [`HeroBrand.tsx`](src/components/hero/HeroBrand.tsx)); shows "Estimated · month start pending verdict" |
| Homepage hero — prayer times           | UI done; **placeholder data** ([`prayerTimes.ts`](src/lib/prayerTimes.ts))                                                                                                                             |
| Hijri unit tests                       | **Started** ([`tests/unit/`](tests/unit/)) — picked up by Vitest via `tests/unit/**/*.spec.ts`                                                                                                        |
| Verdict-aware Hijri override           | **Not started** — estimates only; confirmed months will come from Payload Verdicts (Phase B + D)                                                                                                       |
| Domain collections                     | **Not started** — only `Users` + `Media`                                                                                                                                                               |
| Email / Resend                         | **Not started**                                                                                                                                                                                        |
| Public pages beyond `/`                | **Not started** (nav links 404)                                                                                                                                                                        |
| Deploy                                 | **Not started**                                                                                                                                                                                        |


Structural debt to clear early: stale E2E tests ([`frontend.e2e.spec.ts`](tests/e2e/frontend.e2e.spec.ts)) still assert the Payload blank template; Users RBAC and Hijri helper polish remain in Phase A.

```mermaid
flowchart LR
  subgraph done [Done]
    Scaffold[Payload + Chakra scaffold]
    HeroUI[Hero + Navbar UI]
    HijriEstimate[Hijri estimate display]
  end
  subgraph next [Next]
    Foundation[Phase A: Foundation remainder]
    DataModel[Phase B: Data model]
    Email[Phase C: Email]
    PublicCore[Phase D: Public core]
    PublicPages[Phase E: Remaining pages]
    Launch[Phase F: Launch]
  end
  Scaffold --> Foundation
  HeroUI --> Foundation
  HijriEstimate --> DataModel
  Foundation --> DataModel
  DataModel --> Email
  DataModel --> PublicCore
  Email --> PublicCore
  PublicCore --> PublicPages
  PublicPages --> Launch
```



---

## Phase A — Finish foundation (complete original Phase 1)

**Goal:** Stable dev environment and shared utilities before CMS work.

### Done (Hijri Step 1 — estimate fallback)

- **`hijri-date` library** integrated with TypeScript shim ([`src/types/hijri-date.d.ts`](src/types/hijri-date.d.ts)).
- **Melbourne-anchored conversion** — `getMelbourneGregorianDate()`, `gregorianToHijriParts()`, exported `HIJRI_MONTHS` in [`hijriDate.ts`](src/lib/controllers/hijriDate.ts).
- **Hero display wired** — `getFormattedHijriDate()` → `getHijriDateDisplay()` ([`src/lib/hijri/`](src/lib/hijri/)) shows live estimated Hijri + Gregorian labels with `isEstimated: true`.
- **Unit tests drafted** — [`gregorianToHijriParts.spec.ts`](tests/unit/gregorianToHijriParts.spec.ts), [`getMelbourneGregorianDate.spec.ts`](tests/unit/getMelbourneGregorianDate.spec.ts); `test:unit` script added to [`package.json`](package.json).

### Remaining

- **Tooling cleanup** — done
  - [`.env.example`](.env.example): Postgres `DATABASE_URL`, `PAYLOAD_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SERVER_URL`.
  - [`docker-compose.yml`](docker-compose.yml): Postgres 16 + `oven/bun:1-alpine` dev service.
  - [`package.json`](package.json): Bun-only engines; `test` runs unit + int + e2e.
  - Chakra providers consolidated under [`src/components/ui/`](src/components/ui/); stray `(frontend)/src/` tree removed.
  - Vitest include glob updated to `tests/unit/**/*.spec.ts`.
- **Admin auth (RBAC)**
  - Extend [`Users.ts`](src/app/(payload)/collections/Users.ts) with `roles` (`admin` | `editor`), `saveToJWT: true`, admin-only role updates (per [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)).
- **Hijri polish**
  - ~~Fix Vitest include glob~~ — done (see tooling cleanup).
  - ~~Align `gregorianToHijriParts` `isEstimated` flag with tests~~ — done (`isEstimated: true` for library conversions).
  - Consolidate duplicate `getMelbourneToday` / `getMelbourneGregorianDate` helpers in `hijriDate.ts`.
  - Optionally move logic from `controllers/hijriDate.ts` → `src/lib/hijri/estimate.ts` + `format.ts`; align month spellings with Payload Verdict select (`Rabi'I` vs `Rabi' I`).
  - Add remaining unit tests: `formatHijriDateDisplay`, `getFormattedHijriDate` with fake timers, `getHijriDateDisplay` passthrough.
- **Tests**
  - Update E2E to assert live Hijri line on homepage (not hardcoded placeholder strings).
  - Keep integration test pattern in [`api.int.spec.ts`](tests/int/api.int.spec.ts).

**Exit criteria:** `bun run dev` + `bun run build` pass; `bun run test:unit` green; admin user with roles works; hero shows live estimated Hijri date.

---

## Phase B — Data model (original Phase 2)

**Goal:** Full CMS for non-technical staff; public read access for published content.

Add collections under [`src/app/(payload)/collections/`](src/app/(payload)/collections/), register in [`payload.config.ts`](src/app/(payload)/payload.config.ts), run `bun run generate:types`.


| Collection          | Key fields                                                                                          | Notes                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Verdicts**        | hijriMonth, hijriYear, gregorianStartDate, status, region (default Melbourne), summary, publishedAt | Source of truth for month starts                         |
| **SightingReports** | date, region, observer, method, result, conditions, trip (rel)                                      | Indonesia flagged as supporting evidence in admin labels |
| **Trips**           | title, scheduledDate, sunset/moonset, location, attendees, status, outcome                          |                                                          |
| **HijriMonths**     | name, year, confirmedStartDate, isConfirmed                                                         | Populated/updated via Verdict `afterChange` hook         |
| **Announcements**   | title, body, publishedAt                                                                            |                                                          |
| **Subscribers**     | email (unique), confirmedAt, unsubscribeToken                                                       | PII — admin read only                                    |


**Access control pattern:**

- Published content: `read` public (filter `publishedAt` not null where applicable).
- `create` / `update` / `delete`: authenticated `admin` or `editor`.
- Subscribers: no public read; public create only via dedicated API route (Phase C).

**Verdict hook (stub):** `afterChange` on first publish → upsert matching `HijriMonth` with `isConfirmed: true`; call email sender when Phase C is wired.

**Shared constants:** Reuse exported `HIJRI_MONTHS` from [`hijriDate.ts`](src/lib/controllers/hijriDate.ts) (or `src/lib/hijri/constants.ts`) for the Verdict `hijriMonth` select field.

**Exit criteria:** Staff can log into `/admin`, create a Trip + SightingReport (Melbourne + Indonesia) + Verdict; `HijriMonth` reflects the verdict.

---

## Phase C — Email notifications (original Phase 3)

**Goal:** Double opt-in subscriptions and verdict blast on publish.

- Add `@payloadcms/email-resend` + `resend` to dependencies; configure adapter in `payload.config.ts`.
- **`src/lib/email/`** — React Email templates: confirmation, verdict notification (with unsubscribe link).
- **Public routes:**
  - `POST /api/subscribe` — create pending subscriber, send confirmation.
  - `GET /confirm?token=…` — set `confirmedAt`.
  - `GET /unsubscribe?token=…` — remove/deactivate subscriber.
- **Verdict blast:** complete the `afterChange` hook — query `confirmedAt != null` subscribers, send via Resend.

**Exit criteria:** Test email flow end-to-end locally; publishing a verdict emails confirmed subscribers only.

---

## Phase D — Public site core (homepage + data layer)

**Goal:** Deliver the "is tomorrow Eid?" moment — the highest-priority requirement from [AGENTS.md](AGENTS.md).

- **`src/lib/payload.ts`** — `getPayload()` helper for server components (Payload Local API).
- **`src/lib/hijri/resolve.ts`** — verdict-aware resolver: query latest published Melbourne `sighted` Verdict; override estimate month/year/day; set `isEstimated: false` when a covering verdict exists.
- **`src/lib/dates.ts`** — Melbourne timezone formatting; Indonesian report times labeled with their zone.
- **Homepage [`page.tsx`](src/app/(frontend)/page.tsx)** — extend beyond hero:
  1. **Latest verdict banner** — most prominent element: *Sighted / Not sighted → month begins [date]*, timestamped.
  2. Next upcoming trip (if any).
  3. Recent announcements.
  4. Email signup CTA (links to `/subscribe`).
- **`/subscribe`** — signup form + success/pending states.
- **Shared layout** — footer, page-level SEO metadata, mobile-first spacing under fixed navbar.

**Exit criteria:** Homepage reads live data from Payload; Hijri line flips from estimated to confirmed when a verdict is published; verdict banner is unambiguous on a phone at night; subscribe flow works.

---

## Phase E — Remaining public pages (original Phase 4)

Build server-component pages fetching via Local API; reuse shared card/list patterns.


| Route       | Content                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| `/calendar` | Month grid; confirmed vs estimated months visually distinct; key Islamic dates (Ramadan, Eids, Ashura, Arafah) |
| `/trips`    | Upcoming + past archive with outcomes and linked reports                                                       |
| `/reports`  | Sighting report list; Indonesian entries labeled "supporting evidence"                                         |
| `/verdicts` | Chronological verdict archive                                                                                  |
| `/about`    | Methodology (local sighting, Indonesia role, naked-eye vs aided), contact                                      |


**Exit criteria:** All nav links in [`nav-config.ts`](src/components/nav/nav-config.ts) resolve; mobile layouts verified; WCAG AA basics (contrast already on-brand, focus states, semantic headings).

---

## Phase F — Launch and hardening (original Phase 5)

**Goal:** Production-ready, spike-tolerant site.

- **Caching:** ISR / `revalidate` on public pages (verdict banner can use short revalidate or on-demand revalidation when verdict publishes).
- **Deploy:** Vercel + managed Postgres (Neon/Supabase); env vars; Payload migrations (`push: false` in prod).
- **Resend:** SPF/DKIM on institute domain.
- **SEO:** Per-page metadata, Open Graph, indexable verdict/calendar URLs for queries like "is it Eid tomorrow Melbourne".
- **E2E smoke tests:** Admin publish verdict → homepage updates; subscribe + confirm + blast.
- **Start fresh:** no historical seeding (per your decision); staff enter data from launch.

**Exit criteria:** Production smoke test passes; spike-ready static/ISR pages; email deliverability verified.

---

## Deferred (post-launch)

- **Al-Adhan prayer times** — integrate live Melbourne prayer times into [`PrayerTimesPanel`](src/components/hero/PrayerTimesPanel.tsx) when ready; keep current placeholder until then.
- **Historical data import** — only if institute later requests backfill.
- **Open points from requirements:** subscriber volume/budget, custom domain, branding refinements beyond current logo/colors.

---

## Suggested execution order

Work strictly in phase order **A → B → C → D → E → F**. Phase C and D can overlap slightly once B is done (verdict hook stub in B, email wiring in C, frontend in D), but **do not ship the public verdict banner before B** — it must read real verdicts, not placeholders.

**Next concrete tasks:** Phase A remainder (Users RBAC, Hijri helper consolidation, E2E homepage assertions) → Phase B Verdicts collection with shared `HIJRI_MONTHS` → Phase D verdict override resolver on top of the existing estimate layer.
