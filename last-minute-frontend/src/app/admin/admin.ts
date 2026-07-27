import { Component, inject, OnInit} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AdminShopList } from "../admin-shop-list/admin-shop-list";
import { ShopService } from "../services/shop.service";
import { AdminCreateShop } from "../admin-create-shop/admin-create-shop";
import { CreateShopRequest, ShopInfo } from "../shop";
import { ShopEdit } from "../shop-edit/shop-edit";
import { ShopConfirmDelete } from "../shop-confirm-delete/shop-confirm-delete";

@Component({
  selector: "app-super-admin-page",
  standalone: true,
  imports: [ReactiveFormsModule, AdminShopList, AdminCreateShop, ShopEdit, ShopConfirmDelete],
  template: `
    <div class="admin-dashboard-layout">
      <section class="list-section">
        <app-shop-list
          [shops]="shops"
          [totalItems]="totalItems"
          [currentPage]="currentPage"
          (changePageEvent)="loadShops($event)"
          (editShopEvent)="shopToEdit = $event; editError = null"
          (deleteShopEvent)="shopToDelete = $event"
        ></app-shop-list>
      </section>

      <section class="form-section">
        <app-admin-create-shop
          (addShopEvent)="handleShopAdded($event)"
          [backendError]="backendError"
          [requestStatus]="requestStatus"
        ></app-admin-create-shop>
      </section>
    </div>

    @if(shopToEdit) {
      <app-shop-edit
        [shop]="shopToEdit"
        [backendError]="editError"
        (save)="handleEditShop($event)"
        (cancel)="shopToEdit = null">
      </app-shop-edit>
    }

    @if(shopToDelete) {
      <app-shop-confirm-delete
        (confirm)="handleDeleteShop()"
        (cancel)="shopToDelete = null">
      </app-shop-confirm-delete>
    }
  `,

  styleUrls: ["./admin.css"],
})
export class Admin implements OnInit {
  shopService = inject(ShopService);
  shops: ShopInfo[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  backendError: string | null = null;
  requestStatus: "loading" | "success" = "loading";

  shopToEdit: ShopInfo | null = null;
  shopToDelete: ShopInfo | null = null;
  editError: string | null = null;

  ngOnInit(): void {
    this.loadShops(this.currentPage);
  }

  handleShopAdded(shop: CreateShopRequest) {
    const { email, password, name, address } = shop;

    this.backendError = null;
    this.requestStatus = "loading";

    this.shopService.registerShop(email, password, name, address).subscribe({
      next: (response) => {
        this.requestStatus = "success";
        this.loadShops(1);
      },

      error: (error) => {
        this.backendError =
          error.error?.error || "A apărut o eroare la crearea magazinului.";
      },
    });
  }

  loadShops(page: number) {
    this.currentPage = page;
    this.shopService.getShopsInfo(page, 5).subscribe({
      next: (response) => {
        this.shops = response.entry;
        this.totalItems = response.total;
        console.log(response);
      },
      error: (err) => {
        console.error("Eroare la preluarea magazinelor:", err);
      },
    });
  }

  handleEditShop(data: { id: number; name: string; address: string }) {
    this.editError = null;

    this.shopService.updateShop(data.id, data.name, data.address).subscribe({
      next: () => {
        this.shopToEdit = null;
        this.loadShops(this.currentPage);
      },
      error: (err) => {
        this.editError = err.error?.error || "A apărut o eroare la editarea magazinului.";
      }
    });
  }

  handleDeleteShop() {
    if (!this.shopToDelete) return;

    this.shopService.deleteShop(this.shopToDelete.id).subscribe({
      next: () => {
        this.shopToDelete = null;
        this.loadShops(this.currentPage);
      },
      error: (err) => {
        console.error("Eroare la ștergerea magazinului:", err);
        this.shopToDelete = null;
      }
    });
  }

}
