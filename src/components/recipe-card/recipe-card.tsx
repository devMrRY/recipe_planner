import { Component, Prop, Event, EventEmitter, h, Fragment } from '@stencil/core';

@Component({
  tag: 'recipe-card',
  styleUrl: 'recipe-card.css',
  shadow: true
})
export class RecipeCard {
  @Prop() recipe: any;
  @Prop() compact: boolean = false;
  @Prop() isFavorite: boolean = false;
  @Prop() hideActions: boolean = false;

  @Event({ bubbles: true, composed: true }) favorite: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) open: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) edit: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) delete: EventEmitter<string>;

  private capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private getCategoryName = (category: { name?: string; id?: string } | null) => {
    if (!category) return '';
    return this.capitalize(category.name?.toString() || '');
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
    const isOwner = this.recipe?.isOwner || false;

    const categoryLabel = this.getCategoryName(this.recipe?.category);
    const subcategoryLabel = this.recipe?.subcategory ? this.getCategoryName(this.recipe.subcategory) : null;
    const favoriteClass = this.isFavorite ? 'icon-button favorite active' : 'icon-button favorite';

    return (
      <article class="card" onClick={this.onOpen}>
        {img ? <img src={img} alt={title} /> : <div class="image-placeholder">Recipe</div>}
        <div class="actions">
          <button type="button" class={favoriteClass} aria-label="Favorite recipe" aria-pressed={this.isFavorite ? 'true' : 'false'} onClick={this.onFavorite}>♥</button>
          {!this.hideActions && isOwner && (
            <>
              <button type="button" class="icon-button edit" aria-label="Edit recipe" onClick={this.onEdit}>✎</button>
              <button type="button" class="icon-button delete" aria-label="Delete recipe" onClick={this.onDelete}>🗑</button>
            </>
          )}
        </div>
        <div class="content">
          <h3>{this.capitalize(title)}</h3>
          <div class="meta-row">
            <span class="chip">{categoryLabel}</span>
            {subcategoryLabel ? <span class="chip subtle">{subcategoryLabel}</span> : null}
          </div>
        </div>
      </article>
    );
  }
}
