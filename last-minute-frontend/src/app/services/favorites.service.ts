import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class FavoritesService {
    private url = environment.apiUrl;
    private http = inject(HttpClient);

    public getFavoriteShopsIds(): Observable<number[]> {
        return this.http.get<number[]>(`${this.url}/user/favorites`);
    }

    public addFavorite(shopId: number): Observable<void> {
        return this.http.post<void>(`${this.url}/user/favorites`, { shopId });
    }

    public removeFavorite(shopId: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/user/favorites/${shopId}`);
    }

}