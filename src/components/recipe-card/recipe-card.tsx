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

  private onFavorite = () => {
    this.favorite.emit(this.recipe?.id);
  };

  private onOpen = () => {
    this.open.emit(this.recipe?.id);
  };

  render() {
    const title = this.recipe?.title || 'Untitled';
    const img = this.recipe?.image || '';
    return (
      <article class="card">
        {img ? <img src={img} alt={title} /> : null}
        <div class="content">
          <h3>{title}</h3>
          <p>{this.recipe?.summary}</p>
          <div class="actions">
            <slot name="actions">
              <button onClick={this.onOpen}>View</button>
              <button onClick={this.onFavorite}>❤</button>
            </slot>
          </div>
        </div>
      </article>
    );
  }
}
