$root = 'c:\Users\rahulyadav06\workspace\dev\svelte\recipe_planner'

# Write my-recipes page
$content = @'
<script lang="ts">
  import { onMount } from 'svelte';
  import { createRecipe, updateRecipe, deleteRecipe, fetchCategoryOptions, fetchUserRecipes, type Recipe } from '$lib/api';

  let userId = '';
  let recipeFormEl: (HTMLElement & { recipe?: Recipe; categories?: Array<{ id: string; name: string; parent_id: string | null }> }) | null = null;
  let selectedRecipe: Recipe | null = null;
  let userRecipes: Recipe[] = [];
  let categoryOptions: Array<{ id: string; name: string; parent_id: string | null }> = [];

  function genUserId() {
    const existing = localStorage.getItem('rp_user');
    if (existing) return existing;

    const id = 'user_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem('rp_user', id);
    return id;
  }

  async function reloadUserRecipes() {
    if (!userId) return;

    const recipes = await fetchUserRecipes(userId);
    userRecipes = recipes;

    if (!selectedRecipe && recipes.length) {
      selectedRecipe = recipes[0];
    }

    if (selectedRecipe && !recipes.some((recipe) => recipe.id === selectedRecipe?.id)) {
      selectedRecipe = recipes[0] ?? null;
    }
  }

  const handleSave = async (event: Event) => {
    const data = (event as CustomEvent<any>).detail;
    if (!data) return;

    try {
      if (data.id) {
        const updated = await updateRecipe(data.id, data);
        selectedRecipe = updated;
      } else {
        const created = await createRecipe({ ...data, createdBy: 'user', createdAt: new Date() });
        selectedRecipe = created;
      }

      await reloadUserRecipes();
    } catch (e) {
      console.error('[MyRecipesPage] save error:', e);
    }
  };

  const handleDelete = async (recipeId: string) => {
    if (!recipeId) return;

    try {
      await deleteRecipe(recipeId);
      if (selectedRecipe?.id === recipeId) {
        selectedRecipe = null;
      }
      await reloadUserRecipes();
    } catch (e) {
      console.error('[MyRecipesPage] delete error:', e);
    }
  };

  const handleEdit = (recipe: Recipe) => {
    selectedRecipe = recipe;
  };

  const handleNew = () => {
    window.location.href = '/my-recipes/create';
  };

  onMount(async () => {
    userId = genUserId();
    categoryOptions = await fetchCategoryOptions();
    await reloadUserRecipes();
    console.log('[MyRecipesPage] userId =', userId);
  });

  $: if (recipeFormEl) {
    recipeFormEl.recipe = selectedRecipe ?? undefined;
    recipeFormEl.categories = categoryOptions;
  }
</script>

<section class="route-page">
  <div class="page-header">
    <h1>My Recipes</h1>
    <button type="button" class="new-button" on:click={handleNew}>
      + New recipe
    </button>
  </div>

  <div class="layout">
    <div class="form-panel">
      <recipe-form bind:this={recipeFormEl} on:save={handleSave} categories={categoryOptions}></recipe-form>
    </div>

    <aside class="list-panel">
      <h2>Your saved recipes</h2>

      {#if userRecipes.length === 0}
        <p class="empty-state">No recipes yet. Add your first recipe.</p>
      {:else}
        <ul class="recipe-list">
          {#each userRecipes as recipe}
            <li class:active={selectedRecipe?.id === recipe.id}>
              <div>
                <strong>{recipe.title}</strong>
                <small>{recipe.category} / {recipe.subcategory}</small>
              </div>
              <div class="item-actions">
                <button type="button" class="secondary" on:click={() => handleEdit(recipe)}>Edit</button>
                <button type="button" class="danger" on:click={() => handleDelete(recipe.id)}>Delete</button>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </aside>
  </div>
</section>

<style>
  .route-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
  }

  .new-button,
  .secondary,
  .danger {
    border: none;
    border-radius: 8px;
    padding: 0.65rem 0.9rem;
    font: inherit;
    cursor: pointer;
  }

  .new-button {
    background: #111827;
    color: #fff;
  }

  .secondary {
    background: #e5e7eb;
    color: #111827;
  }

  .danger {
    background: #fee2e2;
    color: #991b1b;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1.7fr) minmax(260px, 0.9fr);
    gap: 1.25rem;
  }

  .form-panel,
  .list-panel {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem;
  }

  .list-panel h2 {
    margin: 0 0 1rem;
    font-size: 1.1rem;
  }

  .empty-state {
    color: #6b7280;
    margin: 0;
  }

  .recipe-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .recipe-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #f9fafb;
  }

  .recipe-list li.active {
    border-color: #f59e0b;
    background: #fff7ed;
  }

  .recipe-list strong,
  .recipe-list small {
    display: block;
  }

  .recipe-list small {
    color: #6b7280;
    margin-top: 4px;
  }

  .item-actions {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  @media (max-width: 800px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
'@
Set-Content -Path (Join-Path $root 'sveltekit-consumer/src/routes/my-recipes/+page.svelte') -Encoding utf8 -Value $content

# Create new route
$createDir = Join-Path $root 'sveltekit-consumer/src/routes/my-recipes/create'
New-Item -ItemType Directory -Force -Path $createDir | Out-Null

$contentCreate = @'
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { createRecipe, fetchCategoryOptions, type Recipe } from '$lib/api';

  let recipeFormEl: (HTMLElement & { recipe?: Recipe; categories?: Array<{ id: string; name: string; parent_id: string | null }> }) | null = null;
  let categoryOptions: Array<{ id: string; name: string; parent_id: string | null }> = [];

  const handleSave = async (event: Event) => {
    const data = (event as CustomEvent<any>).detail;
    if (!data) return;

    try {
      const created = await createRecipe({ ...data, createdBy: 'user', createdAt: new Date() });
      goto(`/my-recipes?edit=${created.id}`);
    } catch (e) {
      console.error('[MyRecipesCreatePage] save error:', e);
    }
  };

  onMount(async () => {
    categoryOptions = await fetchCategoryOptions();
  });

  $: if (recipeFormEl) {
    recipeFormEl.categories = categoryOptions;
  }
</script>

<section class="route-page">
  <div class="page-header">
    <h1>Create Recipe</h1>
    <a href="/my-recipes" class="back-link">Back to recipes</a>
  </div>

  <div class="form-panel">
    <recipe-form bind:this={recipeFormEl} on:save={handleSave} categories={categoryOptions}></recipe-form>
  </div>
</section>

<style>
  .route-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
  }

  .back-link {
    color: #111827;
    text-decoration: none;
    background: #e5e7eb;
    border-radius: 8px;
    padding: 0.7rem 0.9rem;
    font-weight: 600;
  }

  .form-panel {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 1rem;
  }
</style>
'@
Set-Content -Path (Join-Path $createDir '+page.svelte') -Encoding utf8 -Value $contentCreate

# Write recipe card component
$contentCard = @'
import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true
})
export class RecipeCard {
  @Prop() recipe: any;
  @Prop() compact: boolean = false;

  @Event({ bubbles: true, composed: true }) favorite: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) open: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) edit: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) delete: EventEmitter<string>;

  private onFavorite = (event: MouseEvent) => {
    event.stopPropagation();
    this.favorite.emit(this.recipe?.id);
  };

  private onOpen = (event?: MouseEvent) => {
    event?.stopPropagation();
    const recipeId = this.recipe?.id;
    if (!recipeId) return;

    this.open.emit(recipeId);

    if (typeof window !== 'undefined') {
      window.location.href = `/recipes/view/${recipeId}`;
    }
  };

  private onEdit = (event: MouseEvent) => {
    event.stopPropagation();
    const recipeId = this.recipe?.id;
    if (!recipeId) return;

    this.edit.emit(recipeId);

    if (typeof window !== 'undefined') {
      window.location.href = `/my-recipes?edit=${recipeId}`;
    }
  };

  private onDelete = (event: MouseEvent) => {
    event.stopPropagation();
    const recipeId = this.recipe?.id;
    if (!recipeId) return;

    this.delete.emit(recipeId);
  };

  render() {
    const title = this.recipe?.title || 'Untitled';
    const img = this.recipe?.image || '';

    return (
      <article class="card" onClick={this.onOpen}>
        {img ? <img src={img} alt={title} /> : <div class="image-placeholder">Recipe</div>}
        <div class="content">
          <div class="meta-row">
            <span class="chip">{this.recipe?.category || 'General'}</span>
            {this.recipe?.subcategory ? <span class="chip subtle">{this.recipe.subcategory}</span> : null}
          </div>
          <h3>{title}</h3>
          <div class="actions">
            <button type="button" class="icon-button edit" aria-label="Edit recipe" onClick={this.onEdit}>✎</button>
            <button type="button" class="icon-button favorite" aria-label="Favorite recipe" onClick={this.onFavorite}>♥</button>
            <button type="button" class="icon-button view" aria-label="View recipe" onClick={this.onOpen}>◉</button>
            <button type="button" class="icon-button delete" aria-label="Delete recipe" onClick={this.onDelete}>🗑</button>
          </div>
        </div>
      </article>
    );
  }
}
'@
Set-Content -Path (Join-Path $root 'src/components/recipe-card/recipe-card.tsx') -Encoding utf8 -Value $contentCard

$contentCSS = @'
.card{display:flex;flex-direction:column;background:linear-gradient(180deg,#ffffff 0%,#fffaf3 100%);border:1px solid rgba(148,163,184,.22);border-radius:18px;overflow:hidden;box-shadow:0 10px 24px rgba(15,23,42,.08);min-height:260px;transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;cursor:pointer}.card:hover{transform:translateY(-2px);box-shadow:0 14px 28px rgba(15,23,42,.12);border-color:rgba(245,158,11,.45)}.card img,.image-placeholder{width:100%;height:170px;object-fit:cover;display:block;background:linear-gradient(135deg,#f59e0b,#f97316)}.image-placeholder{display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.content{display:flex;flex:1;flex-direction:column;padding:14px}.meta-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}.chip{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;background:#fff7ed;color:#a16207;font-size:.7rem;font-weight:700}.chip.subtle{background:#eef2ff;color:#4338ca}.content h3{margin:0 0 12px;font-size:1.08rem;line-height:1.3;color:#111827}.actions{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:8px}.icon-button{width:32px;height:32px;border:none;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;font-size:1rem;transition:transform .15s ease, filter .15s ease}.icon-button:hover{transform:translateY(-1px);filter:brightness(.98)}.icon-button.edit{background:#e0f2fe;color:#0f172a}.icon-button.favorite{background:#fee2e2;color:#991b1b}.icon-button.view{background:#e5e7eb;color:#111827}.icon-button.delete{background:#fecaca;color:#7f1d1d}
'@
Set-Content -Path (Join-Path $root 'src/components/recipe-card/recipe-card.css') -Encoding utf8 -Value $contentCSS

$contentDetail = @'
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { fetchRecipes, type Recipe } from '$lib/api';

  let recipe: Recipe | null = null;
  let loading = true;
  let error = '';

  async function loadRecipe() {
    loading = true;
    error = '';

    try {
      const recipeId = $page.params.recipe_id;
      const recipes = await fetchRecipes();
      recipe = recipes.find((item) => item.id === recipeId) ?? null;

      if (!recipe) {
        error = 'Recipe not found.';
      }
    } catch (e) {
      console.error('[RecipeViewPage] load error:', e);
      error = 'Unable to load recipe.';
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadRecipe();
  });

  $: if ($page.params.recipe_id) {
    loadRecipe();
  }
</script>

<section class="page">
  {#if loading}
    <p class="status">Loading recipe...</p>
  {:else if error}
    <div class="error-box">
      <p>{error}</p>
      <a href="/">Back to recipes</a>
    </div>
  {:else if recipe}
    <article class="recipe-detail">
      <div class="hero">
        <img src={recipe.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'} alt={recipe.title} />
      </div>

      <div class="content">
        <div class="header-row">
          <div>
            <p class="eyebrow">{recipe.category || 'General'} / {recipe.subcategory || 'General'}</p>
            <h1>{recipe.title}</h1>
          </div>
          <a href="/" class="back-link">Back</a>
        </div>

        <div class="section">
          <h2>Description</h2>
          <p>{recipe.description || 'No description provided.'}</p>
        </div>

        <div class="section">
          <h2>Ingredients</h2>
          <ul>
            {#each recipe.ingredients || [] as ingredient}
              <li>{ingredient}</li>
            {/each}
          </ul>
        </div>

        <div class="section">
          <h2>Steps</h2>
          <ol>
            {#each recipe.steps || [] as step}
              <li>{step}</li>
            {/each}
          </ol>
        </div>
      </div>
    </article>
  {/if}
</section>

<style>
  .page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 20px 80px;
  }

  .status {
    text-align: center;
    color: #4b5563;
  }

  .error-box {
    background: #fff1f2;
    border: 1px solid #fecdd3;
    border-radius: 12px;
    padding: 20px;
    color: #9f1239;
  }

  .error-box a {
    color: #9f1239;
    font-weight: 700;
  }

  .recipe-detail {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.07);
  }

  .hero img {
    display: block;
    width: 100%;
    height: 340px;
    object-fit: cover;
    background: #f3f4f6;
  }

  .content {
    padding: 24px;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
  }

  .eyebrow {
    margin: 0 0 8px;
    color: #f59e0b;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 0.75rem;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 4vw, 3rem);
    color: #111827;
  }

  .section {
    margin-top: 24px;
  }

  .section h2 {
    margin: 0 0 12px;
    font-size: 1.25rem;
    color: #111827;
  }

  .section p,
  .section li {
    color: #374151;
    line-height: 1.7;
  }

  ul,
  ol {
    margin: 0;
    padding-left: 1.2rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.7rem 1rem;
    background: #111827;
    color: #fff;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
  }
</style>
'@
Set-Content -Path (Join-Path $root 'sveltekit-consumer/src/routes/recipes/view/[recipe_id]/+page.svelte') -Encoding utf8 -Value $contentDetail

# Main list page
$contentMain = @'
<script lang="ts">
  import { onMount } from "svelte";
  import {
    fetchRecipes,
    fetchFavorites,
    toggleFavorite,
    fetchMealPlan,
    fetchCategoryOptions,
    deleteRecipe,
    type Recipe,
  } from "$lib/api";

  let recipes: Recipe[] = [];
  let selectedRecipe: Recipe | null = null;
  let favorites: Set<string> = new Set();
  let mealPlan: any = null;

  let isLoading = true;
  let error = "";
  let userId = "";

  let searchTerm = "";
  let selectedCategory = "all";
  let selectedSubcategory = "all";
  let categoryOptions: Array<{ id: string; name: string; parent_id: string | null }> = [];

  let recipeListEl: any = null;
  let recipeDetailEl: any = null;

  $: categoryList = [
    { id: "all", name: "All categories" },
    ...Array.from(
      new Set(
        categoryOptions.length
          ? categoryOptions
              .filter((item) => !item.parent_id)
              .map((item) => JSON.stringify({ id: item.id, name: item.name }))
          : recipes.map((r) => JSON.stringify({ id: r.category, name: r.category })).filter(Boolean)
      )
    )
      .map((value) => JSON.parse(value))
      .filter((item) => item.id || item.name)
  ];

  $: selectedCategoryRow =
    selectedCategory === "all"
      ? null
      : categoryOptions.find((item) => item.id === selectedCategory) ?? null;

  $: selectedSubcategoryRow =
    selectedSubcategory === "all"
      ? null
      : categoryOptions.find((item) => item.id === selectedSubcategory) ?? null;

  $: filteredSubcategories =
    selectedCategory === "all"
      ? [
          { id: "all", name: "All subcategories" },
          ...Array.from(
            new Set(
              categoryOptions.length
                ? categoryOptions
                    .filter((item) => item.parent_id)
                    .map((item) => JSON.stringify({ id: item.id, name: item.name }))
                : recipes.map((r) => JSON.stringify({ id: r.subcategory, name: r.subcategory })).filter(Boolean)
            )
          )
            .map((value) => JSON.parse(value))
            .filter((item) => item.id || item.name)
        ]
      : [
          { id: "all", name: "All subcategories" },
          ...Array.from(
            new Set(
              categoryOptions.length
                ? categoryOptions
                    .filter((item) => item.parent_id === selectedCategoryRow?.id)
                    .map((item) => JSON.stringify({ id: item.id, name: item.name }))
                : recipes
                    .filter((r) => r.category === selectedCategory || (selectedCategoryRow && r.category === selectedCategoryRow.name))
                    .map((r) => JSON.stringify({ id: r.subcategory, name: r.subcategory }))
                    .filter(Boolean)
            )
          )
            .map((value) => JSON.parse(value))
            .filter((item) => item.id || item.name)
        ];

  $: subcategoryDisabled = selectedCategory === "all";

  $: filteredRecipes = recipes.filter((recipe) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      [
        recipe.title,
        recipe.summary,
        recipe.description,
        recipe.category,
        recipe.subcategory,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesCategory =
      selectedCategory === "all" ||
      recipe.category === selectedCategory ||
      (selectedCategoryRow && recipe.category === selectedCategoryRow.name);

    const matchesSubcategory =
      selectedSubcategory === "all" ||
      recipe.subcategory === selectedSubcategory ||
      (selectedSubcategoryRow && recipe.subcategory === selectedSubcategoryRow.name);

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  $: if (recipeListEl) {
    recipeListEl.recipes = filteredRecipes;
    recipeListEl.layout = "grid";
  }

  $: if (recipeDetailEl) {
    recipeDetailEl.recipe = selectedRecipe ?? undefined;
  }

  $: if (filteredRecipes.length) {
    const selectedId = selectedRecipe?.id ?? null;

    if (!selectedId || !filteredRecipes.some((r) => r.id === selectedId)) {
      selectedRecipe = filteredRecipes[0];
    }
  } else {
    selectedRecipe = null;
  }

  function genUserId() {
    const existing = localStorage.getItem("rp_user");

    if (existing) {
      return existing;
    }

    const id = "user_" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem("rp_user", id);
    return id;
  }

  const handleOpen = (event: Event) => {
    const id = (event as CustomEvent<string>).detail;
    const match = filteredRecipes.find((r) => r.id === id);

    if (match) {
      selectedRecipe = match;
    }
  };

  const handleEdit = (event: Event) => {
    const id = (event as CustomEvent<string>).detail;
    if (id) {
      window.location.href = `/my-recipes?edit=${id}`;
    }
  };

  const handleDelete = async (event: Event) => {
    const id = (event as CustomEvent<string>).detail;
    if (!id) return;

    try {
      await deleteRecipe(id);
      await loadAll();
    } catch (e) {
      console.error('[Page] Delete error:', e);
    }
  };

  const handleFavorite = async (event: Event) => {
    const id = (event as CustomEvent<string>).detail;

    try {
      await toggleFavorite(userId, id);

      const nextFavorites = new Set(favorites);
      if (nextFavorites.has(id)) {
        nextFavorites.delete(id);
      } else {
        nextFavorites.add(id);
      }

      favorites = nextFavorites;
      localStorage.setItem("rp_favs", JSON.stringify([...favorites]));
    } catch (e) {
      console.error("[Page] Favorite error:", e);
    }
  };

  async function loadAll() {
    try {
      isLoading = true;
      error = "";

      const fetchedCategories = await fetchCategoryOptions();
      categoryOptions = fetchedCategories;

      recipes = await fetchRecipes();

      if (recipes.length) {
        selectedRecipe = recipes[0];
      }

      const favs = await fetchFavorites(userId);
      favorites = new Set(favs);

      mealPlan = await fetchMealPlan(userId);
    } catch (e) {
      console.error("[Page] loadAll() error:", e);
      error = e instanceof Error ? e.message : "Failed to load application data";
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    userId = genUserId();
    loadAll();
  });
</script>

<svelte:head>
  <title>Recipe Planner Consumer</title>
</svelte:head>

<section class="page">
  <h1>Recipe Planner</h1>

  {#if isLoading}
    <p class="loading">Loading recipes...</p>
  {:else if error}
    <div class="error-box">
      <p>
        <strong>❌ Error:</strong>
        {error}
      </p>

      <p>
        <strong>Troubleshooting:</strong>
      </p>

      <ul>
        <li>Open browser DevTools (F12) and check the Console tab</li>
        <li>Verify Supabase tables exist</li>
        <li>Check Supabase RLS policies</li>
        <li>Ensure Supabase credentials are correct</li>
      </ul>
    </div>
  {:else}
    <p>Favorites: {favorites.size}</p>

    <div class="filters">
      <label>
        <span>Search</span>
        <input bind:value={searchTerm} type="search" placeholder="Search recipes" />
      </label>

      <label>
        <span>Category</span>
        <select bind:value={selectedCategory} on:change={() => (selectedSubcategory = "all")}>
          {#each categoryList as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </label>

      <label>
        <span>Subcategory</span>
        <select bind:value={selectedSubcategory} disabled={subcategoryDisabled}>
          {#each filteredSubcategories as subcategory}
            <option value={subcategory.id}>{subcategory.name}</option>
          {/each}
        </select>
      </label>
    </div>

    <recipe-list
      bind:this={recipeListEl}
      on:open={handleOpen}
      on:favorite={handleFavorite}
      on:edit={handleEdit}
      on:delete={handleDelete}
    ></recipe-list>

    <div class="panel">
      <recipe-detail bind:this={recipeDetailEl}></recipe-detail>
    </div>
  {/if}
</section>

<style>
  .page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 32px 20px 80px;
    font-family: Arial, sans-serif;
    color: #1f2937;
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin: 1rem 0 1.5rem;
    padding: 1rem;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
  }

  .filters label {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    font-weight: 600;
    color: #374151;
  }

  .filters input,
  .filters select {
    width: 100%;
    padding: 0.7rem 0.8rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 0.95rem;
    background: #fff;
  }

  .filters select:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .loading {
    padding: 20px;
    text-align: center;
    color: #6b7280;
  }

  .error-box {
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    color: #991b1b;
  }

  .error-box p {
    margin: 8px 0;
  }

  .error-box ul {
    margin: 8px 0 8px 20px;
    padding: 0;
  }

  .error-box li {
    margin: 4px 0;
  }
</style>
'@
Set-Content -Path (Join-Path $root 'sveltekit-consumer/src/routes/+page.svelte') -Encoding utf8 -Value $contentMain

Write-Host 'done'
