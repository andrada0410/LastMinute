import { Product } from "./product";

export interface OfferInfo {
    resourceType: "Offer";
    id: number;
    shopId: number;
    startDate: string;
    endDate: string;
    hoursAvailable: number;
}

export interface OfferProduct extends Product {
    resourceType: "Product";
    quantity: number;
    offerPrice: number;
    isDeleted?: boolean;
}

export type OfferEntryItem = OfferInfo | OfferProduct;

export interface OfferResponse {
    entry: OfferEntryItem[];
}

export function isOfferInfo(item: OfferEntryItem): item is OfferInfo {
    return item.resourceType === "Offer";
}

export function isOfferProduct(item: OfferEntryItem): item is OfferProduct {
    return item.resourceType === "Product";
}

// interfaces for crating an offer
export interface CreateOfferProduct {
    productId: number;
    quantity: number;
    discountPercent: number;
}

export interface CreateOfferRequest {
    startDate: string;
    hoursAvailable: number;
    products: CreateOfferProduct[];
}