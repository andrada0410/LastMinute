import { Component, EventEmitter, Input, Output } from "@angular/core";
import { OfferProduct } from "src/app/offer";
import { PricePipe } from "src/app/pipes/price";

@Component({
    selector: 'app-reservation-modal',
    standalone: true,
    imports: [PricePipe],
    template: `
        <div class="modal-overlay" (click)="onClose()">
            <div class="modal-content" (click)="$event.stopPropagation()">
                
                <div class="modal-header">
                    <h2>Confirmare rezervare</h2>
                    <button type="button" class="close-btn" (click)="onClose()">✖</button>
                </div>

                <div class="modal-body">
                    <div class="product-preview">
                        <img [src]="product.photoPath || 'assets/shop-dashboard/default-logo.png'" 
                            alt="Produs"
                            class="modal-product-img">
                        <div class="product-info">
                            <h3>{{product.name}}</h3>
                            <p>Preț per bucată: {{ product.offerPrice | price }}</p>
                            <p class="stock-info">Stoc disponibil: {{ product.quantity }}</p>
                        </div>
                    </div>

                    @if (product.description) {
                        <div class="description-section">
                            <button type="button" class="btn-link" (click)="toggleDescription()">
                                {{ showDescription ? 'Ascunde descrierea' : 'Vezi descrierea produsului' }}
                            </button>
                    
                            @if (showDescription) {
                                <div class="description-content">
                                    <p>{{ product.description }}</p>
                                </div>
                            }
                        </div>
                    }

                    <div class="quantity-selector">
                        <label>Selectează cantitatea:</label>
                        <div class="controls">
                            <button type="button" (click)="decreaseQuantity()" [disabled]="selectedQuantity <= 1">-</button>
                            <span class="current-quantity">{{ selectedQuantity }}</span>
                            <button type="button" (click)="increaseQuantity()" [disabled]="selectedQuantity >= product.quantity">+</button>
                        </div>
                    </div>

                    <div class="total-price-section">
                        <span>Total estimat:</span>
                        <strong>{{ finalPrice | price }}</strong>
                    </div>
                </div>

            <div class="modal-footer">
                <button type="button" class="btn-cancel" (click)="onClose()">Anulează</button>
                <button type="button" class="btn-confirm" (click)="onConfirm()">Plasează Rezervarea</button>
            </div>
        </div>
    </div>
    `,
    styleUrls: ['./reservation-modal.component.css']
})
export class ReservationModalComponent {
    @Input({ required: true}) product!: OfferProduct;

    @Output() close = new EventEmitter<void>();
    @Output() reserve = new EventEmitter<{productId : number, quantity: number}>();

    public selectedQuantity: number = 1;
    public showDescription: boolean = false;

    get finalPrice(): number {
        return this.selectedQuantity * this.product.offerPrice;
    }

    public increaseQuantity(): void {
        if (this.selectedQuantity < this.product.quantity)
            this.selectedQuantity++;
    }

    public decreaseQuantity(): void {
        if (this.selectedQuantity > 1)
            this.selectedQuantity--;
    }

    public toggleDescription(): void {
        this.showDescription = !this.showDescription;
    }

    public onClose(): void {
        this.close.emit();
    }

    public onConfirm(): void {
        this.reserve.emit({
            productId: this.product.id,
            quantity: this.selectedQuantity
        });
    }
}