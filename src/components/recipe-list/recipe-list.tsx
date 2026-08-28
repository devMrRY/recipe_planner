import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'recipe-list',
  styleUrl: 'recipe-list.css',
  shadow: true
})
export class RecipeList {
  @Prop() recipes: any[] = [];
  @Prop() layout: 'grid' | 'list' = 'grid';
  @Prop() favoriteIds: string[] = [];
  @Prop() hideActions: boolean = false;

  render() {
    const clsName = this.layout === 'grid' ? 'list grid' : 'list';
    const favoriteSet = new Set(this.favoriteIds);
    return (
      <section class={clsName}>
        {this.recipes.map(r => (
          <recipe-card recipe={r} hide-actions={this.hideActions} is-favorite={favoriteSet.has(r.id)}></recipe-card>
        ))}
      </section>
    );
  }
}
