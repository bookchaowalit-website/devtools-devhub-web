# ADR-0001 — Next.js App Router with the API catalog as typed code, no database

Status: **accepted (retro-documented)** — 2026-11-03, from code at `origin/main` `ed11806`

## Context

DevHub แสดง MCP API 5 ตัวของ portfolio พร้อม detail page และ playground ข้อมูลเปลี่ยนน้อยและเป็นของ owner คนเดียว

## Decision (as seen in code)

- Next.js 15.5.28 App Router + React 19 + Tailwind 4 (`package.json`), bootstrap จาก create-next-app (commit แรก `af2b150`, 2026-02-22)
- catalog เป็น TypeScript module เดียว `src/lib/api-catalog.ts` (`ApiEntry`, `ApiTool`, `API_CATALOG`) — แยกออกมาใน `a0deb66` (2026-08-12) และใช้ร่วมทุกหน้าใน BOO-203 (`15438bc`)
- `endpoints` คำนวณจาก `tools.length` ไม่ได้พิมพ์เอง; `/apis/[id]` prerender ด้วย `generateStaticParams` และ `dynamicParams = false`
- ไม่มี DB, ไม่มี CMS, ไม่มี auth

## Evidence

`package.json`, `src/lib/api-catalog.ts`, `src/app/apis/[id]/page.tsx`, `tests/api-catalog.test.ts` ("keeps endpoint counts derived from the shared detail data"), `DESIGN.md` Constraints, `PRODUCT.md` improve-next #4

## Consequences

- แก้ catalog = แก้โค้ด + deploy; ทดสอบ unit ได้ง่าย
- ไม่มีการตรวจว่า `url` ยังมีชีวิต — URL portfolio ใน catalog ตอบ 404 เมื่อ probe 2026-11-03 (ดู 12)
- `/docs` ยังไม่ใช้ catalog นี้ (drift)
