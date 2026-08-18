import { Component, input, output } from "@angular/core";
import { ShopReservation } from "src/app/reservation";
import { ShopReservationCard } from "../shop-reservation-card/shop-reservation-card";

@Component({
    selector: "app-shop-reservation-list",
    standalone: true,
    template: `
        <section class="reservations-section">
            @if (reservations().length === 0) {
                <p class="text-muted">{{ emptyMessage() }}</p>
            }
            @else {
                <div class="reservations-grid">
                    @for (reservation of reservations(); track reservation.id) {
                        <app-shop-reservation-card
                            [reservation]="reservation"
                            [readOnly]="readOnly()"
                            [showOrderDate]="showOrderDate()"
                            [showPickupTime]="showPickupTime()"
                            (confirm)="confirmReservation.emit($event)"
                            (cancel)="cancelReservation.emit($event)"
                        >
                        </app-shop-reservation-card>
                    }
                </div>
            }
        </section>
    `,
    styleUrls: ["./shop-reservation-list.css"],
    imports: [ShopReservationCard]
})
export class ShopReservationList {
    reservations = input<ShopReservation[]>([]);
    readOnly = input<boolean>(false);
    emptyMessage = input<string>("Nu există rezervări.");

    showOrderDate = input<boolean>(false);
    showPickupTime = input<boolean>(true);

    confirmReservation = output<number>();
    cancelReservation = output<number>();
}