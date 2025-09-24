import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable all unused variable checks
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // Keep other relaxations you had
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
