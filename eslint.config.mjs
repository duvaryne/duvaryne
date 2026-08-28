import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Native flat config. The predecessor repo used @eslint/eslintrc's FlatCompat to load
 * these as legacy shareable configs; eslint-config-next exports flat configs directly
 * now, so the compat shim and its dependency are gone.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    ".open-next/**",
    ".wrangler/**",
    "next-env.d.ts",
    "cloudflare-env.d.ts",
  ]),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
