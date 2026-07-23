import { Component, input } from "@angular/core";
import { ShopInfo } from "../shop";

@Component({
  selector: "app-admin-shop-list-item",
  standalone: true,
  template: `
    <span class="shop-name">{{ shop().name }}</span>
    <span class="shop-email">{{ shop().email }}</span>
  `,
  styleUrls: ["./admin-shop-list-item.css"],
})
export class ShopItem {
  shop = input.required<ShopInfo>();
};
