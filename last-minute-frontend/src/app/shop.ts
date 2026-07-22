export interface ShopInfo {
    id: number;
    name: string;
    address: string;
    email: string;
}

export interface PaginatedShopsResponse {
    entry: ShopInfo[];
    total: number;
}
export interface CreateShopResponse {
    userData: {
        id: number;
        email: string;
    };
    shopData: {
        id: number;
        name: string;
        address: string;
        userId?: number;
    };
}