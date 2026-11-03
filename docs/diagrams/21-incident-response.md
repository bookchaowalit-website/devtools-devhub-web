# 21 — Incident response

Status: **done** (ช่องทางที่พบจริงเท่านั้น; ไม่มี on-call — `RUNBOOK.md` "Solo operator (bookchaowalit). No multi-person on-call.")

```mermaid
flowchart TD
  subgraph ALERT["Alert sources found"]
    A1["Workflow Deploy smoke, job Production smoke devhub.bookchaowalit.com fails: GitHub notification"]
    A2["Workflow CI fails on main: GitHub notification"]
    A3["Sentry issue, only if DSN build is live"]
    A4["Visitor or owner sees Playground error JSON"]
  end
  ALERT --> T{"Owner triage: what broke?"}
  T -- "site down or smoke FAIL on / or /docs" --> R1["Rollback: vercel rollback previous-deployment-url, or Instant Rollback in dashboard"]
  T -- "smoke FAIL: production does not run the expected commit" --> R2["Check Vercel deployment state; commit null means VERCEL_GIT_COMMIT_SHA was not set, route comment says Git deploys only"]
  T -- "Playground fails for one API" --> R3["Probe the sibling URL: OPTIONS and POST with Origin devhub"]
  T -- "Sentry DSN wrong or missing" --> R4["Set NEXT_PUBLIC_SENTRY_DSN in Vercel"]
  T -- "CI red, site fine" --> R5["Fix forward on main"]
  R3 --> R3a{"Cause"}
  R3a -- "catalog URL or Accept header in DevHub" --> R3b["Fix src/lib/api-catalog.ts or playground/page.tsx, push main"]
  R3a -- "sibling CORS or route" --> R3c["Fix in the sibling repo; for mcplist an env change to CORS_ALLOWED_ORIGINS needs a redeploy of mcplist"]
  R4 --> R4a["Redeploy Production: the value is inlined at build"]
  R4a --> R4b["Functional check: confirm a new event in the Sentry project, not only a smoke GET"]
  R1 --> V1["Verify: bash scripts/deploy-smoke.sh https://devhub.bookchaowalit.com rolled-back-sha"]
  R1 --> V1b["Before the next push: vercel promote, because a rollback stops auto-assigning the production domain"]
  R2 --> F
  R3b --> F["Vercel Git deploy then Deploy smoke runs on deployment_status"]
  R3c --> V2["Functional check: /playground Send Request for that API returns a JSON-RPC result, plus curl OPTIONS and POST show Access-Control-Allow-Origin"]
  F --> V2
  R5 --> F
  V1 --> P["Postmortem: no template or folder in repo"]
  V1b --> P
  V2 --> P
  R4b --> P
```

Sources: `.github/workflows/deploy-smoke.yml` (workflow `Deploy smoke`, job name `Production smoke (devhub.bookchaowalit.com)`, `EXPECTED_SHA: github.event.deployment.sha || github.sha`), `.github/workflows/ci.yml` (workflow `CI`),
`scripts/deploy-smoke.sh` (args `<base-url> [expected-commit]`, env `SMOKE_ATTEMPTS` default 20, `SMOKE_DELAY` default 15, messages `::error::FAIL …`), `src/app/api/health/route.ts` (commit null on non-Git deploys),
`src/lib/sentry.ts` / `src/instrumentation*.ts` (`NEXT_PUBLIC_SENTRY_DSN`), `src/app/playground/page.tsx`, `src/lib/api-catalog.ts`, `RUNBOOK.md`, Vercel CLI 64.5.0 `vercel rollback --help` / `vercel promote --help`, external read-only `devtools-mcplist-web/lib/cors.ts` (`CORS_ALLOWED_ORIGINS`)

## ข้อควรระวังที่มาจากโค้ดจริง

- **smoke ไม่ตรวจ Playground หรือ sibling** — `deploy-smoke.sh` GET แค่ `/`, `/api/health`, `/docs` ผ่านได้แม้ Playground ใช้ไม่ได้ทั้ง 5 API ต้องเช็คเชิง functional ด้วยการกด Send Request จริงและ curl CORS (คำสั่งใน [12](12-api-integration.md))
- **หลัง rollback ห้าม dispatch Deploy smoke เพื่อยืนยัน** — manual run ใช้ `github.sha` (head ของ main) จึงจะ FAIL โดยออกแบบ ให้รัน script เองพร้อม sha ของ deployment ที่ rollback ไป; rollback ไม่สร้าง deployment ใหม่ จึงไม่มี `deployment_status` มาเรียก smoke ให้เอง
- **deploy ที่ไม่มี `VERCEL_GIT_COMMIT_SHA` ทำให้ smoke step 2 FAIL เสมอ** — `/api/health` คืน `commit: null` และ script ต้องการ commit เสมอแม้ไม่ส่ง expected; comment ใน route และ `tests/health.test.ts` ระบุว่า CLI deploy ไม่มีค่านี้ (ยังไม่ได้ยืนยันกับ CLI deploy จริง — Vercel API แสดง `meta.githubCommitSha` แม้ deploy 2026-10-23 ที่ไม่มี GitHub Deployment record)
- **เปลี่ยน env ต้อง redeploy** — `NEXT_PUBLIC_SENTRY_DSN` ถูก inline ตอน build; ตั้งค่าแล้วไม่ redeploy = ไม่มีผล และ smoke GET ไม่บอกว่า Sentry ทำงาน
- `RUNBOOK.md` Rollback ("Redeploy previous container image / previous git tag") ไม่ตรงกับ repo นี้ (ไม่มี container/tag) — ใช้ขั้นตอน Vercel ข้างบนแทน
- ข้อความ "auto-assign ปิดหลัง rollback" มาจากพฤติกรรม Vercel Instant Rollback (เอกสาร Vercel) ไม่ใช่โค้ดใน repo — ควรยืนยันในการ drill ครั้งแรก

## Severity

ไม่พบ severity matrix หรือ SLA — **not defined** (`CLASSIFICATION.md`: "Do not claim … uptime SLAs")

## Open questions

- ต้องการ postmortem template และที่เก็บ (`docs/incidents/`) หรือไม่
- ยังไม่มี route ทดสอบ Sentry — จะยืนยัน DSN ด้วยวิธีใด (เช่น error ที่ตั้งใจใน preview)
- ใครดูแล sibling repo เมื่อ Playground พังเพราะ sibling (ทั้งหมดเป็นของ owner แต่ CI ของแต่ละ repo ไม่รู้ว่า DevHub พึ่งพา)
