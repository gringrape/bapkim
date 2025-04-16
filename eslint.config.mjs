import { FlatCompat } from '@eslint/eslintrc';

import pluginJs from '@eslint/js';
import globals from 'globals';

import path from 'path';
import { fileURLToPath } from 'url';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  pluginJs.configs.recommended,
  ...compat.extends('airbnb-base'),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node, // 기존 node 전역
        ...globals.browser, // 추가: window, document 등 브라우저 전역
      },
    },
  },

  {
    files: ['eslint.config.mjs'],
    rules: {
      'no-underscore-dangle': 'off',
      'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],
    },
  },
];
