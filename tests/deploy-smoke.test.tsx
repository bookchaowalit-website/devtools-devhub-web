import { readFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import DocsPage from "@/app/docs/page";

// scripts/deploy-smoke.sh greps the live pages for these markers; a stale one fails every deploy.
const smoke = readFileSync(new URL("../scripts/deploy-smoke.sh", import.meta.url), "utf8");
const marker = (name: string) => smoke.match(new RegExp(`^${name}="([^"]+)"`, "m"))?.[1];

describe("deploy smoke markers", () => {
  it("the home marker is on the home page", () => {
    expect(marker("HOME_MARKER")).toBeTruthy();
    expect(renderToString(<HomePage />)).toContain(marker("HOME_MARKER"));
  });
  it("the /docs marker is on the docs page", () => {
    expect(smoke).toMatch(/^MAIN_ROUTE="\/docs"$/m);
    expect(marker("MAIN_MARKER")).toBeTruthy();
    expect(renderToString(<DocsPage />)).toContain(marker("MAIN_MARKER"));
  });
});
