---
name: GitHub Actions CI/CD
overview: "Set up two GitHub Actions workflows: a CI pipeline (lint, typecheck, unit/integration tests, build) and a Vercel deploy pipeline (preview on PRs, production on merge to main). Also fix the `playwright.config.ts` bug where the dev server command references `pnpm` instead of `bun`."
todos:
  - id: fix-playwright
    content: "Fix playwright.config.ts: pnpm dev → bun run dev, uncomment baseURL"
    status: pending
  - id: create-ci
    content: Create .github/workflows/ci.yml with lint, typecheck, unit, integration, and build jobs
    status: pending
  - id: create-deploy
    content: Create .github/workflows/deploy.yml for Vercel production deploy on push to main
    status: pending
isProject: false
---

# GitHub Actions CI/CD Setup

## What gets created

Two workflow files + one small fix to an existing config.

---

## Files to create

### 1. `.github/workflows/ci.yml`

Triggers on every push and every PR targeting `main`.

```
Jobs (run in parallel where possible):
  lint-and-typecheck  →  no external deps
  unit-tests          →  no external deps
  integration-tests   →  needs Postgres service
  build               →  needs Postgres service; runs after all tests pass
```

**Postgres service config** (for `integration-tests` and `build` jobs):

```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: al_furqan_ci
    options: >-
      --health-cmd pg_isready
      --health-interval 5s
      --health-retries 5
```

**Env vars injected** (no secrets needed for CI — safe dummy values for test/build):
- `DATABASE_URL=postgres://postgres:postgres@localhost:5432/al_furqan_ci`
- `PAYLOAD_SECRET=ci-secret-placeholder`
- `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`

**Bun setup** (all jobs):
```yaml
- uses: oven-sh/setup-bun@v2
  with:
    bun-version: '1.3.14'   # matches engines.bun in package.json
- run: bun install --frozen-lockfile
```

**E2E excluded** from CI for now — `frontend.e2e.spec.ts` still asserts the blank-template placeholder text (noted in `REMAINING_WORK.md`). A comment in the workflow marks where to re-enable once Phase A E2E updates land.

---

### 2. `.github/workflows/deploy.yml`

Triggers on push to `main` only, and requires all CI jobs to have passed (via `needs: [build]` on a `workflow_call` or by running jobs sequentially).

Uses the Vercel CLI (`bunx vercel`) with three steps:
1. `vercel pull --yes --environment=production` — downloads project config + production env vars from Vercel
2. `vercel build --prod` — builds the Next.js app locally with production env
3. `vercel deploy --prebuilt --prod` — uploads the pre-built artifact

**Required GitHub Secrets** (documented in workflow comments):
- `VERCEL_TOKEN` — from Vercel account settings → Tokens
- `VERCEL_ORG_ID` — from `.vercel/project.json` after `vercel link`
- `VERCEL_PROJECT_ID` — from `.vercel/project.json` after `vercel link`

These secrets hold the production `DATABASE_URL`, `PAYLOAD_SECRET`, and `RESEND_API_KEY` — they are pulled from Vercel's environment vault via `vercel pull`, so they don't need to be duplicated as GitHub secrets.

---

## File to fix

### [`playwright.config.ts`](playwright.config.ts)

Line 37 reads `command: 'pnpm dev'`. Fix to:
```ts
command: 'bun run dev',
```
Also uncomment `baseURL: 'http://localhost:3000'` (line 25) so Playwright uses it in CI.

---

## Workflow dependency diagram

```mermaid
flowchart TD
  push([Push / PR]) --> lint[lint-and-typecheck]
  push --> unit[unit-tests]
  push --> integ[integration-tests\nPostgres service]
  lint --> build[build\nPostgres service]
  unit --> build
  integ --> build
  build -->|main branch only| deploy[deploy to Vercel\nprod]
```

---

## Secrets setup checklist (one-time, not in workflow files)

1. `vercel link` locally to create `.vercel/project.json` → read `orgId` + `projectId`
2. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` to GitHub repo → Settings → Secrets
3. In Vercel dashboard: add `DATABASE_URL`, `PAYLOAD_SECRET`, `RESEND_API_KEY`, `NEXT_PUBLIC_SERVER_URL` as environment variables for Production (these are pulled by `vercel pull` at deploy time)
