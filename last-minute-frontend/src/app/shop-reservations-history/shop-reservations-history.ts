import { Component, inject, OnInit } from "@angular/core";
import { isShopReservation, ShopReservation } from "../reservation";
import { ReservationService } from "../services/reservation.service";
import { ShopService } from "../services/shop.service";
import { ToastService } from "../services/toast.service";
import { ShopReservationList } from "../shop-reservation-list/shop-reservation-list";
import { switchMap } from "rxjs";

@Component({
    selector: "app-shop-reservation-history",
    standalone: true,
    imports: [ShopReservationList],
    template: `
        <section class="page">
            <div class="reservations-page">

                <div class="page-head">
                    <div>
                        <h1>Istoric rezervări</h1>
                        <p class="text-muted">
                            Aici poți vedea toate rezervările finalizate sau anulate.
                        </p>
                    </div>
                </div>

                <div class="card reservations-card">
                    <div class="reservations-body">

                        <app-shop-reservation-list
                            [reservations]="reservations"
                            [readOnly]="true"
                            [showOrderDate]="true"
                            [showPickupTime]="false"
                            emptyMessage="Nu există istoric de rezervări."
                        >
                        </app-shop-reservation-list>

                        @if (hasMoreReservations) {
                            <div class="load-more-container">
                                <button
                                    type="button"
                                    class="btn-load-more"
                                    (click)="loadMore()"
                                    [disabled]="isLoading"
                                >
                                    {{ isLoading ? 'Se încarcă...' : 'Vezi mai multe' }}
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    `,
    styleUrls: ["./shop-reservations-history.css"]
})
export class ShopReservationsHistory implements OnInit {
    private shopService = inject(ShopService);
    private reservationService = inject(ReservationService);
    private toastService = inject(ToastService);

    public reservations: ShopReservation[] = [];
    private currentPage: number = 1;
    private readonly pageSize: number = 20;
    private totalReservations: number = 0;
    public isLoading: boolean = false;
    private shopId: number | null = null;

    ngOnInit(): void {
        this.initHistory();
    }

    get hasMoreReservations(): boolean {
        return this.reservations.length < this.totalReservations;
    }

    private initHistory(): void {
        this.isLoading = true;
        this.shopService.getMyShop().pipe(
            switchMap((shop) => {
                this.shopId = shop.id;
                return this.reservationService.getReservations({
                    shopId: shop.id,
                    status: ['COMPLETED', 'CANCELLED'],
                    page: this.currentPage,
                    limit: this.pageSize
                });
            })
        ).subscribe({
            next: (response) => {
                this.totalReservations = response.total ?? 0;
                this.reservations = response.entry.filter(isShopReservation);
                this.isLoading = false;
            },
            error: (err) => {
                this.toastService.error("A apărut o eroare la încărcarea istoricului.", "Eroare");          
                this.isLoading = false;  
                console.error(err);
            }
        });
    }

    public loadMore(): void {
        if (!this.shopId || this.isLoading || !this.hasMoreReservations) {
            return;
        }

        this.isLoading = true;
        const nextPage = this.currentPage + 1;

        this.reservationService.getReservations({
            shopId: this.shopId,
            status: ['COMPLETED', 'CANCELLED'],
            page: nextPage,
            limit: this.pageSize
        }).subscribe({
            next: (response) => {
                this.currentPage = nextPage;
                this.totalReservations = response.total ?? this.totalReservations;
                
                const newReservations = response.entry.filter(isShopReservation);
                this.reservations = [...this.reservations, ...newReservations];
                this.isLoading = false;
            },
            error: (err) => {
                this.toastService.error("Nu s-au putut încărca rezervările următoare.", "Eroare");
                this.isLoading = false;
                console.error(err);
            }
        });
    }
}