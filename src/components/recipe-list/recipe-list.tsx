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
    console.log("this.recipes -----------", this.recipes)
    const clsName = this.layout === 'grid' ? 'list grid' : 'list';
    return (
      <section class={clsName}>
        {this.recipes.map(r => (
          <recipe-card recipe={r}></recipe-card>
        ))}
      </section>
    );
  }
}
