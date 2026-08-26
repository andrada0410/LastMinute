import { Component, input, output } from '@angular/core';
import { ShopMapInfo } from '../../shop';
import { CommonModule } from '@angular/common';
import { CATEGORY_TRANSLATIONS } from 'src/app/category';

@Component({
  selector: 'app-map-shop-details',
  standalone: true,
  imports: [CommonModule],
  template: ` 
    <div 
      class="details-container" 
      [class.visible]="isVisible()"
      [class.flipped]="isFlipped()"
      [ngStyle]="{'top.px': top(), 'left.px': left()}"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()">
      
      <div class="details-content" *ngIf="shop()">
        <img [src]="logoPath()" alt="Logo" class="shop-logo" />
        
        <div class="shop-info">
          <span class="shop-category">{{ getTranslatedCategory(shop()?.category) }}</span>
          <h3 class="shop-name">{{ shop()?.name }}</h3>
          <span class="shop-address">{{ shop()?.address }}</span>
        </div>
        @if (isLoggedIn()) {
          <button type="button" class="btn-favorite" (click)=onFavoriteClick($event)>
            <img class="heart-icon" [src]="isFavorite() ? 'assets/heart-filled.svg' : 'assets/heart-empty.svg'" alt="favorite"/> 
         </button>
        }
        
      </div>
    </div>
  `,
  styleUrls: ['./map-shop-details.component.css']
})

export class MapShopDetailsComponent {
  shop = input<ShopMapInfo | undefined>(undefined);
  logoPath = input<string>('assets/shop-dashboard/default-logo.png');
  isVisible = input<boolean>(false);
  top = input<number>(0);
  left = input<number>(0);
  isFlipped = input<boolean>(false);
  isFavorite = input<boolean>(false);
  isLoggedIn = input<boolean>(false);

  mouseEnter = output<void>();
  mouseLeave = output<void>();
  toggleFavorite = output<number>();

  onMouseEnter() {
    this.mouseEnter.emit();
  }

  onMouseLeave() {
    this.mouseLeave.emit();
  }

  getTranslatedCategory(category?: string): string {
    if (!category) return '';
    return CATEGORY_TRANSLATIONS[category] || category;
  }

  onFavoriteClick(event: MouseEvent) {
    event.stopPropagation();

    const shopData = this.shop();
    if (shopData && shopData.id) {
      this.toggleFavorite.emit(shopData.id);
    }
  }
}
