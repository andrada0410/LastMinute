export interface CreateReservationRequest {
    offerId: number;
    productId: number;
    quantity: number;
}

export interface Reservation {
    id: number;
    userId: number;
    offerId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
}

export interface ShopReservation {
    resourceType: "ShopReservation";
    id: number;
    offerId: number;
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    pickupStart: string;
    pickupEnd: string;
    customerName: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
}
export interface UserReservation {
    resourceType: "UserReservation";
    id: number;
    offerId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
    productName: string;
    productPhotoPath: string;
    shopName: string;
    pickupStartTime: string;
    pickupEndTime: string;
}

export type ReservationEntryItem = UserReservation | ShopReservation;

export interface ReservationsResponse {
    entry: ReservationEntryItem[];
    total?: number;
}

export function isUserReservation(item: ReservationEntryItem): item is UserReservation {
    return item.resourceType === "UserReservation";
}

export function isShopReservation(item: ReservationEntryItem): item is ShopReservation {
    return item.resourceType === "ShopReservation";
}

export interface ShopReservationStatistics {
  productId: number;
  productName: string;
  listedQuantity: number;
  soldQuantity: number;
}