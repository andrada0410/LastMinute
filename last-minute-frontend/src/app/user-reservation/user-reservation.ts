import { Component, input } from "@angular/core";
import { UserReservation as UserReservationModel } from "../reservation";
import { CapitalisePipe } from "../pipes/capitalise";
import { PricePipe } from "../pipes/price";
import { resolveImagePath } from "../utils";

@Component({
    selector: "app-user-reservation",
    standalone: true,
    imports: [CapitalisePipe, PricePipe],
    template: `
        <div class="reservation-item" [class.is-history]="isHistory()">
            <img
                [src]="resolveImagePath(reservation().productPhotoPath,'assets/shop-dashboard/default-product.png')" 
                [alt]="reservation().productName"
                class="item-thumb"
            />

            <div class="reservation-info">
                <span class="item-name">
                    <span class="qty">{{ reservation().quantity }}x</span>
                    {{ reservation().productName | capitalise }}
                    
                    @if (isHistory()) {
                        <span class="status-badge" [class.status-cancelled]="reservation().status === 'CANCELLED'">
                            {{ reservation().status === 'CANCELLED' ? 'Anulată' : 'Finalizată' }}
                        </span>
                    }
                </span>
                <span class="shop-name">{{ reservation().shopName }}</span>
                <span class="total-price">{{ reservation().totalPrice | price }}</span>

                

            </div>

            <div class="reservation-pickup">
                <span class="pickup-label">Ridicare</span>
                <span class="pickup-time">
                    {{ formatDateTime(reservation().pickupStartTime) }} - {{ formatTime(reservation().pickupEndTime) }}
                </span>
            </div>

        </div>
    `,
    styleUrls: ["./user-reservation.css"]
})
export class UserReservation {
    reservation = input.required<UserReservationModel>();
    isHistory = input<boolean>(false);

    resolveImagePath = resolveImagePath;

    formatTime(dateString: string): string {
        const date = new Date(dateString);
        const pad = (n: number) => n.toString().padStart(2, "0");

        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    formatDateTime(dateString: string): string {
        const date = new Date(dateString);
        const pad = (n: number) => n.toString().padStart(2, "0");

        return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${this.formatTime(dateString)}`;
    }
}