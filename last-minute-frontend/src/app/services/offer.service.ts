import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateOfferRequest, OfferResponse } from "../offer";
import { environment } from "../environments/environment";


@Injectable({
    providedIn: 'root',
})
export class OfferService {
    url = environment.apiUrl;
    private http = inject(HttpClient);

    getOffer(shopId: number, startDate: string, endDate: string): Observable<OfferResponse> {
        return this.http.get<OfferResponse>(`${this.url}/offer`, {
            params: {
                shopId: shopId.toString(),
                startDate,
                endDate,
                include: "Offer.products"
            }
        });
    }


    createOffer(shopId: number, data: CreateOfferRequest): Observable<{ id: number }> {
        return this.http.post<{ id: number }>(`${this.url}/offer`, {
            shopId,
            startDate: data.startDate,
            hoursAvailable: data.hoursAvailable,
            products: data.products
        });
    }

    deleteOffer(offerId: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/offer/${offerId}`);
    }

    getMaxPriceToday(): Observable<number> { 
        return this.http.get<number>(`${this.url}/offer/max-price`);
    }
}