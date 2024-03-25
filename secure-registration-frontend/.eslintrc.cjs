module.exports = {
  root: true,
  env: { browser: true, es2020: true, 'cypress/globals': true, 'vitest-globals/env': true},
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:cypress/recommended',
    'plugin:vitest/recommended',
    'plugin:vitest-globals/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest', sourceType: 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  settings: { react: { version: 'detect' } },
  plugins: ['react-refresh', 'react', 'prettier', 'cypress', 'vitest'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  },
  overrides: [
    {
      files: ['cypress/e2e/**/*.js'],
      rules: {
        // Disable Vitest-specific rules for Cypress tests
        'vitest/valid-expect': 'off',
        'vitest/expect-expect': 'off',
      }
    }
  ]
}
