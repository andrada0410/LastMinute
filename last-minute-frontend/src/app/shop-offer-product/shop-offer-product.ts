import { Component, input, signal } from "@angular/core";
import { OfferProduct } from "../offer";
import { ShopDashboardImage } from "../shop-dashboard-image/shop-dashboard-image";
import { PricePipe } from "../pipes/price";
import { CapitalisePipe } from "../pipes/capitalise";
import { environment } from "../environments/environment";
import { resolveImagePath } from "../utils";

@Component({
    selector: "app-shop-offer-product",
    standalone: true,
    imports: [ShopDashboardImage, PricePipe, CapitalisePipe],
    template: `
        <div class="product-card" [class.is-disabled]="offerProduct().isDeleted">

            <app-shop-dashboard-image
                class="product-image"
                [imageUrl]="resolveImagePath(offerProduct().photoPath, 'assets/shop-dashboard/default-product.png')"
                altText="Imagine produs"
                [fallbackImage]="'assets/shop-dashboard/default-product.png'"
                [isEditing]="false"
            />

            <div class="product-content">

                <h3 class="product-name">
                    {{ offerProduct().name | capitalise }}
                </h3>

                <div class="product-prices">
                    <span class="old-price">
                        {{ offerProduct().price | price }}
                    </span>

                    <span class="offer-price">
                        {{ offerProduct().offerPrice | price }}
                    </span>
                </div>

                <p class="product-quantity">
                    Cantitate: {{ offerProduct().quantity }}
                </p>

                <p class="product-description"
                    [class.expanded]="expanded()">

                    {{ offerProduct().description }}

                </p>

                @if (offerProduct().description.length > 150) {
                    <button
                        type="button"
                        class="expand-button"
                        (click)="expanded.set(!expanded())">

                        {{ expanded() ? 'Arată mai puțin' : 'Citește mai mult' }}

                    </button>
                }

                @if (offerProduct().isDeleted) {
                    <span class="badge-disabled">Indisponibil</span>
                }

            </div>

        </div>
    `,
    styleUrls: ["./shop-offer-product.css"]
})
export class ShopOfferProduct {

    offerProduct = input.required<OfferProduct>();

    expanded = signal(false);

    resolveImagePath = resolveImagePath;
}