import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Category } from "../category";
import { MapFilters } from "../filter";

@Component({
  selector: "app-map-filters",
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="filters-overlay card">
      <h3>Filtre</h3>

      <div class="filter-section">
        <label class="section-label">Categorii</label>
        <div class="categories-list">
          @for (category of categories(); track category.id) {
            <label class="checkbox-label">
              <input
                type="checkbox"
                [value]="category.id"
                [checked]="selectedCategoryIds.includes(category.id)"
                (change)="toggleCategory(category.id, $event)"
              />
              {{ category.name }}
            </label>
          }
        </div>
      </div>

      @if (hasActiveFilters) {
        <button class="button primary small" (click)="resetFilters()">
          Resetează filtrele
        </button>
      }
    </div>
  `,
  styleUrls: ["./map-filters.css"],
})
export class MapFiltersComponent {
  categories = input<Category[]>([]);
  filtersChange = output<MapFilters>();

  selectedCategoryIds: number[] = [];

  get hasActiveFilters(): boolean {
    return this.selectedCategoryIds.length > 0;
  }

  toggleCategory(id: number, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedCategoryIds.push(id);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(
        (catId) => catId !== id,
      );
    }

    this.emitFilters();
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      categoryIds: [...this.selectedCategoryIds]
    });
  }

  resetFilters(): void {
    this.selectedCategoryIds = [];

    this.emitFilters();
  }
}
