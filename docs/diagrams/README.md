# Core 22 SDLC diagram pack — devtools-devhub-web

ชุดภาพ 22 รายการตาม SDLC Diagram Catalog v2 (knowledge-base `knowledge/tech/core-cs/sdlc-diagram-catalog.md`)
วาดจากโค้ดและ config ของ repo นี้ ณ `origin/main` `ed11806` (2026-10-24) ตรวจสถานะ live 2026-11-03 — live: https://devhub.bookchaowalit.com (Tier A)
ทุก diagram มี `Sources:` และสิ่งที่ไม่รู้อยู่ใน "Open questions" ของไฟล์นั้น

| # | Item | Status | File | Sources read |
|---|---|---|---|---|
| 01 | Business process (As-Is / To-Be) | done | [01-business-process.md](01-business-process.md) | all pages, api-catalog.ts, workflows, CLASSIFICATION, PRODUCT, KPI-PLAN |
| 02 | Use cases | done | [02-use-cases.md](02-use-cases.md) | route tree, playground, health, robots/sitemap, deploy-smoke |
| 03 | User flows | done | [03-user-flows.md](03-user-flows.md) | page.tsx, apis/[id], playground, docs, more-projects |
| 04 | Traceability (RTM) | done | [04-traceability.md](04-traceability.md) | specs/001, PRODUCT, DESIGN, KPI-PLAN, tests/*, workflows |
| 05 | C4 Context | done | [05-c4-context.md](05-c4-context.md) | layout, instrumentation, api-catalog, playground, workflows |
| 06 | C4 Container | done | [06-c4-container.md](06-c4-container.md) | route files, instrumentation, package.json |
| 07 | C4 Component | done | [07-c4-component.md](07-c4-component.md) | src/app/**, src/lib/** |
| 08 | ADRs (retro-documented) | done | [08-adr/](08-adr/) — [0001](08-adr/ADR-0001-nextjs-static-catalog-in-code.md), [0002](08-adr/ADR-0002-browser-direct-cross-origin-playground.md), [0003](08-adr/ADR-0003-vercel-git-deploy-ci-not-gating.md), [0004](08-adr/ADR-0004-sentry-errors-only-scrubbed.md) | package.json, api-catalog, playground, workflows, sentry, Vercel project API, git log |
| 09 | ERD | done (in-code model, no DB) | [09-erd.md](09-erd.md) | api-catalog.ts types, playground METHODS, catalog tests |
| 10 | Sequences | done | [10-sequences.md](10-sequences.md) | playground, layout, instrumentation, health, deploy-smoke |
| 11 | State machines | done | [11-state-machines.md](11-state-machines.md) | ApiEntry.status, playground state, deploy-smoke.sh |
| 12 | API & integrations | done | [12-api-integration.md](12-api-integration.md) | health route, api-catalog, layout, live CORS probe 2026-11-03 |
| 13 | Threat model | done | [13-threat-model.md](13-threat-model.md) | src/**, workflows, osv-scanner.toml, branch protection API, live headers |
| 14 | Backup & DR | done | [14-backup-dr.md](14-backup-dr.md) | RUNBOOK, spec §4, Vercel deployments/env |
| 15 | CI/CD pipeline | done | [15-cicd-pipeline.md](15-cicd-pipeline.md) | ci.yml, deploy-smoke.yml, platform-ci-workflows @87dc5e1, gh run list |
| 16 | Deployment | done | [16-deployment.md](16-deployment.md) | Vercel project + domains API, layout metadata, sitemap, robots |
| 17 | Test coverage matrix | done | [17-test-coverage-matrix.md](17-test-coverage-matrix.md) | package.json, 4 test files, ci.yml, deploy-smoke.sh |
| 18 | Git & release workflow | done | [18-git-release-workflow.md](18-git-release-workflow.md) | git log, gh pr list, branch protection API, vercel ls |
| 19 | Service dependency map | done | [19-service-dependency-map.md](19-service-dependency-map.md) | api-catalog, layout, package.json, live probe |
| 20 | Observability | done | [20-observability.md](20-observability.md) | sentry, instrumentation, layout, health, KPI-PLAN, uptime worker targets |
| 21 | Incident response | done | [21-incident-response.md](21-incident-response.md) | workflows, deploy-smoke.sh, health, sentry env, RUNBOOK, vercel CLI help |
| 22 | DORA | done (recovery = cannot compute, rework = proxy) | [22-dora.md](22-dora.md) | vercel ls, GitHub Deployments API, gh run list, git log |

## Reused docs (ลิงก์ ไม่คัดลอก)

- KPI / events / alerts: [docs/measurement/KPI-PLAN.md](../measurement/KPI-PLAN.md) — ใช้ใน 01, 04, 20
- Product brief + CORS diagnosis: [PRODUCT.md](../../PRODUCT.md) — ใช้ใน 01, 04, 08, 10
- Spec: [specs/001-strict-build-ci-sentry/spec.md](../../specs/001-strict-build-ci-sentry/spec.md) — ใช้ใน 04, 08

## Key findings (2026-11-03)

- Playground: 3 ใน 5 API ใช้ไม่ได้จริง — portfolio URL 404, artblog 308, techspace 406 (ดู 12)
- CI ไม่ gate deploy (`6a4357d` CI แดงแต่ขึ้น prod); ไม่มี branch protection
- ไม่อยู่ใน uptime monitor กลาง; smoke ไม่ตรวจ Playground
- `/docs` มีลิงก์เสีย `/#apis`, `/api/portfolio`; canonical/sitemap/og-image drift
- SPEC-001 §6 และ KPI-PLAN "Known gaps" (deploy ไม่ใช่จาก Git) ล้าสมัย — Vercel ลิงก์ Git กับ repo นี้แล้ว

## Validate

```bash
node ~/work/core22/tools/validate.mjs docs/diagrams/*.md docs/diagrams/08-adr/*.md
```
