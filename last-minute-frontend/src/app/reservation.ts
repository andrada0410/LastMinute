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