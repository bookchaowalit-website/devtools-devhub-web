# ADR-0002 — Playground calls sibling MCP endpoints directly from the browser (no server proxy)

Status: **accepted (retro-documented)** — 2026-11-03

## Context

Playground ต้องแสดง response จริงของ MCP server 5 ตัว (PRODUCT.md "makes genuine cross-origin fetch() calls")

## Decision (as seen in code)

- `src/app/playground/page.tsx` เป็น client component; `makeRequest` ทำ `fetch(selectedApi.url, { method: 'POST', headers: { 'Content-Type': 'application/json' } })` ตรงจาก browser
- ไม่มี route proxy ใน DevHub (มีแค่ `src/app/api/health/route.ts`)
- ความรับผิดชอบเรื่อง CORS อยู่ที่ repo พี่น้อง: PRODUCT.md "The fix" เพิ่ม `Access-Control-Allow-Origin` ผ่าน `next.config` `headers()` ใน 5 repo; `devtools-mcplist-web/lib/cors.ts` ใช้ allowlist ที่มี `https://devhub.bookchaowalit.com` และ `https://bookchaowalit-devhub-frontend.vercel.app` (override ด้วย env `CORS_ALLOWED_ORIGINS`)

## Evidence

`src/app/playground/page.tsx`, `PRODUCT.md` (The bug / The fix), external read-only: `bookchaowalit-website/public/book-products/devtools-mcplist-web/lib/cors.ts`

## Consequences

- DevHub server ไม่ต้องถือ secret และไม่เป็น open proxy (ลด SSRF)
- ถ้า sibling เปลี่ยนโดเมน/CORS/transport Playground พังโดยที่ CI ของ DevHub ไม่รู้ — เกิดจริง: probe 2026-11-03 พบ 3 ใน 5 ล้มเหลว (404, 308, 406)
- `Content-Type: application/json` ทำให้ต้องมี preflight; ไม่ได้ส่ง `Accept: text/event-stream` ซึ่ง techspace ต้องการ
