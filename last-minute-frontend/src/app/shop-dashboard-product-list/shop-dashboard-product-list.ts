import { Component, input, output } from "@angular/core";
import { ShopDashboardProduct } from "../shop-dashboard-product/shop-dashboard-product";
import { Product } from "../product";

@Component({
    selector: "app-shop-dashboard-product-list",
    standalone: true,
    imports: [ShopDashboardProduct],
    template: `
    <section class="products-section">
        @if (products().length === 0) {
            <p class="text-muted">Nu există produse în meniu.</p>
        } 
        @else {
            <div class="products-grid">
            @for (product of products(); track product.id) {
                <app-shop-dashboard-product
                [product]="product"
                (edit)="edit.emit($event)"
                (remove)="remove.emit($event)"
                />
            }

            </div>
        }
    </section>
  `,
    styleUrls: ["./shop-dashboard-product-list.css"]
})
export class ShopDashboardProductList {
    products = input.required<Product[]>();

    add = output<void>();

    edit = output<Product>();

    remove = output<number>();
}