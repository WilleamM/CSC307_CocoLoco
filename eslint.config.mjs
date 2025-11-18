// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist', 'node_modules'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node, // so backend code can use process, require, etc.
        jest: true,
      },
    },
    plugins: {
      react,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      // from your old .eslintrc:
      'react/react-in-jsx-scope': 'off',
    },
  },
];
