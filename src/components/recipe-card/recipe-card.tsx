import {
  Component,
  Prop,
  Event,
  EventEmitter,
  h,
  getAssetPath,
} from "@stencil/core";

@Component({
  tag: "recipe-card",
  styleUrl: "recipe-card.css",
  shadow: true,
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

  private getCategoryName = (
    category: { name?: string; id?: string } | null,
  ) => {
    if (!category) return "";
    return this.capitalize(category.name?.toString() || "");
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

    if (typeof window !== "undefined") {
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
    const title = this.recipe?.title || "Untitled";
    const img = this.recipe?.image || "";
    const isOwner = this.recipe?.isOwner || false;

    const categoryLabel = this.getCategoryName(this.recipe?.category);
    const subcategoryLabel = this.recipe?.subcategory
      ? this.getCategoryName(this.recipe.subcategory)
      : null;
    const favoriteClass = this.isFavorite
      ? "icon-button favorite active"
      : "icon-button favorite";

    return (
      <article class="card" onClick={this.onOpen}>
        {img ? (
          <img
            src={img}
            alt={title}
            onError={(event) => {
              const img = event.target as HTMLImageElement;
              img.src = getAssetPath("assets/recipe-placeholder.png");
            }}
          />
        ) : (
          <img
            class="recipe-image"
            src={getAssetPath("assets/recipe-placeholder.png")}
            alt="No image available"
          />
        )}
        <div class="actions">
          <button
            type="button"
            class={favoriteClass}
            aria-label="Favorite recipe"
            aria-pressed={this.isFavorite ? "true" : "false"}
            onClick={this.onFavorite}
          >
            ♥
          </button>
          {!this.hideActions && isOwner && (
            <div class="owner-actions">
              <button
                type="button"
                class="icon-button edit"
                aria-label="Edit recipe"
                onClick={this.onEdit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 20l4.5-1L19 8.5a2.12 2.12 0 0 0-3-3L5.5 16 4 20z" />
                  <path d="M14.5 6.5l3 3" />
                </svg>
              </button>
              <button
                type="button"
                class="icon-button delete"
                aria-label="Delete recipe"
                onClick={this.onDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v5" />
                  <path d="M14 11v5" />
                </svg>
              </button>
            </div>
          )}
        </div>
        <div class="content">
          <h3>{this.capitalize(title)}</h3>
          <div class="meta-row">
            <span class="chip">{categoryLabel}</span>
            {subcategoryLabel ? (
              <span class="chip subtle">{subcategoryLabel}</span>
            ) : null}
          </div>
        </div>
      </article>
    );
  }
}
