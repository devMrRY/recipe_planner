import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'meal-planner',
  styleUrl: 'meal-planner.css',
  shadow: true
})
export class MealPlanner {
  @Prop() plan: any = {};
  @Event({ bubbles: true, composed: true }) planChange: EventEmitter<any>;

  private onAssign(day, recipeId) {
    const next = { ...(this.plan || {}) };
    next[day] = recipeId;
    this.planChange.emit(next);
  }

  render() {
    const days = ['mon','tue','wed','thu','fri','sat','sun'];
    return (
      <div class="planner">
        {days.map(d => (
          <div class="day">
            <div class="name">{d.toUpperCase()}</div>
            <div class="slot">{this.plan?.[d] || '—'}</div>
            <button onClick={() => this.onAssign(d, 'example-recipe')}>Assign</button>
          </div>
        ))}
      </div>
    );
  }
}
