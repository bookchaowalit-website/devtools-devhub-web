# DevHub — Product Brief & Interview Case Study

*Last of the 6 flagships in the
[Portfolio Interview Readiness Audit](../../../../../../docs/systems/interview-readiness-audit.md)
(solo-empire workspace — not part of this repo). Started as "candidate,
not yet scoped" — this pass confirmed it belongs at full Tier A depth: real,
working, interconnected functionality, undocumented and (until this pass)
silently broken in its core feature.*

## Who this is for

Another developer — or an interviewer with a technical bent — who wants
to see how the bookchaowalit portfolio's various MCP servers work, without
reading source code. DevHub is the "front door" for the portfolio's
API/MCP layer specifically, distinct from `bookchaowalit-portfolio-frontend`
(the personal site) or any individual product.

## The problem

Five separate projects in the portfolio (`bookchaowalit-portfolio-frontend`,
`bookchaowalit-techblog-frontend`, `bookchaowalit-artblog-frontend`,
`bookchaowalit-techspace-frontend`, `bookchaowalit-mcplist-frontend`) each
expose their own `/api/mcp` endpoint. Without DevHub, discovering,
understanding, or testing any of them means reading source across 5
different repos. DevHub centralizes that: a catalog page, per-API
documentation, and — the interesting part — a live in-browser request
tester.

## What's real here (verified, not assumed)

Confirmed by reading the actual code, not the README (which said nothing
useful — see below): the API catalog data (5 APIs, 21 endpoints, matching
counts across the homepage and detail pages) corresponds to **real,
checked-out sibling repos with real `/api/mcp/route.ts` files** — this
isn't a mockup pointing at fictional services. The Playground
(`/playground`) makes genuine cross-origin `fetch()` calls to those five
live URLs with a real JSON-RPC 2.0 request body, not a simulated response.

## The bug: the Playground's core feature was broken for every API it lists

This is the finding of this pass, and it's a chain, not a guess:

1. The Playground fetches `application/json` cross-origin — this is not a
   CORS "simple request," so the browser sends a preflight `OPTIONS`
   before the real `POST`.
2. Checked all 5 target repos' `/api/mcp/route.ts` for CORS handling.
   **4 of 5** (`techblog`, `artblog`, `techspace`, `mcplist`) had **no**
   `OPTIONS` handler and **no** `Access-Control-Allow-Origin` anywhere —
   the preflight itself would fail, blocking the request before it's even
   sent.
3. The 5th (`bookchaowalit-portfolio-frontend`) *does* have an `OPTIONS`
   handler with the right headers — but checked further and found the
   **actual `POST` handler's responses never set
   `Access-Control-Allow-Origin` either.** A CORS preflight passing does
   not mean the real response is readable — the browser checks the actual
   response's headers too, separately. So even the "working" one was
   still going to fail the moment `fetch()` tried to read the JSON body.

**Net result: all 5 "Live APIs" the homepage advertises were unusable from
DevHub's own Playground.** Not a visual bug, not a copy issue — the one
genuinely interactive feature this product has didn't work, for any of its
five listed integrations, and nothing in the UI would have told a user why
(a generic `fetch` rejection, not an explained error state).

## The fix

Added `Access-Control-Allow-Origin: *` (plus matching `Methods`/`Headers`)
via each repo's `next.config` `headers()` function — config-level, so it
applies to every response for `/api/mcp` (`GET`/`POST`/`OPTIONS` alike)
without touching route-handler business logic in any of the 5 repos:

- `bookchaowalit-portfolio-frontend` — added the config-level header
  (its route-level `OPTIONS`-only handler was insufficient, see above).
- `bookchaowalit-techblog-frontend`, `bookchaowalit-techspace-frontend`,
  `bookchaowalit-mcplist-frontend` — added `headers()` fresh (none existed).
- `bookchaowalit-artblog-frontend` — added `headers()` fresh, with both
  `/api/mcp` and `/api/mcp/` sources since this repo has
  `trailingSlash: true`.

**Honest scope note:** these are 4 repos outside DevHub's own boundary.
The config changes are small, additive, and copy an already-proven
pattern — but they were verified for syntax validity only (Node could
parse each file), not independently rebuilt end-to-end, since a full
verification pass on 4 more repos was outside this session's remaining
scope. If picking this up again: `npm run build` each of the 4 sibling
repos to confirm, then a real cross-origin smoke test from a deployed
DevHub against all 5 live endpoints.

## Other findings

- **Endpoint names documented in DevHub don't match the real tool names.**
  `apis/portfolio/page.tsx` lists `get_portfolio_blog`, `get_github`,
  `get_contact`, `get_about` as the Portfolio API's tools; the real
  handlers in `bookchaowalit-portfolio-frontend` are named
  `get_blog_posts`, `get_github_repos`, `get_contact_info` (no `get_about`
  tool exists at all). Documentation drift, not fixed in this pass —
  flagged for whoever owns keeping the two in sync.
- Metadata (`layout.tsx`) was fully generic — `"Devhub by Bookchaowalit -
  A modern web application built with Next.js"` — despite real,
  describable functionality underneath. Fixed to describe the actual
  product.
- README was 100% unedited `create-next-app` boilerplate — same pattern
  as `booknbook` before this session. Rewritten.

## What I'm proud of pointing to

Not the CORS fix itself — the diagnostic chain that found it. "The
Playground looked like it should work, I checked whether preflight would
pass, found it wouldn't for 4 of 5 APIs, then checked whether the 5th one
that *had* an OPTIONS handler was actually sufficient, and found it
wasn't either" is a more complete answer than "I added a CORS header."

## What I'd improve next

1. Verify the 4 sibling-repo config changes with a real build, not just
   a syntax check.
2. Add a visible error state in the Playground UI — right now a CORS
   failure just shows a generic JS error in the response panel, not an
   explanation a user could act on.
3. Fix the endpoint-name documentation drift against
   `bookchaowalit-portfolio-frontend`'s real tool names.
4. `apis/[id]/page.tsx` and `src/app/page.tsx` hardcode the same 5-API
   catalog independently — worth extracting to one shared data file (the
   same pattern `bookchaowalit-portfolio-frontend` already uses for its
   129 projects) so the two can't drift from each other next time.

## Status

Interview case-study pass: 2026-08-05. Found and fixed the CORS chain
above (this repo + config additions to 4 sibling repos), rewrote generic
metadata and README. Visual identity (dark slate, blue/purple gradient) —
real and coherent — was not touched.

## Known limits

- The "send it from your browser in the Playground" link under each API's
  Quick start opens `/playground` without the API id, so the Playground starts
  on its default API (Portfolio) instead of the one on the page, and the
  Playground cannot send the `tools/call` example shown there (it supports
  `tools/list`). Open the Playground and pick the API by hand.
  (Codex report devtools-devhub-web-32cf46a1cc, 2026-11-20.)
