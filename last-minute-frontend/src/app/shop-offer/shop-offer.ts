import { Component, inject, OnInit } from "@angular/core";
import { isOfferInfo, isOfferProduct, OfferInfo, OfferProduct } from "../offer";
import { OfferService } from "../services/offer.service";
import { ToastService } from "../services/toast.service";
import { ShopOfferList } from "../shop-offer-list/shop-offer-list";
import { ShopService } from "../services/shop.service";

@Component({
    selector: "app-shop-offer",
    standalone: true,
    imports: [ShopOfferList],
    template: `
        <section class="page">
            <div class="offers-page">

                <div class="page-head">
                    <div>
                        <h1>Oferta zilei</h1>
                        @if (offerInfo) {
                            <p class="text-muted">
                                Produsele incluse în oferta activă a magazinului, disponibilă între
                                <strong>{{ formatTime(offerInfo.startDate) }}</strong>
                                și
                                <strong>{{ formatTime(offerInfo.endDate) }}</strong>.
                            </p>
                        } @else {
                            <p class="text-muted">
                                Produsele incluse în oferta activă a magazinului.
                            </p>
                        }
                    </div>
                </div>

                <div class="card offer-card">
                    <div class="offer-body">

                        <app-shop-offer-list
                            [offerInfo]="offerInfo"
                            [products]="products">
                        </app-shop-offer-list>

                    </div>
                </div>

            </div>
        </section>
    `,
    styleUrls: ["./shop-offer.css"]
})
export class ShopOffer implements OnInit {
    private shopService = inject(ShopService);
    private offerService = inject(OfferService);
    private toastService = inject(ToastService);

    offerInfo: OfferInfo | null = null;
    products: OfferProduct[] = [];

    ngOnInit(): void {
        this.loadOffer();
    }

    private loadOffer(): void {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        this.shopService.getMyShop().subscribe({
            next: (shop) => {
                this.offerService.getOffer(
                    shop.id,
                    startDate.toISOString(),
                    endDate.toISOString()
                ).subscribe({
                    next: (response) => {
                        this.offerInfo = response.entry.find(isOfferInfo) ?? null;
                        this.products = response.entry.filter(isOfferProduct);
                    },
                    error: () => {
                        this.toastService.error(
                            "Nu am putut încărca oferta.",
                            "Eroare"
                        );
                    }
                });
            },
            error: () => {
                this.toastService.error(
                    "Nu am putut încărca oferta magazinului.",
                    "Eroare"
                );
            }
        });
    }

    formatTime(dateString: string): string {
        const date = new Date(dateString);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
}