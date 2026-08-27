import { Component, Prop, h, Watch } from '@stencil/core';

@Component({
  tag: 'recipe-list',
  styleUrl: 'recipe-list.css',
  shadow: true
})
export class RecipeList {
  @Prop() recipes: any[] = [];
  @Prop() layout: 'grid' | 'list' = 'grid';

  render() {
    const clsName = this.layout === 'grid' ? 'list grid' : 'list';
    console.log(this.recipes, 'recipes in recipe-list');
    return (
      <section class={clsName}>
        {this.recipes.map(r => (
          <recipe-card recipe={r}></recipe-card>
        ))}
      </section>
    );
  }
}
