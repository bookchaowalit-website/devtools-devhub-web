# 06 — C4 Container

Status: **done**

```mermaid
C4Container
  title Containers - DevHub
  Person(visitor, "Visitor")
  System_Boundary(dh, "DevHub on Vercel project bookchaowalit-devhub-frontend") {
    Container(static, "Static pages", "Next.js App Router, prerendered", "/, /docs, /more-projects, /apis/id x5")
    Container(client, "Playground client bundle", "React 19 client component", "/playground; fetch to sibling URLs")
    Container(health, "Health route", "Next.js route handler, force-dynamic", "GET /api/health returns status, service, commit")
    Container(sentryc, "Sentry SDK", "@sentry/nextjs 11", "instrumentation.ts register and onRequestError; instrumentation-client.ts")
  }
  System_Ext(sib, "Sibling MCP endpoints", "5 URLs")
  System_Ext(sentry, "Sentry")
  System_Ext(va, "Vercel Analytics and Speed Insights")

  Rel(visitor, static, "GET pages", "HTTPS")
  Rel(visitor, client, "Loads and runs", "HTTPS")
  Rel(client, sib, "POST JSON-RPC", "HTTPS CORS")
  Rel(sentryc, sentry, "Error events", "HTTPS")
  Rel(static, va, "Analytics and SpeedInsights components", "HTTPS")
```

Sources: `src/app/page.tsx`, `src/app/docs/page.tsx`, `src/app/more-projects/page.tsx`, `src/app/apis/[id]/page.tsx` (`generateStaticParams`, `dynamicParams = false`),
`src/app/playground/page.tsx` (`'use client'`), `src/app/api/health/route.ts` (`dynamic = "force-dynamic"`), `src/instrumentation.ts`, `src/instrumentation-client.ts`,
`src/app/layout.tsx`, `package.json`

ไม่มี container ข้อมูล (DB, KV, blob) และไม่มี API ของตัวเองนอกจาก `/api/health`

## Open questions

- ไม่มี `withSentryConfig` ใน `next.config.ts` จึงไม่มี source map upload — ตั้งใจหรือไม่
