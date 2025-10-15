import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat
    .extends('next/core-web-vitals', 'next/typescript')
    .map((config) => ({
      ...config,
    })),
  {
    plugins: {
      prettier: (await import('eslint-plugin-prettier')).default,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

export default eslintConfig;
