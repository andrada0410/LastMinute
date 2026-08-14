import { Component, inject, OnInit } from "@angular/core";
import { ShopReservation } from "../reservation";
import { ReservationService } from "../services/reservation.service";
import { ShopService } from "../services/shop.service";
import { ToastService } from "../services/toast.service";
import { ShopReservationList } from "../shop-reservation-list/shop-reservation-list";
import { ConfirmDelete } from "../confirm-delete/confirm-delete";

@Component({
    selector: "app-shop-active-reservations",
    standalone: true,
    imports: [ShopReservationList, ConfirmDelete],
    template: `
        <section class="page">
            <div class="reservations-page">

                <div class="page-head">
                    <div>
                        <h1>Rezervări active</h1>
                        <p class="text-muted">
                            Rezervările în așteptare pentru magazinul tău, pe care le poți confirma sau anula.
                        </p>
                    </div>
                </div>

                <div class="card reservations-card">
                    <div class="reservations-body">

                        <app-shop-reservation-list
                            [reservations]="reservations"
                            emptyMessage="Nu există rezervări active."
                            (confirmReservation)="onConfirm($event)"
                            (cancelReservation)="onCancel($event)"
                        >
                        </app-shop-reservation-list>

                    </div>
                </div>

            </div>

            @if (reservationPendingCancel !== null) {
                <div class="overlay">
                    <app-confirm-delete
                        message="Sigur dorești să anulezi această rezervare?"
                        (confirm)="confirmCancelReservation()"
                        (cancel)="reservationPendingCancel = null"
                    >
                    </app-confirm-delete>
                </div>
            }
        </section>
    `,
    styleUrls: ["./shop-active-reservations.css"]
})
export class ShopActiveReservations implements OnInit {
    private shopService = inject(ShopService);
    private reservationService = inject(ReservationService);
    private toastService = inject(ToastService);

    reservations: ShopReservation[] = [];
    reservationPendingCancel: number | null = null;

    ngOnInit(): void {
        this.loadReservations();
    }

    private loadReservations(): void {
        this.shopService.getMyShop().subscribe({
            next: (shop) => {
                this.reservationService.getShopReservations(shop.id, "PENDING").subscribe({
                    next: (reservations) => {
                        this.reservations = reservations;
                    },
                    error: () => {
                        this.toastService.error("Nu s-au putut încărca rezervările.", "Eroare");
                    }
                });
            },
            error: () => {
                this.toastService.error("Nu s-a putut încărca magazinul.", "Eroare");
            }
        });
    }

    onConfirm(reservationId: number): void {
        this.reservationService.confirmReservation(reservationId).subscribe({
            next: () => {
                this.removeReservation(reservationId);
                this.toastService.success("Rezervarea a fost confirmată.", "Succes");
            },
            error: () => {
                this.toastService.error("Nu s-a putut confirma rezervarea.", "Eroare");
            }
        });
    }

    onCancel(reservationId: number): void {
        this.reservationPendingCancel = reservationId;
    }

    confirmCancelReservation(): void {
        if (this.reservationPendingCancel === null) {
            return;
        }

        const reservationId = this.reservationPendingCancel;

        this.reservationService.cancelReservation(reservationId).subscribe({
            next: () => {
                this.reservationPendingCancel = null;
                this.removeReservation(reservationId);
                this.toastService.success("Rezervarea a fost anulată.", "Succes");
            },
            error: () => {
                this.reservationPendingCancel = null;
                this.toastService.error("Nu s-a putut anula rezervarea.", "Eroare");
            }
        });
    }

    private removeReservation(reservationId: number): void {
        this.reservations = this.reservations.filter((r) => r.id !== reservationId);
    }
}