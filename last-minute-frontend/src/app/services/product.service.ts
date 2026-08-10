import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product, ProductsImportResponse } from "../product";

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    url = 'http://localhost:4001';
    private http = inject(HttpClient);

    getProducts(shopId: number, name?: string): Observable<Product[]> {
        let params: any = { shopId: shopId.toString() };

        if (name) {
            params.name = name;
        }

        return this.http.get<Product[]>(`${this.url}/product`, { params });
    }

    createProduct(shopId: number, productData: { name: string; price: number; description: string; photo?: File | null; }
    ): Observable<Product> {
        const formData = new FormData();

        formData.append("shopId", shopId.toString());
        formData.append("name", productData.name);
        formData.append("price", productData.price.toString());
        formData.append("description", productData.description);

        if (productData.photo) {
            formData.append("product", productData.photo);
        }

        return this.http.post<Product>(`${this.url}/product`, formData);
    }

    updateProduct(id: number, productData: {name?: string; price?: number; description?: string; photo?: File | null;}): Observable<Product> {
        const formData = new FormData();

        if (productData.name !== undefined) {
            formData.append("name", productData.name);
        }

        if (productData.price !== undefined) {
            formData.append("price", productData.price.toString());
        }

        if (productData.description !== undefined) {
            formData.append("description", productData.description);
        }

        if (productData.photo) {
            formData.append("product", productData.photo);
        }

        return this.http.patch<Product>(`${this.url}/product/${id}`, formData);
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/product/${id}`);
    }

    importProducts(shopId: number, excelFile: File) : Observable<ProductsImportResponse> {
        const formData = new FormData();
        formData.append("file", excelFile);

        return this.http.post<ProductsImportResponse>(
          `${this.url}/shop/${shopId}/products/import`,
          formData,
        );
    }
};