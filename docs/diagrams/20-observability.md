# 20 — Observability

Status: **done** (reuse [docs/measurement/KPI-PLAN.md](../measurement/KPI-PLAN.md) สำหรับ KPI/alert targets)

```mermaid
flowchart LR
  subgraph SIG["Signals emitted"]
    E1["Browser errors: instrumentation-client.ts"]
    E2["Server and edge errors: register plus onRequestError"]
    E3["Page views: Analytics component"]
    E4["Web Vitals: SpeedInsights component"]
    E5["Build marker: GET /api/health"]
  end
  subgraph SINK["Where they land"]
    K1["Sentry, scrubbed by scrubEvent"]
    K2["Vercel Web Analytics"]
    K3["Vercel Speed Insights"]
    K4["Deploy smoke job log"]
    K5["Vercel runtime logs, platform default"]
  end
  subgraph WATCH["Who is notified"]
    N1["Sentry issue alert: default rules, not configured in repo"]
    N2["GitHub Actions failure notification to owner"]
    N3["Nobody: dashboards only, read weekly per KPI-PLAN"]
  end
  E1 --> K1
  E2 --> K1
  E3 --> K2
  E4 --> K3
  E5 --> K4
  K1 --> N1
  K4 --> N2
  K2 --> N3
  K3 --> N3
```

Sources: `src/instrumentation.ts`, `src/instrumentation-client.ts`, `src/lib/sentry.ts`, `src/app/layout.tsx`, `src/app/api/health/route.ts`, `.github/workflows/deploy-smoke.yml`, `docs/measurement/KPI-PLAN.md` (Dashboards and alerts: "Alerts reach the channel — not set up")

## What is not watched

| Gap | Evidence |
|---|---|
| ไม่อยู่ใน uptime monitor กลาง | `platform-uptime-worker/src/targets.ts` ไม่มี `devhub` (grep 2026-11-03) |
| ไม่มี heartbeat | ไม่มี scheduled job ใน repo |
| sibling endpoints ไม่มี probe | ไม่มีใน CI/smoke |
| Playground success rate | events `playground_request_*` = planned (KPI-PLAN) |
| Sentry event เข้าจริงหรือไม่ | env `NEXT_PUBLIC_SENTRY_DSN` มีใน Vercel (production, preview) แต่ไม่ได้ยืนยัน event |
| Analytics enablement | KPI-PLAN review 2026-10-24: "project-side enablement is unverified"; Vercel project API มี `webAnalytics.id` และ `speedInsights` object (2026-11-03) |

## Open questions

- เพิ่ม `devhub.bookchaowalit.com/api/health` เข้า `platform-uptime-worker` targets หรือไม่
- Sentry alert rule และปลายทาง (email/Telegram) ของ project นี้คืออะไร
