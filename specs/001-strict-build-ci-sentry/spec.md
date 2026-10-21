---
title: "SPEC-001 — Strict build, shared CI and Sentry error reporting"
status: implemented
tags: [spec, sdd, tdd, ci, sentry]
created: 2026-10-21
updated: 2026-10-21
description: "Stop hiding type and lint errors in the production build, run the shared CI and security scan on every push, and report runtime errors to Sentry without personal data."
---

# SPEC-001 — Strict build, shared CI and Sentry error reporting

Standard: ADR-0004 (TDD + SDD). Plan: Big Loop Plan 2026-10-21, Wave 3 (repository-catalog).

## Document control

| Field | Value |
|---|---|
| Spec ID / version | SPEC-001 / 1.0 |
| Status | implemented |
| Repository | bookchaowalit-website/devtools-devhub-web |
| Owner (maker) | Claude Code (Wave 3 session) |
| Approver | Owner (bookchaowalit) |
| Requirement links | Big Loop Plan Wave 3 items 1, 2, 5; Definition of Done L1–L3 |

## 1. Problem and intent

- **Problem:** `next.config.ts` set `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, so a broken
  build could ship. The repository had no CI, and runtime errors on the live site were invisible.
- **Outcome:** the build fails on type or lint errors; every push runs lint, typecheck, tests, build and the
  security scan; runtime errors reach Sentry when a DSN is configured, with no request data or user data.

## 2. Scope

| In scope | Out of scope |
|---|---|
| `next.config.ts`, `.github/workflows/ci.yml`, `src/lib/sentry.ts`, `src/instrumentation*.ts` | UI changes; product analytics events (see `docs/measurement/KPI-PLAN.md`); deploying (see section 6) |

## 3. Behaviour — scenarios

### AC-01 — The build does not suppress errors
- **Given** `next.config.ts` **When** it is loaded **Then** neither `typescript.ignoreBuildErrors` nor `eslint.ignoreDuringBuilds` is `true`
- **Test:** `tests/next-config.test.ts` (unit). Also shown by the first strict build failing on a Sentry option type error before the fix.

### AC-02 — Sentry is off without a DSN
- **Given** `NEXT_PUBLIC_SENTRY_DSN` is unset **When** Sentry initialises **Then** it is disabled
- **Test:** `tests/sentry.test.ts` "stays disabled when no DSN is configured"

### AC-03 — Errors only, no personal data
- **Given** a DSN **Then** `sendDefaultPii` is false, tracing is off, no trace headers are added to outgoing requests, breadcrumbs are off and transactions are dropped
- **And** every event loses `request`, `user`, `breadcrumbs`, `extra` and stack-frame local variables before it is sent
- **Test:** `tests/sentry.test.ts`

### AC-04 — CI runs the shared workflows on every push
- **Given** a push to `main` **Then** `ci-node.yml` (lint, typecheck, tests required, `npm run build`) and `security.yml` run, pinned to v1.1.1 (`87dc5e1`)
- **Test:** the GitHub Actions run for the commit that adds `ci.yml`

## 4. Interfaces and data

| Interface | Change |
|---|---|
| Environment | `NEXT_PUBLIC_SENTRY_DSN` (optional). Set as a Vercel project env var; never committed. |
| Dependencies | `@sentry/nextjs` ^11 |

## 5. Non-functional requirements

| NFR | Target | How it is tested |
|---|---|---|
| Privacy | No URL, header, cookie, body, user or local variable leaves the browser or server | AC-03 unit tests |
| Build safety | Type or lint error fails the build | AC-01 + CI build step |

## 6. Deployment and known gap

Vercel project `bookchaowalit-devhub-frontend` is still linked to the pre-transfer repository name
`bookchaowalit/bookchaowalit-devhub-frontend`. The last Git-triggered deployment was 2026-02-28; later
production deploys were made by hand with the Vercel CLI. Merging this spec therefore does not deploy it.
No deploy workflow is added: the repository does not deploy from Git today. Owner action: reconnect the
Vercel Git integration to `bookchaowalit-website/devtools-devhub-web` (or approve a CLI deploy), then set
`NEXT_PUBLIC_SENTRY_DSN` in the Vercel project.
