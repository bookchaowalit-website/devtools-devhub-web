# 07 — C4 Component

Status: **done**

```mermaid
C4Component
  title Components - DevHub Next.js app
  Container_Boundary(app, "Next.js app") {
    Component(catalog, "api-catalog.ts", "TS module", "CATALOG_ENTRIES, API_CATALOG, catalogIds, allUrlsHttps, exampleRequest")
    Component(home, "app/page.tsx", "Server component", "Hero, signal row, catalog grid, methodRows")
    Component(detail, "app/apis/id/page.tsx", "SSG page", "Endpoints list, curl tools/list and exampleRequest")
    Component(play, "app/playground/page.tsx", "Client component", "METHODS tools/list and initialize, makeRequest, code examples")
    Component(docs, "app/docs/page.tsx", "Static page", "steps, features, code examples, MCP methods")
    Component(more, "app/more-projects/page.tsx", "Static page", "44 hard-coded links")
    Component(health, "app/api/health/route.ts", "Route handler", "GET build marker")
    Component(sentrylib, "lib/sentry.ts", "TS module", "sentryOptions, scrubEvent")
    Component(instr, "instrumentation.ts and instrumentation-client.ts", "Next hooks", "Sentry.init, onRequestError")
    Component(layout, "app/layout.tsx", "Root layout", "metadata, fonts, Analytics, SpeedInsights")
  }
  Rel(home, catalog, "imports API_CATALOG")
  Rel(detail, catalog, "imports API_CATALOG, exampleRequest")
  Rel(play, catalog, "imports API_CATALOG as APIS")
  Rel(instr, sentrylib, "sentryOptions")
```

Sources: ไฟล์ทั้งหมดที่ระบุใน diagram, `src/lib/utils.ts` (`cn`, ไม่ได้ใช้ในหน้าใดที่อ่าน)

หมายเหตุ: `docs/page.tsx` ไม่ import `API_CATALOG` — hard-code URL portfolio และข้อความ "5 APIs" เอง (drift risk เดียวกับที่ PRODUCT.md ข้อ 4 เตือน)

## Open questions

- ควรให้ `/docs` ใช้ `API_CATALOG` ด้วยหรือไม่
