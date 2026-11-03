# 18 — Git & release workflow

Status: **done**

repo ใช้ main-only: ไม่มี merge commit (`git log --merges` ว่าง), ไม่มี PR (`gh pr list --state all` ว่าง), ไม่มี git tag, ไม่มี branch protection

```mermaid
gitGraph
  commit id: "af2b150 create-next-app"
  commit id: "a0deb66 extract catalog"
  commit id: "38f060b redesign" tag: "deploy 08-23"
  commit id: "860199d next 15.5.27" tag: "deploy 10-08"
  commit id: "15438bc BOO-203 shared catalog"
  commit id: "c646acf SPEC-001"
  commit id: "747847a next 15.5.28" tag: "deploy 10-23"
  commit id: "e0fe45e sentry scrub"
  commit id: "6a4357d deploy smoke" tag: "deploy 10-24a"
  commit id: "5da0dd6 deps" tag: "deploy 10-24b"
  commit id: "ed11806 kpi review" tag: "deploy 10-24c"
```

```mermaid
flowchart LR
  A["Edit locally"] --> B["Commit on main, conventional message"]
  B --> C["git push origin main"]
  C --> D["CI: web plus security, informational"]
  C --> E["Vercel Git build and Production deploy"]
  E --> F["deployment_status success"]
  F --> G["Deploy smoke checks commit on /api/health"]
  D -. "red CI does not stop E" .-> E
```

Sources: `git log origin/main`, `gh pr list --state all`, GitHub branch protection API (404), `.github/workflows/ci.yml`, `.github/workflows/deploy-smoke.yml`,
`vercel ls bookchaowalit-devhub-frontend --prod --format json` (deployment `meta.githubCommitSha`) — tag ใน gitGraph คือ Production deployment ไม่ใช่ git tag

หมายเหตุ: deploy 2026-10-23 (`747847a`) ไม่มี GitHub Deployment record (มีเฉพาะ 3 รายการ 2026-10-24) จึงน่าจะเป็น CLI deploy ก่อน Git relink; commit `4cfd85c`/`e0fe45e` ขึ้น prod พร้อม deploy `6a4357d`

## Open questions

- ต้องการ PR + required checks ก่อน deploy หรือคง main-only
