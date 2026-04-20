import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",

    // Monorepo folders with their own tooling/config:
    "marketplace-backend/**", // CommonJS Node backend (uses require)
    "supreme-tax/frontend/**", // Separate Vite app with its own lint setup
    "scripts/**", // Node scripts (often CommonJS)
  ]),

]);

export default eslintConfig;
