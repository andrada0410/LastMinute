import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateShopResponse, PaginatedShopsResponse, ShopInfo, Shop, ShopsMapResponse} from "../shop";
import { Category } from "../category";
import { MapFilters } from "../filter";

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

    getShopsInfo(page: number = 1, limit: number = 5, email?: string): Observable<PaginatedShopsResponse> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());

        if (email){
          params = params.set('email', email);
        }

        return this.http.get<PaginatedShopsResponse>(`${this.url}/shop`, { params });
    }
    
    deleteShop(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/shop/${id}`);
    }

    getAllShopMapInfo(filters?: MapFilters) : Observable<ShopsMapResponse> {
        let params = new HttpParams();
        
        if (filters) {
          if (filters.categoryIds && filters.categoryIds.length > 0) {
            params = params.set('categoryId', filters.categoryIds.join(','));
          }

        if (filters.maxPrice !== undefined) {
            params = params.set('maxPrice', filters.maxPrice.toString());
          }

        if (filters.onlyFavorites === true){
            params = params.set('onlyFavorites', 'true');
          }
        }

        return this.http.get<ShopsMapResponse>(`${this.url}/shop/map`, { params });
    }

    updateShopCoordinates(shopId: number, lat: number, lon: number): Observable<any> {
        return this.http.patch(`${this.url}/shop/${shopId}`, { lat, lon });
    }
    
    getShopById(id: number): Observable<Shop> {
        return this.http.get<Shop>(`${this.url}/shop/${id}`);
    }

    getMyShop(): Observable<Shop> {
        return this.http.get<Shop>(`${this.url}/shop/mine`);
    }

    updateShop(shopId: number, name: string, address: string): Observable<Shop> {
        return this.http.patch<Shop>(`${this.url}/shop/${shopId}`, {
        id: shopId,
        name: name,
        address: address
      });
    }

    updateShopDashboard (
        shopData: { details?: string; logo?: File | null; banner?: File | null, categoryId?: number | null }
    ): Observable<Shop> {
    
    const formData = new FormData();

    if (shopData.details !== undefined) {
      formData.append('details', shopData.details);
    }

    if (shopData.logo) {
      formData.append('logo', shopData.logo);
    }

    if (shopData.banner) {
      formData.append('banner', shopData.banner);
    }

    if (shopData.categoryId !== undefined && shopData.categoryId !== null) {
      formData.append('categoryId', shopData.categoryId.toString());
    }

    return this.http.patch<Shop>(
      `${this.url}/shop/dashboard`,
      formData
    );
  }

  getShopCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.url}/shop-category`);
  }
};