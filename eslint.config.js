import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';

export default [
  ...eslintPluginSvelte.configs['flat/recommended'],
  {
      files: ["**/*.svelte", "**/*.ts", "**/*.js"],
      rules: {
          "semi": ["error", "always"],
          "prefer-const": "error"
      },
      ignores: ["node_modules/**", ".svelte-kit/**"],
      languageOptions: {
        parserOptions: {
          // Specify the `svelte.config.js`.
          svelteConfig
        }
      }  
  }
];
