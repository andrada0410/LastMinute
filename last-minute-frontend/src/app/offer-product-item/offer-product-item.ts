import { Component, input, output } from '@angular/core';
import { OfferProduct } from '../offer';
import { PricePipe } from '../pipes/price';
import { resolveImagePath } from '../utils';

@Component({
  selector: 'app-offer-product-item',
  standalone: true,
  imports: [PricePipe],
  template: `
    <li [class.is-out-of-stock]="item().quantity <= 0" [class.is-interactive]="!isLoggedIn()" (click)="onProductClick()">
      <div class="item-main">
        <img [src]="resolveImagePath(item().photoPath, 'assets/shop-dashboard/default-product.png')"
             alt="Produs" 
             class="item-thumb">
        <div class="item-info">
          <span class="item-name">
            <span class="qty">{{ item().quantity }}x</span> {{ item().name }}
          </span>
          <div class="item-prices">
            <span class="old-price">{{ item().price | price }}</span>
            <span class="new-price">{{ item().offerPrice | price }}</span>
            @if (getDiscountPercent(item().price, item().offerPrice) > 0) {
              <span class="badge-discount">-{{ getDiscountPercent(item().price, item().offerPrice) }}%</span>
            }
          </div>
        </div>
      </div>

      @if (isLoggedIn() && isOfferActive() && item().quantity > 0) {
        <div class="item-actions">
          <button type="button" class="btn-reserve" (click)="openModal(item(), $event)">Rezervă</button>
        </div>
      }
      @if (item().quantity <= 0) {
        <div class="item-actions">
          <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: bold;">Stoc epuizat</span>
        </div>
      }
    </li>
  `,
  styleUrls: ['./offer-product-item.css']
})
export class OfferProductItemComponent {
  item = input.required<OfferProduct>();
  isLoggedIn = input<boolean>(false);
  isOfferActive = input<boolean>(false);

  reserveProduct = output<OfferProduct>();
  productClick = output<void>();

  resolveImagePath = resolveImagePath;

  public getDiscountPercent(originalPrice: number, offerPrice: number): number {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - offerPrice) / originalPrice) * 100);
  }

  public openModal(product: OfferProduct, event: MouseEvent): void {
    event.stopPropagation();
    this.reserveProduct.emit(product);
  }

  public onProductClick(): void {
    this.productClick.emit();
  }
}