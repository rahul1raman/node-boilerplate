import globals from "globals";

import path from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jest from "eslint-plugin-jest";

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginJs.configs.recommended,
});

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "script" },
  },
  {
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      "no-unused-vars": "error",
      "no-undef": "warn",
    },
  },
  {
    files: ["**/*spec.js"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off",
    },
  },
  ...compat.extends("standard"),
  eslintConfigPrettier,
];
