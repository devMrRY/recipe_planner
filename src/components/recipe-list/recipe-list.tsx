import { Component, Prop, h, Watch } from '@stencil/core';

@Component({
  tag: 'recipe-list',
  styleUrl: 'recipe-list.css',
  shadow: true
})
export class RecipeList {
  @Prop() recipes: any[] = [];
  @Prop() layout: 'grid' | 'list' = 'grid';
  @Prop() favoriteIds: string[] = [];

  render() {
    const clsName = this.layout === 'grid' ? 'list grid' : 'list';
    const favoriteSet = new Set(this.favoriteIds);

    console.log(this.recipes, 'recipes in recipe-list');
    return (
      <section class={clsName}>
        {this.recipes.map(r => (
          <recipe-card recipe={r} is-favorite={favoriteSet.has(r.id)}></recipe-card>
        ))}
      </section>
    );
  }
}
