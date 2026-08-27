import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true
})
export class RecipeCard {
  @Prop() recipe: any;
  @Prop() compact: boolean = false;
  @Prop() isFavorite: boolean = false;

  @Event({ bubbles: true, composed: true }) favorite: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) open: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) edit: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) delete: EventEmitter<string>;

  private getCategoryName = (category: { name?: string; id?: string } | null) => {
    if (!category) return '';
    return category.name ?? '';
  };

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
    const categoryLabel = this.getCategoryName(this.recipe?.category);
    const subcategoryLabel = this.recipe?.subcategory ? this.getCategoryName(this.recipe.subcategory) : null;
    const favoriteClass = this.isFavorite ? 'icon-button favorite active' : 'icon-button favorite';

    return (
      <article class="card" onClick={this.onOpen}>
        {img ? <img src={img} alt={title} /> : <div class="image-placeholder">Recipe</div>}
        <div class="content">
          <div class="meta-row">
            <span class="chip">{categoryLabel}</span>
            {subcategoryLabel ? <span class="chip subtle">{subcategoryLabel}</span> : null}
          </div>
          <h3>{title}</h3>
          <div class="actions">
            <button type="button" class="icon-button edit" aria-label="Edit recipe" onClick={this.onEdit}>✎</button>
            <button type="button" class={favoriteClass} aria-label="Favorite recipe" aria-pressed={this.isFavorite ? 'true' : 'false'} onClick={this.onFavorite}>♥</button>
            <button type="button" class="icon-button view" aria-label="View recipe" onClick={this.onOpen}>◉</button>
            <button type="button" class="icon-button delete" aria-label="Delete recipe" onClick={this.onDelete}>🗑</button>
          </div>
        </div>
      </article>
    );
  }
}
