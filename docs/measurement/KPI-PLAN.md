---
title: "DevHub — KPI and Instrumentation Plan"
status: draft
created: 2026-10-21
updated: 2026-10-21
description: "What DevHub measures, from which source, and what is still missing before the numbers can be trusted."
template: architecture-docs templates/sdlc/kpi-and-instrumentation-plan.md
---

# DevHub — KPI and Instrumentation Plan

## Document control

| Field | Value |
|---|---|
| Product | bookchaowalit-website/devtools-devhub-web (https://devhub.bookchaowalit.com) |
| Version / status | 0.1 / **draft** — nothing below is instrumented beyond page views and Web Vitals |
| Metric owner | Owner (bookchaowalit) |
| AI maker | Claude Code (Wave 3 session, 2026-10-21) |
| Analytics source of truth | Vercel Web Analytics + Speed Insights (already in `src/app/layout.tsx`); Sentry for errors |
| Dashboard | Vercel project `bookchaowalit-devhub-frontend` → Analytics / Speed Insights |
| Next review | 2026-11-15 (Milestone M1) |

## KPI tree

```text
OBJ-01 Developers can find and try the portfolio's MCP APIs without reading source
  └─ KPI-O-01 Playground success rate
       ├─ KPI-L-01 Visits that reach an API detail page or the Playground
       ├─ KPI-G-01 Client-side error events per 1,000 page views
       └─ KPI-G-02 LCP p75 on mobile
```

## KPI definitions

| KPI ID | Type | Name | Formula | Unit | Min volume | Source / events | Baseline | Target | Alert | Cadence |
|---|---|---|---|---|---|---|---|---|---|---|
| KPI-O-01 | outcome | Playground success rate | `playground_request_succeeded` / `playground_request_sent` | % | ≥ 50 requests per period | Custom events (planned) | not yet measured | ≥ 95% by 2026-12-31 | < 80% over 7 days | weekly |
| KPI-L-01 | leading | Visits reaching `/apis/*` or `/playground` | visits with a page view on those paths / all visits | % | ≥ 100 visits | Vercel Web Analytics page views (live) | not yet measured | set after baseline | — | weekly |
| KPI-G-01 | guardrail | Client errors per 1,000 page views | Sentry error events / page views × 1000 | count | ≥ 1,000 page views | Sentry (code merged, DSN not set yet) + Web Analytics | not yet measured | must not rise after a release | > 5 | weekly |
| KPI-G-02 | guardrail | LCP p75, mobile | Speed Insights p75 LCP | ms | Speed Insights minimum | Vercel Speed Insights (live) | not yet measured | ≤ 2,500 ms | > 4,000 ms | weekly |

A KPI without a baseline cannot be used to claim a benefit. Below the minimum volume a rate is reported as "not measurable".

## Event and data specification

| Event | Trigger | Properties | Personal data? | Emitted by | Status |
|---|---|---|---|---|---|
| page view | Route load | path | no (Vercel Web Analytics is cookieless) | `@vercel/analytics` | implemented |
| `playground_request_sent` | User presses Send in `/playground` | `api_id`, `method` | no | frontend | planned |
| `playground_request_succeeded` / `_failed` | Response parsed / fetch or JSON-RPC error | `api_id`, `status_class` | no | frontend | planned |

Never send the request body, the target URL query, or response content. Custom events in Vercel Web
Analytics need a paid Vercel plan; choosing the event tool is an owner decision (ADR-0005 default stack).

## Dashboards and alerts

| Dashboard / alert | KPIs | Location | Status |
|---|---|---|---|
| Vercel Web Analytics | KPI-L-01 | Vercel project dashboard | live (page views only) |
| Vercel Speed Insights | KPI-G-02 | Vercel project dashboard | live |
| Sentry issues | KPI-G-01 | Sentry org `personal-yu0` | planned: project + DSN not created yet |

## Instrumentation verification (before G10)

| # | Check | Result |
|---|---|---|
| 1 | Each event fires once per real action | not run: custom events not implemented |
| 2 | Counts reconcile with a system of record | N/A until events exist |
| 3 | No personal data in payloads | Sentry scrubbing covered by `tests/sentry.test.ts`; analytics events not implemented |
| 4 | Dashboard renders each KPI | partial: page views and Web Vitals only |
| 5 | Alerts reach the channel | not set up |
| 6 | Baselines captured | waived — dated action: capture KPI-L-01 and KPI-G-02 baselines by 2026-11-15 |
| 7 | Consent respected | Vercel Web Analytics is cookieless; recheck when custom events are added |

## Known gaps

- Deployment is not from Git (see `specs/001-strict-build-ci-sentry/spec.md` section 6), so measurement of a
  release depends on a manual deploy.
