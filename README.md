# Recipe Components (Stencil)

This package contains Stencil web components for a recipe planner: `recipe-card`, `recipe-list`, `recipe-detail`, `recipe-form`, and `meal-planner`.

Quick start (local development):

1. Install deps:

```bash
npm install
```

2. Start dev server:

```bash
npm start
```

3. Build for publish:

```bash
npm run build
```

Integration (SvelteKit): import the loader and call `applyPolyfills` / `defineCustomElements` in a client-only lifecycle (e.g. `onMount` in `+layout.svelte`).
