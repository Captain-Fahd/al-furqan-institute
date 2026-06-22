# Al-Furqan Institute

Official website for **Al-Furqan Institute**, an Islamic institute in Melbourne, Victoria, Australia. The site is built around their **moonsighting** work: determining Hijri (Islamic lunar) months by sighting the new crescent (hilal), publishing official verdicts for the local community, and documenting sighting trips and reports.

## What this website does

Muslims follow a lunar calendar. Each month begins when the new crescent is sighted after sunset on the 29th day of the previous month. On the evenings before Ramadan, Eid al-Fitr, and Eid al-Adha, families across Melbourne want a single, trusted answer: *has the moon been sighted, and when does the month begin?*

This website is that source of truth. It makes the institute's latest ruling impossible to miss, keeps a record of past verdicts and sighting attempts, and alerts subscribers the moment a month is confirmed.

### Public site

| Feature | Purpose |
|---|---|
| **Current status & verdict banner** | Prominent Hijri date with Gregorian equivalent, plus the latest official verdict (*Sighted / Not sighted → month begins [date]*). Optimised for the "is tomorrow Eid?" moment on mobile, at night. |
| **Hijri calendar** | Month-by-month view of confirmed start dates and key Islamic dates (Ramadan, both Eids, Ashura, Day of Arafah, etc.). Confirmed months are visually distinct from estimates. |
| **Moonsighting trips** | Upcoming trips with sunset/moonset times, location, and conditions; archive of past trips with outcomes. |
| **Sighting reports** | Per-attempt records: date, region, observer, method (naked eye / optical aid), result, and weather notes. Indonesian sightings are shown as supporting evidence. |
| **Announcements** | General institute news and updates. |
| **Email subscription** | Double opt-in alerts when a verdict is published; unsubscribe supported. |
| **About & methodology** | How the institute determines months (local sighting criteria, role of Indonesian sightings, naked-eye vs. aided) and contact details. |

### Admin dashboard

Non-technical staff manage all published content through a no-code **Payload CMS** admin UI:

- Post and edit **verdicts** (triggers email notifications to subscribers)
- Schedule **moonsighting trips** and record outcomes
- Add **sighting reports** with region tags
- Manage the **Hijri calendar**, announcements, and subscriber list
- Role-based access (admin vs. editor)

There is no public submission of sightings — authority and trust are paramount.

## Key domain decisions

- **Verdicts are issued for Melbourne, Victoria, Australia.** All default times use **AEST/AEDT** (`Australia/Melbourne`).
- **Indonesian sightings are supporting evidence** — Indonesia sights earlier and further west, so reports record *where* a sighting came from even though the published ruling is Melbourne-local.
- **Confirmed Hijri months always come from admin-entered verdicts, never auto-computed.** A Hijri↔Gregorian library may *estimate* upcoming dates for display, but the institute's sighting ruling is the source of truth. Calculation ≠ sighting.
- **English only**, left-to-right.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) — SSR/static for SEO and speed; one codebase for site + admin |
| Public UI | [Chakra UI](https://chakra-ui.com/) — scoped to the public `(frontend)` route group |
| CMS / Admin | [Payload CMS](https://payloadcms.com/) — self-hosted in-app, structured collections, role-based auth |
| Database | PostgreSQL |
| Email | [Resend](https://resend.com/) + React Email |
| Hosting | [Vercel](https://vercel.com/) (planned) |
| Package manager | [Bun](https://bun.sh/) |

## Project status

Early development. The public homepage shows an estimated Hijri date (Melbourne timezone) and hero UI; domain collections, verdict-aware calendar, email notifications, and additional public pages are in progress. See [`docs/REMAINING_WORK.md`](docs/REMAINING_WORK.md) for the current roadmap and [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) for full requirements.

## Local development

**Prerequisites:** [Bun](https://bun.sh/) 1.3+, [Docker](https://www.docker.com/) (for Postgres).

```bash
cp .env.example .env   # set PAYLOAD_SECRET and other values
docker compose up      # starts Postgres + dev server on :3000
```

Or run Postgres via Docker and the app locally:

```bash
docker compose up postgres -d
bun install
bun run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Payload admin: [http://localhost:3000/admin](http://localhost:3000/admin)

### Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start Next.js dev server |
| `bun run build` | Production build |
| `bun run test` | Unit, integration, and E2E tests |
| `bun run generate:types` | Regenerate Payload TypeScript types |

## Documentation

- [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md) — functional and non-functional requirements
- [`docs/REMAINING_WORK.md`](docs/REMAINING_WORK.md) — implementation phases and current status
- [`AGENTS.md`](AGENTS.md) — conventions for contributors and AI assistants
