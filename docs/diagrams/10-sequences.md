# 10 — Sequences

Status: **done** (3 request paths ที่สำคัญที่สุด)

## S1 — Playground live request

```mermaid
sequenceDiagram
  actor U as Visitor
  participant B as Browser: /playground client component
  participant S as Sibling /api/mcp
  U->>B: Select API and method, click Send Request
  B->>B: setLoading true, build jsonrpc 2.0 body id 1
  B->>S: OPTIONS preflight, Origin devhub, Content-Type json
  alt preflight allowed
    S-->>B: 204 with Access-Control-Allow-Origin
    B->>S: POST JSON-RPC body
    alt 2xx or JSON error body with ACAO
      S-->>B: JSON
      B->>B: res.json then setResponse pretty JSON
    else no ACAO, redirect, 404 HTML
      S-->>B: response not readable or not JSON
      B->>B: catch: setResponse error message
    end
  else preflight rejected
    B->>B: fetch rejects: TypeError Failed to fetch
    B->>B: catch: setResponse error message
  end
  B->>B: setLoading false
  B-->>U: Response panel
```

Sources: `src/app/playground/page.tsx` (`makeRequest`), `PRODUCT.md` (preflight chain), live probe 2026-11-03 (ดู 12)

หมายเหตุ: ไม่มีการตรวจ `res.ok` — HTTP 406 ที่มี JSON body (techspace) จะแสดงเป็น "response" ปกติ ไม่ใช่ error

## S2 — Page view with analytics and errors

```mermaid
sequenceDiagram
  actor U as Visitor
  participant V as Vercel edge
  participant N as Next.js app
  participant A as Vercel Analytics and Speed Insights
  participant E as Sentry
  U->>V: GET /apis/portfolio
  V-->>U: Prerendered HTML, x-vercel-cache HIT
  U->>A: Page view and Web Vitals beacons
  opt client error and DSN set
    U->>E: scrubEvent output
  end
  opt server render error and DSN set
    N->>E: captureRequestError then scrubEvent
  end
```

Sources: `src/app/layout.tsx`, `src/app/apis/[id]/page.tsx`, `src/instrumentation.ts`, `src/instrumentation-client.ts`, `src/lib/sentry.ts`, response header `x-vercel-cache: HIT` (curl 2026-11-03)

## S3 — Post-deploy smoke

```mermaid
sequenceDiagram
  participant V as Vercel
  participant G as GitHub
  participant J as Deploy smoke job
  participant P as devhub.bookchaowalit.com
  V->>G: deployment_status success, environment Production
  G->>J: Run job Production smoke
  J->>P: GET / expect 200 and DevHub
  loop up to SMOKE_ATTEMPTS default 20, every SMOKE_DELAY default 15 s
    J->>P: GET /api/health?smoke=ts
    P-->>J: status ok, service, commit
  end
  J->>J: commit equals first 7 of EXPECTED_SHA
  J->>P: GET /docs expect 200 and Quick Start Guide
  J-->>G: exit 0 or 1
```

Sources: `.github/workflows/deploy-smoke.yml`, `scripts/deploy-smoke.sh`, `src/app/api/health/route.ts`

## Open questions

- ไม่มี
