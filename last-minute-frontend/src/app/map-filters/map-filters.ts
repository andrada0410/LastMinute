import { Component, inject, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Category } from "../category";
import { MapFilters } from "../filter";
import { debounceTime, Subject } from "rxjs";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-map-filters",
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="filters-overlay card">
      <h3>Filtre</h3>

      @if (authService.isLoggedIn()){
      <div class="filter-section">
        <div class="toggle-container">
          <span class="section-label">Favorite:</span>
          <label class="switch-button">
            <input
              type="checkbox"
              [checked]="onlyFavorites"
              (change)="toggleFavorites($event)"
            />
            <span class="switch-slider">
              <span class="switch-label-yes">Da</span>
              <span class="switch-label-no">Nu</span>
            </span>
          </label>
        </div>
      </div>

      }


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

      <div class="filter-section">
        <label class="section-label">
          Preț maxim:
          <input
            type="number"
            class="price-input"
            min="0"
            [max]="priceUpperBound()"
            step="0.01"
            [value]="maxPrice ?? priceUpperBound()"
            (input)="onManualPriceInput($event)"
          />

          <span class="price-unit">RON</span>
        </label>
        <input
          type="range"
          min="0"
          [max]="priceUpperBound()"
          step="0.01"
          [value]="maxPrice ?? priceUpperBound()"
          (input)="onSliderInput($event)"
        />

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
  authService = inject(AuthService);

  categories = input<Category[]>([]);
  filtersChange = output<MapFilters>();

  priceUpperBound = input<number>(0);

  selectedCategoryIds: number[] = [];
  maxPrice: number | null = null;
  onlyFavorites: boolean = false;

  private priceSubject = new Subject<void>();

  constructor() {
    this.priceSubject
      .pipe(debounceTime(300))
      .subscribe(() => this.emitFilters());
  }

  get hasActiveFilters(): boolean {
    return this.selectedCategoryIds.length > 0 || this.maxPrice !== null || this.onlyFavorites; 
  }

  toggleFavorites(event: Event): void {
    this.onlyFavorites = (event.target as HTMLInputElement).checked;
    this.emitFilters();
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

  onSliderInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.maxPrice = value >= this.priceUpperBound() ? null : value;

    this.emitFilters();
  }

  onManualPriceInput(event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;

    if (rawValue === "") {
      this.maxPrice = null;
      this.priceSubject.next();
      return;
    }

    const value = Number(rawValue);

    if (isNaN(value)) {
      return;
    }

    const clamped = Math.max(0, value);

    this.maxPrice = clamped >= this.priceUpperBound() ? null : Math.round(clamped * 100) / 100

    this.priceSubject.next();
  }

  private emitFilters(): void {
    this.filtersChange.emit({
      categoryIds: [...this.selectedCategoryIds],
      maxPrice: this.maxPrice ?? undefined,
      onlyFavorites: this.onlyFavorites ? true : undefined
    });
  }

  resetFilters(): void {
    this.selectedCategoryIds = [];
    this.maxPrice = null;
    this.onlyFavorites = false;

    this.emitFilters();
  }

  ngOnDestroy(): void {
    this.priceSubject.complete();
  }
}
