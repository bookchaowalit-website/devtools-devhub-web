# ADR-0004 — Sentry errors only, scrubbed, disabled without DSN

Status: **accepted (retro-documented)** — implemented by SPEC-001 (2026-10-21), scrub tightened `e0fe45e` (2026-10-23)

## Decision (as seen in code)

- `sentryOptions(dsn)`: `enabled: Boolean(dsn)`, `sendDefaultPii: false`, `tracesSampleRate: undefined`, `tracePropagationTargets: []`, `maxBreadcrumbs: 0`, `beforeSend: scrubEvent`, `beforeSendTransaction: () => null`
- `scrubEvent` ลบ `request`, `user`, `breadcrumbs`, `extra`, frame `vars`; เก็บ contexts เฉพาะ `os, runtime, browser, device, app`; ตัด query/hash ใน transaction, tags, exception message, frame filename/abs_path, debug images
- init ทั้ง server/edge (`src/instrumentation.ts` `register`, `onRequestError = Sentry.captureRequestError`) และ browser (`src/instrumentation-client.ts`) ด้วย env `NEXT_PUBLIC_SENTRY_DSN`

## Evidence

`src/lib/sentry.ts`, `src/instrumentation.ts`, `src/instrumentation-client.ts`, `tests/sentry.test.ts`, `specs/001-strict-build-ci-sentry/spec.md` AC-02/AC-03

## Consequences

- `NEXT_PUBLIC_*` ถูก inline ตอน build — เปลี่ยน DSN ต้อง redeploy (build ใหม่) จึงมีผลกับ browser bundle
- ไม่มี tracing/performance ใน Sentry; ไม่มี source map upload (`next.config.ts` ไม่มี `withSentryConfig`)
