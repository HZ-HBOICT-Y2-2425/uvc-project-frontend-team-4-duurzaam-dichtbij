export default [
  {
      files: ["**/*.svelte", "**/*.ts", "**/*.js"],
      rules: {
          "semi": ["error", "always"],
          "prefer-const": "error"
      },
      ignores: ["node_modules/**", ".svelte-kit/**"],
  }
];
