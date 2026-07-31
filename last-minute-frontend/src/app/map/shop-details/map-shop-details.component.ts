import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ShopMapInfo } from '../../shop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map-shop-details',
  standalone: true,
  imports: [CommonModule],
  template: ` 
    <div 
      class="details-container" 
      [class.visible]="isVisible"
      [class.flipped]="isFlipped"
      [ngStyle]="{'top.px': top, 'left.px': left}"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()">
      
      <div class="details-content" *ngIf="shop">
        <img [src]="logoPath" alt="Logo" class="shop-logo" />
        
        <div class="shop-info">
          <span class="shop-category">{{ getTranslatedCategory(shop.category) }}</span>
          <h3 class="shop-name">{{ shop.name }}</h3>
          <span class="shop-address">{{ shop.address }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./map-shop-details.component.css']
})

export class MapShopDetailsComponent {
  @Input() shop?: ShopMapInfo;
  @Input() logoPath: string = 'assets/shop-dashboard/default-logo.png';

  @Input() isVisible: boolean = false;
  @Input() top: number = 0;
  @Input() left: number = 0;
  @Input() isFlipped: boolean = false;

  @Output() mouseEnter: EventEmitter<void> = new EventEmitter<void>();
  @Output() mouseLeave: EventEmitter<void> = new EventEmitter<void>();

  CATEGORY_TRANSLATIONS: Record<string, string> = {
    "Restaurant": "Restaurant",
    "Fast-Food": "Fast-Food",
    "Confectionery": "Cofetărie",
    "Bakery": "Patiserie",
    "Supermarket": "Supermarket"
  };

  onMouseEnter() {
    this.mouseEnter.emit();
  }

  onMouseLeave() {
    this.mouseLeave.emit();
  }

  getTranslatedCategory(category: string): string {
    if (!category) return '';
    return this.CATEGORY_TRANSLATIONS[category] || category;
  }
}
