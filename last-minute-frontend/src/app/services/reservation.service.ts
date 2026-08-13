import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
    url = 'http://localhost:4001';
    private http = inject(HttpClient);

    createReservation(offerId: number, productId: number, quantity: number) {
        return this.http.post(`${this.url}/reservation`, {
            offerId,
            productId,
            quantity
        });
    }
}