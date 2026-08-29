# @recipe-planner/ui

Reusable Stencil Web Components for a recipe planner application.

## Installation

Install the package from npm:

```bash
npm install @recipe-planner/ui
```

## Components

This package provides the following custom elements:

- `recipe-card` — Displays a recipe summary
- `recipe-list` — Displays a list of recipes
- `recipe-detail` — Displays detailed recipe information
- `recipe-form` — Create and edit recipes
- `meal-planner` — Create and manage weekly meal plans
- `modal` — Reusable modal/dialog component

## Using with SvelteKit

Initialize the Stencil components on the client using `onMount`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  onMount(async () => {
    const { defineCustomElements } =
      await import('@recipe-planner/ui/loader');

    defineCustomElements();
  });
</script>
```

After initialization, the components can be used directly:

```svelte
<recipe-card />

<recipe-list />

<recipe-detail />

<recipe-form />

<meal-planner />

<modal />
```

## Passing Data

Stencil components are Web Components. Objects and arrays should be passed as DOM properties rather than HTML attributes.

For example:

```svelte
<script lang="ts">
  let recipe = {
    id: '123',
    title: 'Chicken Pasta',
    ingredients: ['Chicken', 'Pasta']
  };

  let categories = [
    {
      id: '1',
      name: 'Dinner',
      parent_id: null
    }
  ];
</script>

<recipe-form
  .recipe={recipe}
  .categories={categories}
/>
```

The `.` syntax is important because `recipe` and `categories` are JavaScript objects/arrays.

## Events

The components use standard `CustomEvent`s to communicate with the host application.

For example, `recipe-form` emits a `save` event:

```svelte
<recipe-form
  .recipe={recipe}
  .categories={categories}
  on:save={handleSave}
/>

<script lang="ts">
  function handleSave(event: CustomEvent) {
    const recipe = event.detail;

    console.log(recipe);
  }
</script>
```

The event payload is available through:

```ts
event.detail
```

## Component Reference

### `recipe-card`

Displays a recipe summary.

### `recipe-list`

Displays a list of recipes.

### `recipe-detail`

Displays detailed recipe information.

### `recipe-form`

Provides a form for creating and editing recipes.

Supports recipe data, categories, subcategories, ingredients, steps, and image information.

### `meal-planner`

Provides a weekly meal planner.

The planner is organized from Monday through Sunday and supports meal types such as:

- Breakfast
- Lunch
- Dinner

Example:

```svelte
<meal-planner
  .mealPlans={mealPlans}
/>
```

### `modal`

Reusable modal/dialog component for forms, confirmations, and other content.

## Development

Clone the repository and install dependencies:

```bash
npm install
```

Start the Stencil development server:

```bash
npm start
```

Create a production build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Publishing

The package is published as a public scoped npm package:

```text
@recipe-planner/ui
```

Create a production build before publishing:

```bash
npm run build
```

The package is configured to automatically build before publishing.

Publish the package:

```bash
npm publish
```