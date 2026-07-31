export interface ShopInfo {
    id: number;
    name: string;
    address: string;
    email: string;
}

export interface Shop {
    id: number;
    name: string;
    address: string;
    userId: number;
    logoPath: string;
    bannerPath: string;
    details: string;
    categoryId: number;
    categoryName: string;
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

// useful interfaces for map usage:

export interface ShopMapInfo {
    id: number;
    name: string;
    address: string;
    hasOffers: boolean;
    lat: number; // latitude
    lon: number; // longitude
    category: string;
    logoPath: string;
}

export interface ShopsMapResponse {
    entry: ShopMapInfo[];
}
export interface CreateShopRequest {
    name: string,
    email: string,
    password: string,
    address: string
}