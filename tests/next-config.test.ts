import assert from "node:assert/strict";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config.ts";

// The production build must fail on type or lint errors instead of shipping them.
describe("next.config", () => {
  it("does not suppress TypeScript build errors", () => {
    assert.notEqual(nextConfig.typescript?.ignoreBuildErrors, true);
  });

  it("does not skip ESLint during builds", () => {
    const eslint = (nextConfig as { eslint?: { ignoreDuringBuilds?: boolean } }).eslint;
    assert.notEqual(eslint?.ignoreDuringBuilds, true);
  });
});

describe("next.config redirects", () => {
  it("sends the retired /more-projects page to the portfolio hub for good", async () => {
    const redirects = await nextConfig.redirects!();
    assert.deepEqual(redirects, [{ source: "/more-projects", destination: "https://bookchaowalit.com/", permanent: true }]);
  });
});

describe("production build", () => {
  // Next.js 16 no longer runs ESLint inside `next build`, and Vercel builds without waiting for CI.
  it("runs ESLint before next build so lint errors fail the deploy", async () => {
    const { default: pkg } = await import("../package.json", { with: { type: "json" } });
    expect(pkg.scripts.build).toMatch(/^npm run lint && next build$/);
  });
});
