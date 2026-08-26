import { Component, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShopDashboardImage } from "../shop-dashboard-image/shop-dashboard-image";
import { ShopCategorySelect } from "../shop-category-select/shop-category-select";
import { Category } from "../category";

@Component({
  selector: "app-shop-dashboard-profile",
  standalone: true,
  imports: [FormsModule, ShopDashboardImage, ShopCategorySelect],
  template: `
    <div class="page-head">
      <div>
        <h1>Dashboard</h1>
        <p class="text-muted">Profilul magazinului tau</p>
      </div>

      @if (!isEditing()) {
        <div class="view-actions">
          <button
            type="button"
            class="button primary"
            (click)="startEditing.emit()"
          >
            Editează profilul
          </button>
        </div>
      }

      @if (isEditing()) {
        <div class="edit-only">
          <button
            type="button"
            class="button secondary"
            (click)="cancelEditing.emit()"
          >
            Anulează
          </button>
          <button
            type="button"
            class="button primary"
            [disabled]="isSaveDisabled()"
            (click)="submitForm.emit()"
          >
            Salvează modificările
          </button>
        </div>
      }
    </div>

    <div class="card shop-card">
      <!-- Banner -->
      <div class="shop-banner">
        <app-shop-dashboard-image
          [imageUrl]="bannerUrl()"
          altText="Banner magazin"
          label="Schimbă banner-ul"
          [isEditing]="isEditing()"
          (imageSelected)="imagePicked.emit({ file: $event, type: 'banner' })"
          [fallbackImage]="'assets/shop-dashboard/default-banner.png'"
        />
      </div>

      <!-- Logo -->
      <div class="shop-header">
        <div class="shop-logo">
          <app-shop-dashboard-image
            [imageUrl]="logoUrl()"
            altText="Logo magazin"
            label="Schimbă logo-ul"
            [isEditing]="isEditing()"
            (imageSelected)="imagePicked.emit({ file: $event, type: 'logo' })"
            [fallbackImage]="'assets/shop-dashboard/default-logo.png'"
          />
        </div>
      </div>

      <div class="shop-body">
        <!-- Shop Name -->
        <div class="field-group">
          <span class="field-label">Denumire</span>
          <div class="shop-name-view">{{ name() }}</div>
        </div>

        <div class="field-group">
          <span class="field-label">Adresă</span>
          <div class="field-value muted">{{ address() }}</div>
        </div>

        <div class="field-group">
          <span class="field-label">Categorie</span>
          @if (!isEditing()) {
            <p class="field-value muted">{{ categoryName() }}</p>
          }

          @if (isEditing()) {
            <app-shop-category-select
              [categories]="categories()"
              [selectedId]="categoryId()"
              (selectedIdChange)="categoryIdChange.emit($event)"
            />
          }
        </div>

        <!-- Details -->
        <div class="field-group">
          <span class="field-label">Detalii</span>
          @if (!isEditing()) {
            <p class="field-value muted">{{ details() }}</p>
          }
          @if (isEditing()) {
            <textarea
              class="field-edit"
              name="details"
              [ngModel]="details()"
              (ngModelChange)="detailsChange.emit($event)"
              placeholder="Descrie magazinul..."
            ></textarea>

            @if (details() && details().length > 1000) {
              <p class="message error">
                Detaliile nu pot avea mai mult de 1000 de caractere.
              </p>
            }
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./shop-dashboard-profile.css"]
})
export class ShopDashboardProfile {
  isEditing = input<boolean>(false);
  name = input<string>('');
  address = input<string>('');
  details = input<string>('');
  bannerUrl = input<string>('');
  logoUrl = input<string>('');
  categoryName = input<string>('');
  categoryId = input<number | null>(null);
  categories = input<Category[]>([]);
  isSaveDisabled = input<boolean>(false);

  detailsChange = output<string>();
  categoryIdChange = output<number | null>();
  startEditing = output<void>();
  cancelEditing = output<void>();
  submitForm = output<void>();
  imagePicked = output<{ file: File; type: 'banner' | 'logo' }>();
}