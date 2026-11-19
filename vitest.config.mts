import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/app/**/*.{ts,tsx}", "src/components/**/*.tsx", "src/lib/**/*.ts"],
      exclude: ["src/app/layout.tsx"],
      thresholds: { lines: 90 },
    },
  },
});
