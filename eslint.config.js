module.exports = [
    require('eslint/conf/eslint-recommended.js'),
    {
      files: ['*.js', '*.svelte'],
      rules: {
        semi: 'error',
        'prefer-const': 'error',
      },
    },
  ];