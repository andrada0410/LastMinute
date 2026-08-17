import { HttpClient, HttpParams } from "@angular/common/http";
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
    
    confirmReservation(reservationId: number): Observable<Reservation> {
        return this.http.patch<Reservation>(`${this.url}/reservation/${reservationId}/confirm`, {});
    }
 
    cancelReservation(reservationId: number): Observable<Reservation> {
        return this.http.patch<Reservation>(`${this.url}/reservation/${reservationId}/cancel`, {});
    }

    getReservations(params: ({ userId: number } | { shopId: number }) & { status?: string[] }): Observable<ReservationsResponse> {
        let httpParams = new HttpParams();

        if ("userId" in params) {
            httpParams = httpParams.set("userId", params.userId.toString());
        } else {
            httpParams = httpParams.set("shopId", params.shopId.toString());
        }

        if (params.status?.length) {
            httpParams = httpParams.set("status", params.status.join(","));
        }

        return this.http.get<ReservationsResponse>(`${this.url}/reservation`, { params: httpParams });
    }
}