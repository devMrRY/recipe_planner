import { Component, Prop, Event, EventEmitter, State, Watch, h } from '@stencil/core';

@Component({
  tag: 'recipe-form',
  styleUrl: 'recipe-form.css',
  shadow: true
})
export class RecipeForm {
  @Prop() recipe: any = {};
  @Event({ bubbles: true, composed: true }) save: EventEmitter<any>;

  @State() local: any = {};

  @Watch('recipe')
  recipeChanged(newRecipe: any) {
    this.local = Object.assign({}, newRecipe || {});
  }

  componentWillLoad() {
    this.local = Object.assign({}, this.recipe || {});
  }

  private onSubmit = (e: Event) => {
    e.preventDefault();
    if (!this.local.title) {
      alert('Title is required');
      return;
    }

    const payload = {
      ...this.local,
      ingredients: Array.isArray(this.local.ingredients)
        ? this.local.ingredients
        : (this.local.ingredients || '').split('\n').map((item: string) => item.trim()).filter(Boolean),
      steps: Array.isArray(this.local.steps)
        ? this.local.steps
        : (this.local.steps || '').split('\n').map((item: string) => item.trim()).filter(Boolean),
      category: this.local.category || 'general',
      subcategory: this.local.subcategory || 'general',
      image: this.local.image || 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80'
    };

    this.save.emit(payload);
  };

  private updateField = (e) => {
    const t = e.target as HTMLInputElement | HTMLTextAreaElement;
    const value = t.name === 'ingredients' || t.name === 'steps'
      ? t.value
      : t.value;

    this.local = {
      ...this.local,
      [t.name]: value
    };
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} class="form">
        <label>Title
          <input name="title" value={this.local.title || ''} onInput={this.updateField} required />
        </label>

        <label>Summary
          <input name="summary" value={this.local.summary || ''} onInput={this.updateField} />
        </label>

        <label>Category
          <input name="category" value={this.local.category || ''} onInput={this.updateField} />
        </label>

        <label>Subcategory
          <input name="subcategory" value={this.local.subcategory || ''} onInput={this.updateField} />
        </label>

        <label>Image URL
          <input name="image" value={this.local.image || ''} onInput={this.updateField} />
        </label>

        <label>Description
          <textarea name="description" onInput={this.updateField}>{this.local.description || ''}</textarea>
        </label>

        <label>Ingredients (one per line)
          <textarea name="ingredients" onInput={this.updateField}>{Array.isArray(this.local.ingredients) ? this.local.ingredients.join('\n') : (this.local.ingredients || '')}</textarea>
        </label>

        <label>Steps (one per line)
          <textarea name="steps" onInput={this.updateField}>{Array.isArray(this.local.steps) ? this.local.steps.join('\n') : (this.local.steps || '')}</textarea>
        </label>

        <div class="actions">
          <button type="submit">Save</button>
        </div>
      </form>
    );
  }
}

