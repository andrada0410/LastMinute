import { Component, input, output } from "@angular/core";
import { ShopReservation } from "src/app/reservation";
import { ShopDashboardImage } from "../shop-dashboard-image/shop-dashboard-image";
import { PricePipe } from "../pipes/price";
import { CapitalisePipe } from "../pipes/capitalise";

@Component({
    selector: "app-shop-reservation-card",
    standalone: true,
    imports: [ShopDashboardImage, PricePipe, CapitalisePipe],
    template: `
        <div class="reservation-card">

            <app-shop-dashboard-image
                class="reservation-image"
                [imageUrl]="imageUrl"
                altText="Imagine produs"
                [fallbackImage]="'assets/shop-dashboard/default-product.png'"
                [isEditing]="false"
            />

            <div class="reservation-content">

            <div class="reservation-left">
                <h3 class="reservation-name">
                    {{ reservation().productName | capitalise }}
                </h3>

                <p [class]="'reservation-status status-' + reservation().status.toLowerCase()">
                    {{ statusLabel() }}
                </p>
            </div>

             <div class="reservation-right">
                <p>Cantitate: {{ reservation().quantity }}</p>

                <p>Preț: {{ reservation().totalPrice | price }}</p>

                <p>Ridicare: {{ formatTime(reservation().pickupStart) }} - {{ formatTime(reservation().pickupEnd) }}</p>

                <p>Client: {{ reservation().customerName }}</p>
             </div>

            </div>

            @if (!readOnly() && reservation().status === 'PENDING') {
                <div class="reservation-actions">
                    <button
                        type="button"
                        class="button primary"
                        (click)="confirm.emit(reservation().id)"
                    >
                        Confirmă
                    </button>
                    <button
                        type="button"
                        class="button danger"
                        (click)="cancel.emit(reservation().id)"
                    >
                        Anulează
                    </button>
                </div>
            }

        </div>
    `,
    styleUrls: ["./shop-reservation-card.css"]
})
export class ShopReservationCard {
    reservation = input.required<ShopReservation>();
    readOnly = input<boolean>(false);

    confirm = output<number>();
    cancel = output<number>();

    get imageUrl(): string {
        const photoPath = this.reservation().productImage;

        if (!photoPath) {
            return "";
        }

        const isExternalLink = /^https?:\/\//i.test(photoPath);

        return isExternalLink
            ? photoPath
            : `http://localhost:4001/uploads/${photoPath}`;
    }

    statusLabel(): string {
        switch (this.reservation().status) {
            case "PENDING":
                return "În așteptare";
            case "COMPLETED":
                return "Confirmată";
            case "CANCELLED":
                return "Anulată";
        }
    }

    formatTime(dateString: string): string {
        const date = new Date(dateString);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
}