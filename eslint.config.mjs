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
      indent: ["error", 2],
      semi: ["error", "always"],
      "no-unused-vars": "error",
      quotes: ["error", "single"],
      "no-undef": "error",
      camelcase: "error",
      eqeqeq: "error",
      "no-extra-semi": "error",
      "no-mixed-spaces-and-tabs": "error",
      "arrow-spacing": "error",
      "no-trailing-spaces": "error",
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
