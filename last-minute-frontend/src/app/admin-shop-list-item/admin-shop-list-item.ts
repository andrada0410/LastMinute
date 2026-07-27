import { Component, input, output } from "@angular/core";
import { ShopInfo } from "../shop";

@Component({
  selector: "app-admin-shop-list-item",
  standalone: true,
  template: `
    <div class="shop-info">
      <span class="shop-name">{{ shop().name }}</span>
      <span class="shop-email">{{ shop().email }}</span>
    </div>
    <div class="shop-actions">
      <button type="button" class="primary" (click)="editShopEvent.emit(shop())">Editare</button>
      <button type="button" class="primary block" (click)="deleteShopEvent.emit(shop())">Blocare</button>
    </div>
  `,
  styleUrls: ["./admin-shop-list-item.css"],
})
export class ShopItem {
  shop = input.required<ShopInfo>();
  editShopEvent = output<ShopInfo>();
  deleteShopEvent = output<ShopInfo>();
}