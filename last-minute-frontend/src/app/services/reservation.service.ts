import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Reservation, ReservationsResponse, ShopReservation } from "../reservation";

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

    getShopReservations(shopId: number, status: string): Observable<ShopReservation[]> {
        return this.http.get<ShopReservation[]>(`${this.url}/reservation/shop/${shopId}`,  {
            params: { status }
        });
    }

    confirmReservation(reservationId: number): Observable<Reservation> {
        return this.http.patch<Reservation>(`${this.url}/reservation/${reservationId}/confirm`, {});
    }
 
    cancelReservation(reservationId: number): Observable<Reservation> {
        return this.http.patch<Reservation>(`${this.url}/reservation/${reservationId}/cancel`, {});
    }

    getUserReservations(): Observable<ReservationsResponse> {
        return this.http.get<ReservationsResponse>(`${this.url}/reservation/mine`);
    }
}