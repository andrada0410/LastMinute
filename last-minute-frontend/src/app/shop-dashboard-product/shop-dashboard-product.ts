import { Component, input, output, signal } from "@angular/core";
import { Product } from "../product";
import { ShopDashboardImage } from "../shop-dashboard-image/shop-dashboard-image";
import { PricePipe } from "../pipes/price";
import { CapitalisePipe } from "../pipes/capitalise";
import { environment } from "../environments/environment";

@Component({
  selector: "app-shop-dashboard-product",
  standalone: true,
  imports: [ShopDashboardImage, PricePipe, CapitalisePipe],
  template: `
    <div class="product-card">
        <app-shop-dashboard-image
            class="product-image"
            [imageUrl]="imageUrl"
            altText="Imagine produs"
            label="Schimbă imaginea"
            [fallbackImage]="'assets/shop-dashboard/default-product.png'"
            [isEditing]="false"
        />

        <div class="product-content">
            <h3 class="product-name">{{ product().name | capitalise }}</h3>
            <p class="product-price">{{ product().price | price }}</p>
            <p class="product-description" [class.expanded]="expanded()">{{ product().description }}</p>
            @if (product().description.length > 150) {
              <button type="button" class="expand-button" (click)="expanded.set(!expanded())">
                {{ expanded() ? 'Arată mai puțin' : 'Citește mai mult' }}
              </button>
            }
        </div>

        <div class="product-actions">
            <button type="button" class="button secondary" (click)="edit.emit(product())"> Editează </button>
            <button type="button" class="button danger" (click)="remove.emit(product().id)"> Șterge </button>
        </div>

    </div>  
    `,
  styleUrls: ["./shop-dashboard-product.css"]
})
export class ShopDashboardProduct {
  product = input.required<Product>();
  edit = output<Product>();
  remove = output<number>();

  expanded = signal(false)

  get imageUrl(): string {
    const photoPath = this.product().photoPath;
    
    if (!photoPath) {
      return "";
    }
    
    const isExternalLink = /^https?:\/\//i.test(photoPath);
    
    return isExternalLink
      ? photoPath
      : environment.apiUrl + `/uploads/${photoPath}`;
  }
}