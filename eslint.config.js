export default [
  {
      files: ["**/*.svelte", "**/*.ts", "**/*.js"],
      rules: {
          "semi": ["error", "always"],
          "prefer-const": "error"
      },
      ignorePatterns: ["node_modules/", ".svelte-kit/"],
  }
];
