import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ReservationsResponse } from "../reservation";
import { Observable } from "rxjs";

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

    getUserReservations(): Observable<ReservationsResponse> {
        return this.http.get<ReservationsResponse>(`${this.url}/reservation/mine`);
    }
}