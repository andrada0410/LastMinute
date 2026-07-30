import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Category } from "../category";

@Component({
  selector: "app-shop-category-select",
  standalone: true,
  imports: [FormsModule],
  template: `
    <select
      class="field-edit"
      [ngModel]="selectedId()"
      (ngModelChange)="selectedIdChange.emit($event)"
    >
      <option [ngValue]="null" disabled>Alege o categorie...</option>

      @for (category of categories(); track category.id) {
        <option [ngValue]="category.id">{{ category.name }}</option>
      }
    </select>
  `,
  styleUrls: ['./shop-category-select.css']
})
export class ShopCategorySelect {
  categories = input.required<Category[]>();
  selectedId = input<number | null>(null);
  selectedIdChange = output<number>();
}
