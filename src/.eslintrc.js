module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: ['standard', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    noConsole: 'warn', //* Avoid Bugs
    noUndef: 'error',
    semi: 'always',
    semiSpacing: 'error', //* Best Practices
    eqeqeq: 'warn',
    noInvalidThis: 'error',
    noReturnAssign: 'error',
    noUnusedExpressions: ['error', { allowTernary: true }],
    noUselessConcat: 'error',
    noUselessReturn: 'error',
    noConstantCondition: 'warn',
    noUnusedVars: ['warn', { argsIgnorePattern: 'req|res|next|__' }], //* Enhance Readability
    indent: ['error', 2, { SwitchCase: 1 }],
    noMixedSpacesAndTabs: 'warn',
    spaceBeforeBlocks: 'error',
    spaceInParens: 'error',
    spaceInfixOps: 'error',
    spaceUnaryOps: 'error',
    quotes: ['error', 'single'],
    //
    maxLen: ['error', { code: 200 }],
    maxLines: ['error', { max: 500 }],
    keywordSpacing: 'error',
    multilineTernary: ['error', 'never'],
    noMixedOperators: 'error',
    //
    noMultipleEmptyLines: ['error', { max: 2, maxEOF: 1 }],
    noWhitespaceBeforeProperty: 'error',
    nonblockStatementBodyPosition: 'error',
    objectPropertyNewline: ['error', { allowAllPropertiesOnSameLine: true }], //* ES6
    arrowSpacing: 'error',
    noConfusingArrow: 'error',
    noDuplicateImports: 'error',
    noVar: 'error',
    objectShorthand: 'off',
    preferConst: 'error',
    preferTemplate: 'warn',
  },
};
