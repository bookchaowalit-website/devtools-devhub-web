# 15 — CI/CD pipeline

Status: **done**

```mermaid
flowchart TD
  subgraph TRIG["Triggers"]
    T1["push to main"]
    T2["pull_request"]
    T3["workflow_dispatch"]
    T4["deployment_status from Vercel"]
  end
  subgraph CI["Workflow CI, ci.yml, concurrency ci-ref cancel-in-progress"]
    W["job web: ci-node.yml at 87dc5e1 v1.1.1, node 22, require-tests true"]
    W1["Checkout"] --> W2["Detect package manager"] --> W3["Install dependencies"] --> W4["Lint auto"] --> W5["Typecheck auto"] --> W6["Test auto: npm test"] --> W7["Build: npm run build"]
    S["job security: security.yml at 87dc5e1 v1.1.1"]
    S1["gitleaks"]
    S2["semgrep"]
    S3["osv-scanner, uses osv-scanner.toml"]
    S4["trivy-fs"]
    W --- W1
    S --- S1
    S --- S2
    S --- S3
    S --- S4
  end
  subgraph CD["Vercel Git integration, outside GitHub Actions"]
    V["Build and deploy main to Production"]
  end
  subgraph SM["Workflow Deploy smoke, deploy-smoke.yml"]
    D{"dispatch, or state success and environment Production"}
    D -- "yes" --> D1["Production smoke job: checkout, bash scripts/deploy-smoke.sh https://devhub.bookchaowalit.com EXPECTED_SHA"]
  end
  T1 --> CI
  T2 --> CI
  T3 --> CI
  T1 --> V
  V --> T4
  T4 --> D
  T3 --> D
```

Sources: `.github/workflows/ci.yml`, `.github/workflows/deploy-smoke.yml`, `scripts/deploy-smoke.sh`, `package.json` (`test`, `build`, `lint`),
`bookchaowalit/platform-ci-workflows` `.github/workflows/ci-node.yml` และ `security.yml` @ `87dc5e1c7e0416886a6371d5a101bb2ccba38edd` (อ่านผ่าน GitHub API), `osv-scanner.toml`

ไม่มีเส้นจาก CI ไป Vercel — สองฝั่งรันขนานกัน (ADR-0003)

## Recent runs (`gh run list -L 200`)

| Workflow | success | failure | cancelled |
|---|---|---|---|
| CI | 5 | 2 (`c646acf` 2026-10-21, `6a4357d` 2026-10-24 osv-scanner Scan) | 1 |
| Deploy smoke | 3 | 0 | 0 |

## Open questions

- Vercel Node.js 24.x (project setting) vs CI node 22 — ต้องการให้ตรงกันหรือไม่
