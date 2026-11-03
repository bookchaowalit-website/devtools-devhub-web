# 19 — Service dependency map

Status: **done**

```mermaid
flowchart TD
  DH["DevHub devhub.bookchaowalit.com"]
  subgraph RT["Runtime, hard"]
    VER["Vercel hosting and CDN"]
    CF["Cloudflare DNS"]
  end
  subgraph FEAT["Runtime, feature: Playground"]
    S1["portfolio-site-web, catalog URL 404"]
    S2["techblog /api/mcp"]
    S3["artblog /api/mcp, 308"]
    S4["techspace /api/mcp, 406 without SSE Accept"]
    S5["devtools-mcplist-web /api/mcp, CORS allowlist incl. devhub"]
  end
  subgraph SOFT["Runtime, soft: failure does not break pages"]
    SEN["Sentry"]
    VA["Vercel Web Analytics"]
    SI["Vercel Speed Insights"]
  end
  subgraph BUILD["Build and delivery"]
    GH["GitHub repo and Actions"]
    PCW["platform-ci-workflows at 87dc5e1"]
    NPM["npm registry"]
    GF["Google Fonts via next/font at build"]
  end
  DH --> VER
  CF --> VER
  DH -.-> S1
  DH -.-> S2
  DH -.-> S3
  DH -.-> S4
  DH -.-> S5
  DH --> SEN
  DH --> VA
  DH --> SI
  GH --> PCW
  GH --> NPM
  VER --> GF
  GH --> VER
```

Sources: `src/lib/api-catalog.ts`, `src/app/layout.tsx`, `src/instrumentation*.ts`, `package.json`, `.github/workflows/ci.yml`, Vercel project API, live probe 2026-11-03 (12), external read-only `devtools-mcplist-web/lib/cors.ts`

เส้นประ = ใช้จาก browser ของ visitor ไม่ใช่ server ของ DevHub

## Open questions

- `MCP List Hub` อธิบายตัวเองว่า "proxy" ไปยัง server อื่น — dependency ทางอ้อมของ hub ไม่ได้วาดที่นี่ (อยู่ใน repo mcplist)
