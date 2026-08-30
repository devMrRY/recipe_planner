import {
  Component,
  Prop,
  Event,
  EventEmitter,
  State,
  Watch,
  h,
} from "@stencil/core";

type CategoryOption = {
  id: string;
  name: string;
  parent_id: string | null;
};

type IngredientRow = {
  id: string;
  name: string;
  quantity: string;
};

@Component({
  tag: "recipe-form",
  styleUrl: "recipe-form.css",
  shadow: true,
})
export class RecipeForm {
  @Prop() recipe: any = {};
  @Prop() categories: CategoryOption[] = [];
  @Event({ bubbles: true, composed: true }) save: EventEmitter<any>;

  @State() local: any = {};
  @State() ingredientRows: IngredientRow[] = [];
  @State() categoryOptions: CategoryOption[] = [];
  @State() showError: boolean = false;

  @Watch("recipe")
  recipeChanged(newRecipe: any) {
    this.local = Object.assign({}, newRecipe || {});
    this.ingredientRows = this.normalizeIngredientRows(this.local.ingredients);
  }

  @Watch("categories")
  categoriesChanged(newCategories: CategoryOption[]) {
    this.categoryOptions = Array.isArray(newCategories) ? newCategories : [];
  }

  componentWillLoad() {
    this.categoryOptions = Array.isArray(this.categories)
      ? this.categories
      : [];
    this.local = Object.assign({}, this.recipe || {});
    this.ingredientRows = this.normalizeIngredientRows(this.local.ingredients);
  }

  private createIngredientRow = (): IngredientRow => ({
    id: `ingredient-${Math.random().toString(36).slice(2, 9)}`,
    name: "",
    quantity: "",
  });

  private normalizeIngredientRows = (rawIngredients: any): IngredientRow[] => {
    const values = Array.isArray(rawIngredients)
      ? rawIngredients
      : typeof rawIngredients === "string"
        ? rawIngredients.split("\n")
        : [];

    const rows = values
      .map((item: any) => {
        const text = String(item ?? "").trim();
        if (!text) return null;

        const match = text.match(/^(.+?)\s*(?:[:-]\s*|\s{2,})(.+)$/);
        if (match) {
          return {
            id: `ingredient-${Math.random().toString(36).slice(2, 9)}`,
            name: match[1].trim(),
            quantity: match[2].trim(),
          };
        }

        return {
          id: `ingredient-${Math.random().toString(36).slice(2, 9)}`,
          name: text,
          quantity: "",
        };
      })
      .filter((row) => row && (row.name || row.quantity)) as IngredientRow[];

    while (rows.length < 3) {
      rows.push(this.createIngredientRow());
    }

    return rows;
  };

  private syncIngredientRows = () => {
    const payload = this.ingredientRows
      .map((row) => {
        const name = String(row.name || "").trim();
        const quantity = String(row.quantity || "").trim();

        if (!name && !quantity) return "";
        if (!name) return quantity;
        if (!quantity) return name;

        return `${name} - ${quantity}`;
      })
      .filter(Boolean);

    this.local = {
      ...this.local,
      ingredients: payload,
    };
  };

  private updateIngredientRow = (
    id: string,
    field: "name" | "quantity",
    value: string,
  ) => {
    this.ingredientRows = this.ingredientRows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row,
    );
    this.syncIngredientRows();
  };

  private addIngredientRow = () => {
    this.ingredientRows = [...this.ingredientRows, this.createIngredientRow()];
    this.syncIngredientRows();
  };

  private removeIngredientRow = (id: string) => {
    if (this.ingredientRows.length <= 1) return;

    this.ingredientRows = this.ingredientRows.filter((row) => row.id !== id);
    this.syncIngredientRows();
  };

  private getParentCategories = () =>
    this.categoryOptions.filter((item) => !item.parent_id);

  private getSubcategoryOptions = (categoryId: string) => {
    const selectedCategory = this.categoryOptions.find(
      (item) => item.id === categoryId,
    );
    if (!selectedCategory) return [];

    return this.categoryOptions.filter(
      (item) => item.parent_id === selectedCategory.id,
    );
  };

  private get isValid() {
    const isValidIngredients = this.ingredientRows.some(
      (row) => row.name && row.quantity,
    );
    return (
      !this.local.title ||
      !this.local.category_id ||
      !this.local.ingredients ||
      !this.local.steps ||
      this.local.steps.length === 0 ||
      !this.local.description ||
      !isValidIngredients
    );
  }

  private onSubmit = (e: Event) => {
    e.preventDefault();
    if (this.isValid) {
      this.showError = true;
      return;
    }

    this.syncIngredientRows();

    const payload = {
      ...this.local,
      ingredients: Array.isArray(this.local.ingredients)
        ? this.local.ingredients
        : (this.local.ingredients || "")
            .split("\n")
            .map((item: string) => item.trim())
            .filter(Boolean),
      steps: Array.isArray(this.local.steps)
        ? this.local.steps
        : (this.local.steps || "")
            .split("\n")
            .map((item: string) => item.trim())
            .filter(Boolean),
      category_id: this.local.category_id,
      subcategory_id: this.local.subcategory_id ?? null,
      image: this.local.image || "",
    };
    this.save.emit(payload);
  };

  private updateField = (e: any) => {
    const t = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    const nextValue = t.value;
    const nextLocal = {
      ...this.local,
      [t.name]: nextValue,
    };

    if (t.name === "category_id") {
      const validSubcategories = this.getSubcategoryOptions(nextValue).map(
        (item) => item.id,
      );
      if (!validSubcategories.includes(this.local.subcategory_id)) {
        nextLocal.subcategory_id = "";
      }
    }

    this.local = nextLocal;
  };

  render() {
    const parentCategories = this.getParentCategories();
    const subcategoryOptions = this.getSubcategoryOptions(
      this.local.category_id,
    );

    return (
      <form onSubmit={this.onSubmit} class="form">
        <label>
          Title*
          <input
            name="title"
            value={this.local.title || ""}
            onInput={this.updateField}
            class={this.showError && !this.local.title ? "error-field" : ""}
          />
          {this.showError && !this.local.title && (
            <span class="error-message">
              Title is required. Please enter a title.
            </span>
          )}
        </label>

        <div class="ingredient-row">
          <label>
            Category*
            <select
              name="category_id"
              onChange={this.updateField}
              class={
                this.showError && !this.local.category_id ? "error-field" : ""
              }
            >
              <option value="">Select category</option>
              {parentCategories.map((option) => (
                <option
                  value={option.id}
                  selected={option.id === this.local.category_id}
                >
                  {option.name}
                </option>
              ))}
            </select>
            {this.showError && !this.local.category_id && (
              <span class="error-message">
                Category is required. Please select a category.
              </span>
            )}
          </label>

          <label>
            Subcategory
            <select
              name="subcategory_id"
              onChange={this.updateField}
              disabled={!this.local.category_id}
              class={
                this.showError && !this.local.category_id
                  ? "pseudo-error-field"
                  : ""
              }
            >
              <option value="">Select subcategory</option>
              {subcategoryOptions.map((option) => (
                <option
                  value={option.id}
                  selected={option.id === this.local.subcategory_id}
                >
                  {option.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Image URL
          <input
            name="image"
            value={this.local.image || ""}
            onInput={this.updateField}
          />
        </label>

        <label>
          Description*
          <textarea
            name="description"
            onInput={this.updateField}
            class={
              this.showError && !this.local.description ? "error-field" : ""
            }
          >
            {this.local.description || ""}
          </textarea>
          {this.showError && !this.local.description && (
            <span class="error-message">
              Description is required. Please enter a description.
            </span>
          )}
        </label>

        <div class="ingredient-block">
          <div class="ingredient-header">
            <span>Ingredients*</span>
            <button
              type="button"
              class="inline-button"
              onClick={this.addIngredientRow}
            >
              Add item
            </button>
          </div>

          {this.ingredientRows.map((row, index) => (
            <div class="ingredient-row" key={index}>
              <div class="field-group">
                <input
                  placeholder="Name"
                  name={`ingredient-name-${index}`}
                  value={row.name}
                  class={`${this.showError && !this.ingredientRows.some((r) => r.name && r.quantity) ? "error-field" : ""}`}
                  onInput={(event) =>
                    this.updateIngredientRow(
                      row.id,
                      "name",
                      (event.target as HTMLInputElement).value,
                    )
                  }
                />
              </div>

              <div class="field-group">
                <input
                  placeholder="Quantity"
                  value={row.quantity}
                  name={`ingredient-quantity-${index}`}
                  class={`${this.showError && !this.ingredientRows.some((r) => r.name && r.quantity) ? "error-field" : ""}`}
                  onInput={(event) =>
                    this.updateIngredientRow(
                      row.id,
                      "quantity",
                      (event.target as HTMLInputElement).value,
                    )
                  }
                />
              </div>

              <button
                type="button"
                class="remove-button"
                onClick={() => this.removeIngredientRow(row.id)}
                disabled={this.ingredientRows.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
          {this.showError &&
            !this.ingredientRows.some((row) => row.name && row.quantity) && (
              <span class="error-message">
                At least one ingredient is required. Please add ingredients.
              </span>
            )}
        </div>

        <label>
          Steps* (one per line)
          <textarea
            name="steps"
            onInput={this.updateField}
            class={this.showError && !this.local.steps ? "error-field" : ""}
          >
            {Array.isArray(this.local.steps)
              ? this.local.steps.join("\n")
              : this.local.steps || ""}
          </textarea>
          {this.showError && !this.local.steps && (
            <span class="error-message">
              At least one step is required. Please add steps.
            </span>
          )}
        </label>

        <div class="actions">
          <button type="submit">
            {this.local && this.local.id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    );
  }
}
