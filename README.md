## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev
```

## Building

To create a production version of your app:

```bash
npm run build
```

## Project

We use **SvelteKit** for routing, which in short means, creating new folders for new routes, and adding +page.svelte pages.
Don't forget the `+` in `+page.svelte`, otherwise, SvelteKit won't see your pages.
