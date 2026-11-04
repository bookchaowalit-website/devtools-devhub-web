# DevHub design direction

## Product world
DevHub is a live API/MCP routing layer for the Book ecosystem. The page should feel like pulling a physical line from a service fabric: inspect the catalog, read the contract, run the request.

## Visual direction
- Seed: 505a76e5 — assigned textile/drawcord direction.
- Material: near-black silk, warm brass, hairline cable geometry.
- Typography: editorial serif for the promise; Geist Mono for protocol labels and request data.
- Composition: a single request console leads into the API catalog. Card grids are service nodes, not generic SaaS cards.

## Interaction
- Primary CTA opens the existing playground.
- API nodes keep their existing /apis/[id] routes.
- Gold is reserved for live signal, action, and route emphasis.
- Hover lifts a service node slightly; no decorative motion is required.

## Constraints
- Keep API catalog values sourced from src/lib/api-catalog.ts.
- Do not claim uptime or performance that the product does not measure.
- Preserve docs, playground, API detail, and MCP routes.
- Maintain readable contrast and a compact mobile layout.

## Design floor (ADR-0007)

Floor 1.0.0, checked by the reusable `design-floor` CI job against `design-floor.json` (5 widths, 10 routes including the 404 page). Local result at adoption: 12/12 automated rules pass, no waivers. Checker `design-floor` v1.5.11 (`df695c12`).

## Tokens

Vendored unchanged: `src/styles/design-floor/tokens.css` (`css-vars` 1.0.0) and `src/styles/design-floor/aliases/shadcn.css` (`aliases-shadcn` 1.0.0). This app uses the shadcn aliases, not `tailwind/v4.css`. App values live in `src/styles/app-theme.css`.

| Token | Value | Note |
|---|---|---|
| `--color-bg` | `#10100f` | page ink |
| `--color-surface` | `#151514` | service cards |
| `--color-fg` | `#f4f0e7` | primary text |
| `--color-fg-muted` | `#918b81` | secondary text |
| `--color-accent` / `--color-focus` | `#d8a84e` | gold: primary action and focus ring |
| `--color-accent-fg` | `#10100f` | text on gold |
| `--color-border` | `#3b3a35` | hairlines |
| `--font-sans` | Geist, then Noto Sans Thai | Thai glyphs fall back to self-hosted Noto Sans Thai (`src/app/fonts/`, OFL) |
| `--font-serif` | Georgia | headings (not loaded from a font file) |
| `--font-mono` | Geist Mono | protocol labels |

Dark mode: the app is dark by design (single theme, no `data-theme` switch). Some older pages (`/more-projects`) still use Tailwind `dark:` utilities that follow the OS setting; they are not part of the token set.

Waivers: none.

