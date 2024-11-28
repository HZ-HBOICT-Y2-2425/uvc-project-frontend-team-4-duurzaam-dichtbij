import eslintRecommended from 'eslint/conf/eslint-recommended.js';

export default [
  eslintRecommended,
  {
    files: ['*.js', '*.svelte'],
    rules: {
      semi: 'error',
      'prefer-const': 'error',
    },
  },
];