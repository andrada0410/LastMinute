import { Component, inject, OnInit} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AdminShopList } from "../admin-shop-list/admin-shop-list";
import { ShopService } from "../services/shop.service";
import { AdminCreateShop } from "../admin-create-shop/admin-create-shop";
import { CreateShopRequest, ShopInfo } from "../shop";
import { ShopEdit } from "../shop-edit/shop-edit";
import { ToastService } from "../services/toast.service";
import { ConfirmDelete } from "../confirm-delete/confirm-delete";

@Component({
  selector: "app-super-admin-page",
  standalone: true,
  imports: [ReactiveFormsModule, AdminShopList, AdminCreateShop, ShopEdit, ConfirmDelete],
  template: `
    <div class="admin-dashboard-layout">
      <section class="list-section">
        <app-shop-list
          [shops]="shops"
          [totalItems]="totalItems"
          [currentPage]="currentPage"
          (changePageEvent)="loadShops($event)"
          (editShopEvent)="shopToEdit = $event"
          (deleteShopEvent)="shopToDelete = $event"
          (searchEvent)="onSearch($event)"
          (clearSearchEvent)="clearSearch()"
        ></app-shop-list>
      </section>

      <section class="form-section">
        <app-admin-create-shop
          (addShopEvent)="handleShopAdded($event)"
          [requestStatus]="requestStatus"
        ></app-admin-create-shop>
      </section>
    </div>

    @if(shopToEdit) {
      <app-shop-edit
        [shop]="shopToEdit"
        (save)="handleEditShop($event)"
        (cancel)="shopToEdit = null">
      </app-shop-edit>
    }

    @if(shopToDelete) {
      <app-confirm-delete
        [message]="'Sigur dorești să blochezi magazinul ' + shopToDelete.name + '?'"
        (confirm)="handleDeleteShop()"
        (cancel)="shopToDelete = null">
      </app-confirm-delete>
    }
  `,

  styleUrls: ["./admin.css"],
})
export class Admin implements OnInit {
  shopService = inject(ShopService);
  toastService = inject(ToastService);
  shops: ShopInfo[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  requestStatus: "loading" | "success" = "loading";

  shopToEdit: ShopInfo | null = null;
  shopToDelete: ShopInfo | null = null;

  searchEmail: string = "";

  ngOnInit(): void {
    this.loadShops(this.currentPage);
  }

  onSearch(email: string) {
    this.searchEmail = email.trim();
    this.loadShops(1);
  }

  clearSearch() {
    this.searchEmail = "";
    this.loadShops(1);
  }

  get isSearching(): boolean {
    return this.searchEmail.trim().length > 0;
  }

  handleShopAdded(shop: CreateShopRequest) {
    const { email, password, name, address } = shop;

    this.requestStatus = "loading";

    this.shopService.registerShop(email, password, name, address).subscribe({
      next: (response) => {
        this.requestStatus = "success";
        this.toastService.success('Creare efectuată cu succes');
        this.loadShops(1);
      },

      error: (error) => {
        const backendError = typeof error.error === 'string' ? error.error : (error.error?.error || "A apărut o eroare la crearea magazinului.");
        this.toastService.error(backendError, 'Eroare');
      },
    });
  }

  loadShops(page: number) {
    this.currentPage = page;
    const emailFilter = this.isSearching ? this.searchEmail.trim() : undefined;

    this.shopService.getShopsInfo(page, 5, emailFilter).subscribe({
      next: (response) => {
        this.shops = response.entry;
        this.totalItems = response.total;
        console.log(response);
      },
      error: (err) => {
        const loadError = typeof err.error === 'string' ? err.error : (err.error?.error || "Eroare la preluarea magazinelor.");
        this.toastService.error(loadError, "Eroare");
      },
    });
  }

  handleEditShop(data: { id: number; name: string; address: string }) {
    this.shopService.updateShop(data.id, data.name, data.address).subscribe({
      next: () => {
        this.shopToEdit = null;
        this.toastService.success('Editare efectuată cu succes');
        this.loadShops(this.currentPage);
      },
      error: (err) => {
        const editError = typeof err.error === 'string' ? err.error : (err.error?.error || "A apărut o eroare la editarea magazinului.");
        this.toastService.error(editError, 'Eroare');
      }
    });
  }

  handleDeleteShop() {
    if (!this.shopToDelete) return;

    this.shopService.deleteShop(this.shopToDelete.id).subscribe({
      next: () => {
        this.shopToDelete = null;
        this.toastService.success('Blocare efectuată cu succes');
        this.loadShops(this.currentPage);
      },
      error: (err) => {
        const deleteError = typeof err.error === 'string' ? err.error : (err.error?.error || "A apărut o eroare la ștergerea magazinului.");
        this.toastService.error(deleteError, 'Eroare');
        this.shopToDelete = null;
      }
    });
  }
}
