# ADR-0003 — Vercel Git integration deploys main; GitHub CI runs in parallel and does not gate

Status: **accepted (retro-documented)** — 2026-11-03

## Context

SPEC-001 §6 (2026-10-21) บันทึกว่า Vercel project ยังลิงก์กับชื่อ repo เก่าและ deploy ด้วย CLI; ต่อมา (2026-10-24) มี `deploy-smoke.yml` ที่ระบุว่า "Vercel deploys main through its Git integration"

## Decision (as seen in config)

- Vercel project `bookchaowalit-devhub-frontend` link type `github`, repo `bookchaowalit-website/devtools-devhub-web`, production branch `main` (Vercel project API, 2026-11-03)
- `ci.yml` comment: "CI never deploys"; ไม่มี branch protection บน `main` (GitHub API 404 "Branch not protected")
- `deploy-smoke.yml` ทำงานหลัง `deployment_status` = success และ environment `Production`

## Evidence

`.github/workflows/ci.yml`, `.github/workflows/deploy-smoke.yml`, `specs/001-strict-build-ci-sentry/spec.md` §6, GitHub Deployments API (3 Production deployments by `vercel[bot]` on 2026-10-24), `gh run list`

## Consequences

- push = deploy แม้ CI แดง: commit `6a4357d` CI **failure** (job `security / osv-scanner`, step `Scan`) แต่ Production deployment success และ Deploy smoke success
- smoke ยืนยันว่า prod รัน commit ที่คาดไว้ แต่ไม่ตรวจ Playground หรือ sibling endpoints
- SPEC-001 §6 และ KPI-PLAN "Known gaps" ล้าสมัยแล้วในเรื่อง "not from Git"
