import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateShopResponse, PaginatedShopsResponse, ShopInfo, ShopsMapResponse} from "../shop";

@Injectable({
  providedIn: 'root',
})
export class ShopService {
    url = 'http://localhost:4001';
    private http = inject(HttpClient);

    registerShop(email: string, password: string, name: string, address: string): Observable<CreateShopResponse> {
        return this.http.post<CreateShopResponse>(`${this.url}/register-shop`, {
            user: {
                email, password
            },
            shop: {
                name, address
            }
        });
    }

    getShopsInfo(page: number = 1, limit: number = 5): Observable<PaginatedShopsResponse> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        return this.http.get<PaginatedShopsResponse>(`${this.url}/shop`, { params });
    }

    getAllShopMapInfo() : Observable<ShopsMapResponse> {
        return this.http.get<ShopsMapResponse>(`${this.url}/shops/map`);
    }

    updateShop(id: number, name: string, address: string): Observable<ShopInfo> {
        return this.http.patch<ShopInfo>(`${this.url}/shop/${id}`, { id, name, address });
    }
    
    deleteShop(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/shop/${id}`);
    }
};