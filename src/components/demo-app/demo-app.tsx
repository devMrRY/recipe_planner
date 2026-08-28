import { Component, h } from '@stencil/core';

const SAMPLE_RECIPES = [
  {
    id: 'pasta',
    title: 'Garlic Pasta',
    summary: 'Quick creamy garlic pasta ready in 15 minutes.',
    image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80',
    description: 'A fast weeknight favorite with parmesan, garlic, and herbs.',
    ingredients: ['200g pasta', '3 cloves garlic', '2 tbsp butter', 'Parmesan', 'Parsley'],
    instructions: 'Boil pasta. Sauté garlic in butter. Toss with pasta and parmesan. Garnish with parsley.'
  },
  {
    id: 'salad',
    title: 'Mediterranean Salad',
    summary: 'Fresh salad with feta, cucumber, and tomatoes.',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=800&q=80',
    description: 'A crisp, colorful dish that works as lunch or side.',
    ingredients: ['Cucumber', 'Tomatoes', 'Feta', 'Olives', 'Lemon dressing'],
    instructions: 'Slice vegetables, toss with dressing, and top with feta and olives.'
  },
  {
    id: 'bowl',
    title: 'Power Breakfast Bowl',
    summary: 'Protein-rich breakfast bowl with fruit and yogurt.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    description: 'A balanced meal with grains, yogurt, fruit, and nuts.',
    ingredients: ['Greek yogurt', 'Granola', 'Berries', 'Chia seeds', 'Banana'],
    instructions: 'Layer yogurt, granola, berries, and chia. Top with banana slices.'
  }
];

@Component({
  tag: 'recipe-demo',
  styleUrl: 'demo-app.css',
  shadow: true
})
export class RecipeDemo {
  render() {
    return (
      <div class="app-shell">
        <header>
          <h1>Recipe Planner</h1>
          <p>Browse recipes, manage favorites, and plan your week.</p>
        </header>

        <section class="toolbar">
          <input placeholder="Search recipes" />
          <button>Filter</button>
        </section>

        <recipe-list recipes={SAMPLE_RECIPES} layout="grid" />

        <div class="detail-panel">
          <recipe-detail recipe={SAMPLE_RECIPES[0]} />
        </div>

        <div class="planner-panel">
          <h2>Weekly Meal Plan</h2>
          <meal-planner weekStartDate="2026-04-06" />
        </div>
      </div>
    );
  }
}
