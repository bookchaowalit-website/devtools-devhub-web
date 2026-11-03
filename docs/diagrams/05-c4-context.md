# 05 — C4 Context

Status: **done**

```mermaid
C4Context
  title System Context - DevHub devtools-devhub-web
  Person(visitor, "Visitor", "Developer or interviewer; anonymous")
  Person(owner, "Owner", "bookchaowalit; pushes main, manages Vercel project")
  System(devhub, "DevHub", "Next.js 15 on Vercel: API catalog, docs, browser Playground, /api/health")
  System_Ext(sib, "Sibling MCP endpoints", "portfolio, techblog, artblog, techspace, mcplist /api/mcp on vercel.app")
  System_Ext(sentry, "Sentry", "Scrubbed error events when DSN is set")
  System_Ext(vercelan, "Vercel Web Analytics and Speed Insights", "Page views and Web Vitals")
  System_Ext(gh, "GitHub", "Source, Actions CI and Deploy smoke")
  System_Ext(other, "Other bookchaowalit apps", "44 links on /more-projects")

  Rel(visitor, devhub, "Browses", "HTTPS")
  Rel(visitor, sib, "Playground POST JSON-RPC from the browser", "HTTPS CORS")
  Rel(devhub, sentry, "Errors", "HTTPS")
  Rel(visitor, vercelan, "Beacon from the browser", "HTTPS")
  Rel(owner, gh, "git push main")
  Rel(gh, devhub, "Vercel Git integration deploys", "webhook")
  Rel(gh, devhub, "Smoke GET /, /api/health, /docs", "HTTPS")
  Rel(visitor, other, "Follows links", "HTTPS")
```

Sources: `src/app/layout.tsx` (`Analytics`, `SpeedInsights`), `src/instrumentation.ts`, `src/instrumentation-client.ts`, `src/lib/api-catalog.ts` (`url`),
`src/app/playground/page.tsx` (`fetch`), `src/app/more-projects/page.tsx`, `.github/workflows/*.yml`, `scripts/deploy-smoke.sh`

จุดสำคัญ: Playground เรียก sibling **จาก browser ของ visitor โดยตรง** ไม่ผ่าน server ของ DevHub (ไม่มี proxy route) — ดังนั้นความสำเร็จขึ้นกับ CORS ของ sibling

## Open questions

- Sentry project สำหรับ repo นี้ชื่ออะไร (env `NEXT_PUBLIC_SENTRY_DSN` ตั้งใน Vercel production+preview แล้วตาม Vercel project API, 2026-11-03 แต่ไม่ได้ยืนยันว่า event เข้า)
