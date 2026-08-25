import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'recipe-detail',
  styleUrl: 'recipe-detail.css',
  shadow: true
})
export class RecipeDetail {
  @Prop() recipe: any;

  @Event({ bubbles: true, composed: true }) edit: EventEmitter<string>;
  @Event({ bubbles: true, composed: true }) remove: EventEmitter<string>;

  private onEdit = () => this.edit.emit(this.recipe?.id);
  private onRemove = () => this.remove.emit(this.recipe?.id);

  render() {
    if (!this.recipe) return <div>No recipe selected</div>;
    const canEdit = this.recipe.createdBy === 'user';
    return (
      <article class="detail">
        <h2>{this.recipe.title}</h2>
        <div class="meta">{this.recipe.description}</div>
        <section class="ingredients">
          <h3>Ingredients</h3>
          <ul>{(this.recipe.ingredients || []).map(i => <li>{i}</li>)}</ul>
        </section>
        <section class="instructions">
          <h3>Steps</h3>
          <ol>{(this.recipe.steps || []).map(step => <li>{step}</li>)}</ol>
        </section>
        {canEdit && (
          <div class="actions">
            <button onClick={this.onEdit}>Edit</button>
            <button onClick={this.onRemove}>Delete</button>
          </div>
        )}
      </article>
    );
  }
}
