import assert from "node:assert/strict";
import { describe, it } from "node:test";
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
