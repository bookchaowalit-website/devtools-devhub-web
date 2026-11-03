import { createRequire } from "node:module";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Load the CJS build: the ESM build default-imports minimatch, which minimatch 11 no longer exports.
const { FlatCompat } = createRequire(import.meta.url)("@eslint/eslintrc");

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  { ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"] },
];
export default eslintConfig;
