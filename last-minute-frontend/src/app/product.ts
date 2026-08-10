export interface Product {
    id: number;
    shopId: number;
    name: string;
    price: number;
    description: string;
    photoPath: string;
}

export interface ProductsImportResponse {
    successCount: number
}