import { Component, Prop, Event, EventEmitter, h } from "@stencil/core";

export type MealType = "breakfast" | "lunch" | "dinner";

export interface MealPlanItem {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  recipeId: string;
  recipeName: string;
  category: string;
  imageUrl?: string;
}

@Component({
  tag: "meal-planner",
  styleUrl: "meal-planner.css",
  shadow: true,
})
export class MealPlanner {
  /**
   * Any date within the week.
   *
   * The component automatically calculates Monday.
   */
  @Prop() weekStartDate!: string;

  /**
   * Planned meals.
   *
   * One recipe per date + mealType.
   */
  @Prop() mealPlans: MealPlanItem[] = [];

  @Event()
  addRecipe!: EventEmitter<{
    date: string;
    mealType: MealType;
  }>;

  @Event()
  editRecipe!: EventEmitter<MealPlanItem>;

  @Event()
  deleteRecipe!: EventEmitter<MealPlanItem>;

  @Event()
  clearDay!: EventEmitter<string>;

  @Event()
  clearWeek!: EventEmitter<void>;

  @Event()
  previousWeek!: EventEmitter<string>;

  @Event()
  nextWeek!: EventEmitter<string>;

  @Event()
  todayClicked!: EventEmitter<string>;

  private readonly mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  // --------------------------------------------------
  // Date helpers
  // --------------------------------------------------

  private parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  /**
   * Returns Monday for the supplied date.
   */
  private getMonday(date: Date): Date {
    const result = new Date(date);

    const day = result.getDay();

    // Sunday = 0
    // Monday = 1
    const daysFromMonday = day === 0 ? 6 : day - 1;

    result.setDate(result.getDate() - daysFromMonday);

    return result;
  }

  /**
   * Always returns Monday -> Sunday.
   */
  private getWeekDates(): Date[] {
    const selectedDate = this.parseDate(this.weekStartDate);

    const monday = this.getMonday(selectedDate);

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);

      date.setDate(monday.getDate() + index);

      return date;
    });
  }

  // --------------------------------------------------
  // Formatting
  // --------------------------------------------------

  private getDayName(date: Date): string {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  private getShortMonth(date: Date): string {
    return date.toLocaleDateString("en-US", {
      month: "short",
    });
  }

  // --------------------------------------------------
  // Meal helpers
  // --------------------------------------------------

  private getMeal(date: Date, mealType: MealType): MealPlanItem | undefined {
    const dateString = this.formatDate(date);
    return this.mealPlans.find(
      (meal) => meal.date === dateString && meal.mealType === mealType,
    );
  }

  private getDayMealCount(date: Date): number {
    const dateString = this.formatDate(date);

    return this.mealPlans.filter((meal) => meal.date === dateString).length;
  }

  private getTotalPlanned(): number {
    return this.mealPlans.length;
  }

  // --------------------------------------------------
  // Today
  // --------------------------------------------------

  private isToday(date: Date): boolean {
    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  // --------------------------------------------------
  // Events
  // --------------------------------------------------

  private handleAddRecipe(date: Date, mealType: MealType) {
    this.addRecipe.emit({
      date: this.formatDate(date),
      mealType,
    });
  }

  private handleEditRecipe(meal: MealPlanItem) {
    this.editRecipe.emit(meal);
  }

  private handleDeleteRecipe(meal: MealPlanItem) {
    this.deleteRecipe.emit(meal);
  }

  private handleClearDay(date: Date) {
    this.clearDay.emit(this.formatDate(date));
  }

  private handleClearWeek = () => {
    if (this.getTotalPlanned() === 0) return;
    this.clearWeek.emit();
  }

  // --------------------------------------------------
  // Icons
  // --------------------------------------------------

  private renderEditIcon() {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  }

  private renderDeleteIcon() {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  }

  private renderPlusIcon() {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 5v14M5 12h14"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    );
  }

  // --------------------------------------------------
  // Recipe card
  // --------------------------------------------------

  private renderRecipe(meal: MealPlanItem) {
    return (
      <div class="recipe-card">
        <div class="recipe-main">
          {meal.imageUrl ? (
            <img
              class="recipe-image"
              src={meal.imageUrl}
              alt={meal.recipeName}
            />
          ) : (
            <div class="recipe-image recipe-placeholder">
              {meal.recipeName.charAt(0).toUpperCase()}
            </div>
          )}

          <div class="recipe-info">
            <div class="recipe-name">{meal.recipeName}</div>

            <div class="recipe-category">{meal.category}</div>
          </div>
        </div>

        <div class="recipe-actions">
          <button
            type="button"
            class="action-button"
            aria-label={`Edit ${meal.recipeName}`}
            onClick={() => this.handleEditRecipe(meal)}
          >
            {this.renderEditIcon()}
          </button>

          <button
            type="button"
            class="action-button delete"
            aria-label={`Delete ${meal.recipeName}`}
            onClick={() => this.handleDeleteRecipe(meal)}
          >
            {this.renderDeleteIcon()}
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Empty meal
  // --------------------------------------------------

  private renderEmptyMeal(date: Date, mealType: MealType) {
    return (
      <button
        type="button"
        class="add-recipe"
        onClick={() => this.handleAddRecipe(date, mealType)}
      >
        {this.renderPlusIcon()}
        <span>Add recipe</span>
      </button>
    );
  }

  // --------------------------------------------------
  // Meal slot
  // --------------------------------------------------

  private renderMealSlot(date: Date, mealType: MealType) {
    const meal = this.getMeal(date, mealType);
    return (
      <div class="meal-slot">
        <div class="meal-label">{mealType}</div>

        {meal ? this.renderRecipe(meal) : this.renderEmptyMeal(date, mealType)}
      </div>
    );
  }

  // --------------------------------------------------
  // Day card
  // --------------------------------------------------

  private renderDayCard(date: Date) {
    const planned = this.getDayMealCount(date);
    const today = this.isToday(date);

    return (
      <article
        class={{
          "day-card": true,
          today: today,
        }}
      >
        <header class="day-header">
          <div class="day-heading">
            <h2>{this.getDayName(date)}</h2>

            <span class="date">
              {date.getDate()} {this.getShortMonth(date)}
            </span>
          </div>

          <div class="day-status">
            <span class="meal-count">{planned}/3</span>

            {today && <span class="today-badge">TODAY</span>}
          </div>
        </header>

        {/* Meals */}

        <div class="day-body">
          {this.mealTypes.map((mealType) =>
            this.renderMealSlot(date, mealType),
          )}
        </div>

        {/* Clear day */}

        {planned > 0 && (
          <div class="day-footer">
            <button
              type="button"
              class="clear-day"
              onClick={() => this.handleClearDay(date)}
            >
              Clear {this.getDayName(date)}
            </button>
          </div>
        )}
      </article>
    );
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  render() {
    const dates = this.getWeekDates();
    const totalPlanned = this.getTotalPlanned();

    return (
      <section class="planner">
        <header class="planner-header">
          <div class="planner-heading">
            <h1>Weekly Meal Planner</h1>

            <p>Plan your breakfast, lunch and dinner from Monday to Sunday.</p>

            <div class="progress">{totalPlanned} of 21 meals planned</div>
          </div>

          <button
            type="button"
            class="clear-week"
            onClick={this.handleClearWeek}
            disabled={totalPlanned === 0}
          >
            Clear week
          </button>
        </header>
        <div class="days-grid">
          {dates.map((date) => this.renderDayCard(date))}
        </div>
      </section>
    );
  }
}
