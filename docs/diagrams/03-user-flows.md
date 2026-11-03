# 03 — User flows

Status: **done** (มี role เดียวในแอป: anonymous visitor)

## Flow A — Discover then try (main journey)

```mermaid
flowchart TD
  H["/ home"] -->|"nav: catalog anchor #catalog"| C["Catalog grid of 5 API nodes"]
  H -->|"launch playground or open console"| P["/playground"]
  H -->|"browse docs"| D["/docs"]
  C -->|"click node"| A["/apis/id"]
  A -->|"Back to DevHub"| H
  P --> P1["Select API: default first catalog entry, portfolio"]
  P1 --> P2["Select method: List Tools or Initialize"]
  P2 --> P3["Request body preview and code examples update"]
  P3 --> P4["Send Request"]
  P4 --> P5{"fetch and res.json succeed?"}
  P5 -- "yes" --> P6["Response panel shows JSON, Copy button"]
  P5 -- "no" --> P7["Response panel shows error message JSON"]
  P6 --> P8["Copy: label Copied! for 2 s"]
```

Sources: `src/app/page.tsx` (nav links, `#catalog`, CTA hrefs), `src/app/apis/[id]/page.tsx`, `src/app/playground/page.tsx`

## Flow B — Docs quick start

```mermaid
flowchart TD
  D["/docs Quick Start Guide"] --> S1["Step 1 Choose Your API: href /#apis"]
  D --> S2["Step 2 Get Your Endpoint: href /api/portfolio"]
  D --> S3["Step 3 Make Your First Request: href /playground"]
  S1 --> X1["Home loads, anchor apis does not exist: home uses id catalog"]
  S2 --> X2["No route /api/portfolio in this repo: 404"]
  S3 --> P["/playground"]
  D --> R["Ready to Build: link /playground"]
```

Sources: `src/app/docs/page.tsx` (`steps[].href`), `src/app/page.tsx` (`id="catalog"`), route tree under `src/app/`

## Flow C — More projects

```mermaid
flowchart LR
  M["/more-projects"] --> G["6 sections: productivity, dev tools, content tools, webmaster, communication, Main Sites"]
  G --> L["44 external links, target _blank, rel noopener noreferrer"]
```

Sources: `src/app/more-projects/page.tsx`

หมายเหตุ: ไม่มี link ไป `/more-projects` จากหน้าอื่นใน `src/app/` (เข้าถึงผ่าน URL ตรงหรือ `public/sitemap.xml` เท่านั้น)

## Open questions

- ลิงก์ `/#apis` และ `/api/portfolio` ใน `/docs` ควรชี้ไป `/#catalog` และ `/apis/portfolio` หรือไม่ (ต้องแก้โค้ด — นอก scope ของ pack นี้)
- `/more-projects` ตั้งใจให้ซ่อนจาก nav หรือไม่
