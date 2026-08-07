import { Component, input } from "@angular/core";
import { OfferInfo, OfferProduct } from "src/app/offer";
import { ShopOfferProduct } from "../shop-offer-product/shop-offer-product";
@Component({
    selector: "app-shop-offer-list",
    standalone: true,
    imports: [ShopOfferProduct],
    template: `
        <section class="offers-section">
            @if (!offerInfo() || products().length === 0) {
                <p class="text-muted">Nu există ofertă activă.</p>
            }
            @else {
                <div class="offers-grid">
                    @for (product of products(); track product.id) {
                        <app-shop-offer-product
                            [offerProduct]="product">
                        </app-shop-offer-product>
                    }
                </div>
            }
        </section>
    `,
    styleUrls: ["./shop-offer-list.css"]
})
export class ShopOfferList {
    offerInfo = input<OfferInfo | null>(null);
    products = input<OfferProduct[]>([]);
}