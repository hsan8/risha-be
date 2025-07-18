/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'node_modules', 'dist', 'coverage', 'jest*\\.ts', 'typeorm*\\.ts', 'index.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-inferrable-types': 'off',
    'func-names': ['error', 'as-needed'],
    'no-underscore-dangle': ['error'],
    'require-await': ['error'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-multi-assign': ['error'],
    'no-magic-numbers': [
      'error',
      {
        ignoreArrayIndexes: true,
        ignore: [0, 1, -1],
        enforceConst: true,
        detectObjects: false,
      },
    ],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1, maxBOF: 0 }],
    'max-len': [
      'error',
      { code: 120, tabWidth: 2, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true },
    ],
  },
  overrides: [
    {
      files: ['*.spec.ts', '*.e2e-spec.ts'],
      rules: {
        'no-magic-numbers': ['off'],
      },
    },
  ],
};
