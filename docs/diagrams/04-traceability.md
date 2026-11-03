# 04 — Traceability (RTM)

Status: **done**

แหล่ง requirement: `specs/001-strict-build-ci-sentry/spec.md` (AC-01..AC-04), `PRODUCT.md` (catalog/playground claims, improve-next list),
`DESIGN.md` constraints, `docs/measurement/KPI-PLAN.md` (planned events) — reuse KPI-PLAN ไม่คัดลอก

```mermaid
flowchart LR
  subgraph REQ["Requirements"]
    R1["SPEC-001 AC-01 strict build"]
    R2["SPEC-001 AC-02 Sentry off without DSN"]
    R3["SPEC-001 AC-03 errors only, no PII"]
    R4["SPEC-001 AC-04 shared CI on push"]
    R5["PRODUCT catalog: 5 APIs, real tool names"]
    R6["DESIGN single catalog source"]
    R7["ADR-0003 D3 deploy verification"]
    R8["KPI-PLAN playground events"]
  end
  subgraph CODE["Code"]
    C1["next.config.ts"]
    C2["src/lib/sentry.ts + instrumentation"]
    C3[".github/workflows/ci.yml"]
    C4["src/lib/api-catalog.ts"]
    C5["src/app/api/health/route.ts + scripts/deploy-smoke.sh"]
    C6["src/app/playground/page.tsx"]
  end
  subgraph TEST["Tests"]
    T1["tests/next-config.test.ts"]
    T2["tests/sentry.test.ts"]
    T3["tests/api-catalog.test.ts"]
    T4["tests/health.test.ts"]
    T5["CI run on main"]
    TX["no test"]
  end
  subgraph REL["Release"]
    W1["CI workflow"]
    W2["Deploy smoke workflow"]
  end
  R1 --> C1 --> T1 --> W1
  R2 --> C2 --> T2 --> W1
  R3 --> C2
  R4 --> C3 --> T5 --> W1
  R5 --> C4 --> T3 --> W1
  R6 --> C4
  R7 --> C5 --> T4 --> W2
  R8 --> C6 --> TX
```

Sources: `specs/001-strict-build-ci-sentry/spec.md`, `PRODUCT.md`, `DESIGN.md`, `docs/measurement/KPI-PLAN.md`, `tests/*.test.ts`,
`.github/workflows/ci.yml`, `.github/workflows/deploy-smoke.yml` (header comment "ADR-0003, D3"), `scripts/deploy-smoke.sh`

| Req ID | Requirement | Code | Test | Release gate | Status |
|---|---|---|---|---|---|
| AC-01 | build ไม่ปิด type/lint error | `next.config.ts` (`{}`) | `tests/next-config.test.ts` | `ci.yml` → `npm run build` | covered |
| AC-02 | Sentry ปิดถ้าไม่มี DSN | `src/lib/sentry.ts` `sentryOptions` | `tests/sentry.test.ts` "stays disabled…" | CI test step | covered |
| AC-03 | errors only, scrub request/user/breadcrumbs/extra/vars/query | `scrubEvent`, `sentryOptions` | `tests/sentry.test.ts` (5 cases) | CI test step | covered |
| AC-04 | shared CI + security pinned v1.1.1 `87dc5e1` | `.github/workflows/ci.yml` | GitHub Actions run | CI | covered (ไม่ block deploy — ดู 18) |
| PRODUCT | 5 APIs, ชื่อ tool ของ portfolio/techspace ตรงจริง, endpoints = tools.length | `src/lib/api-catalog.ts` | `tests/api-catalog.test.ts` | CI | covered (URL ยังมีชีวิตอยู่หรือไม่ ไม่ได้ทดสอบ) |
| DESIGN | หน้า home/detail/playground ใช้ catalog เดียว | `API_CATALOG` imports | ไม่มี test เชิง import (ตรวจด้วยการอ่าน) | — | partial |
| ADR-0003 D3 | prod รัน commit ที่ deploy | `/api/health`, `deploy-smoke.sh` | `tests/health.test.ts` | `deploy-smoke.yml` | covered |
| KPI events | `playground_request_*` | ยังไม่มีใน `playground/page.tsx` | none | — | **gap (planned)** |
| PRODUCT improve #2 | Playground error state | ไม่มี | none | — | **gap** |

## Open questions

- ADR-0003 (D3) อยู่ใน architecture-docs ส่วนกลาง ไม่ได้อยู่ใน repo — link ที่ถูกต้องคือไฟล์ใด
- ไม่มี requirement ID ให้กับ PRODUCT.md claims — ต้องการ spec 002 สำหรับ Playground error state/events หรือไม่
