export default [
    {
      files: ['*.js', '*.svelte'],  // Specificeer de bestandsextensies die je wilt linten
      extends: ['eslint:recommended'],
      rules: {
        semi: 'error',
        'prefer-const': 'error',
      },
    },
    {
      files: ['*.svelte'],
      rules: {
        'svelte/no-unused-vars': 'warn',
      },
    },
  ];
  