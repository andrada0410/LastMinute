import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShopDashboardImage } from "../shop-dashboard-image/shop-dashboard-image";
import { ShopService } from "../services/shop.service";
import { Shop } from "../shop";
import { ToastService } from "../services/toast.service";
import { ShopCategorySelect } from "../shop-category-select/shop-category-select";
import { Category, CATEGORY_TRANSLATIONS } from "../category";
import { ShopDashboardProductList } from "../shop-dashboard-product-list/shop-dashboard-product-list";
import { ProductService } from "../services/product.service";
import { Product } from "../product";
import { ShopDashboardProductForm } from "../shop-dashboard-product-form/shop-dashboard-product-form";
import { ConfirmDelete } from '../confirm-delete/confirm-delete';
import { CreateOfferRequest } from "../offer";
import { OfferService } from "../services/offer.service"; // presupun ca exista deja
import { ShopOfferForm } from '../shop-offer-form/shop-offer-form';
import { debounceTime, Subject } from "rxjs";
import { SearchBar } from "../shop-dashboard-search-bar/shop-dashboard-search-bar";

@Component({
  selector: "shop-dashboard",
  standalone: true,
  imports: [
    FormsModule,
    ShopDashboardImage,
    ShopCategorySelect,
    ShopDashboardProductList,
    ShopDashboardProductForm,
    ConfirmDelete,
    SearchBar,
    ShopOfferForm
  ],
  template: `
    <section class="page">
      <form
        class="dashboard-page form-card"
        [class.is-editing]="isEditing()"
        #shopForm="ngForm"
        (ngSubmit)="onSubmit()"
      >
        <div class="page-head">
          <div>
            <h1>Dashboard</h1>
            <p class="text-muted">Profilul magazinului tau</p>
          </div>

          @if (!isEditing()) {
            <div class="view-actions">
              <button
                type="button"
                class="button primary"
                (click)="startEditing()"
              >
                Editeaza profilul
              </button>
            </div>
          }

          @if (isEditing()) {
            <div class="edit-only">
              <button
                type="button"
                class="button secondary"
                (click)="cancelEditing()"
              >
                Anuleaza
              </button>
              <button
                type="submit"
                class="button primary"
                [disabled]="shopForm.invalid || !hasChanges()"
              >
                Salveaza modificarile
              </button>
            </div>
          }
        </div>

        <div class="card shop-card">
          <!-- Banner -->
          <div class="shop-banner">
            <app-shop-dashboard-image
              [imageUrl]="bannerUrl"
              altText="Banner magazin"
              label="Schimbă banner-ul"
              [isEditing]="isEditing()"
              (imageSelected)="onImagePicked($event, 'banner')"
              [fallbackImage]="'assets/shop-dashboard/default-banner.png'"
              ;
            />
          </div>

          <!-- Logo -->
          <div class="shop-header">
            <div class="shop-logo">
              <app-shop-dashboard-image
                [imageUrl]="logoUrl"
                altText="Logo magazin"
                label="Schimbă logo-ul"
                [isEditing]="isEditing()"
                (imageSelected)="onImagePicked($event, 'logo')"
                [fallbackImage]="'assets/shop-dashboard/default-logo.png'"
              />
            </div>
          </div>

          <div class="shop-body">
            <!-- Shop Name -->
            <div class="field-group">
              <span class="field-label">Denumire</span>
              <div class="shop-name-view">{{ name }}</div>
            </div>

            <div class="field-group">
              <span class="field-label">Categorie</span>
              @if (!isEditing()) {
                <p class="field-value muted">{{ categoryName }}</p>
              }

              @if (isEditing()) {
                <app-shop-category-select
                  [categories]="categories"
                  [(selectedId)]="categoryId"
                />
              }
            </div>

            <!-- Details -->
            <div class="field-group">
              <span class="field-label">Detalii</span>
              @if (!isEditing()) {
                <p class="field-value muted">{{ details }}</p>
              }
              @if (isEditing()) {
                <textarea
                  class="field-edit"
                  name="details"
                  [(ngModel)]="details"
                  #detailsField="ngModel"
                  maxlength="1000"
                  placeholder="Descrie magazinul..."
                ></textarea>

                @if (detailsField.invalid && detailsField.touched) {
                  @if (detailsField.errors?.["maxlength"]) {
                    <p class="error-text">
                      Detaliile nu pot avea mai mult de 1000 de caractere.
                    </p>
                  }
                }
              }
            </div>

            <hr class="section-divider" />

            <div class="products-header">
              <h2>Produse</h2>
              
              <div class="products-actions">
                <app-shop-dashboard-search-bar
                  [name]="searchName"
                  (nameChange)="onSearchChange($event)"
                />

                <button type="button" class="button add-offer" (click)="openCreateOffer()"> Creează ofertă </button>
                <button type="button" class="button primary add-product" (click)="openCreateProduct()"> Adaugă produs </button>
              </div>
            </div>

            @if (showOfferForm) {
              <app-shop-offer-form
                  [products]="products"
                  [backendError]="offerErrorMessage()"
                  (save)="saveOffer($event)"
                  (cancel)="closeOfferForm()">
              </app-shop-offer-form>
            }
            <app-shop-dashboard-product-list
              [products]="products"
              (edit)="openEditProduct($event)"
              (remove)="deleteProduct($event)"
            >
            </app-shop-dashboard-product-list>
          </div>
        </div>
      </form>
    </section>
    @if (showProductForm) {
      <app-shop-dashboard-product-form
        [product]="editingProduct"
        [backendError]="productErrorMessage()"
        (save)="saveProduct($event)"
        (cancel)="closeProductForm()"
      >
      </app-shop-dashboard-product-form>
    }
    @if (productPendingDelete !== null) {
      <app-confirm-delete
        message="Sigur dorești să ștergi acest produs?"
        (confirm)="confirmDeleteProduct()"
        (cancel)="productPendingDelete = null"
      >
      </app-confirm-delete>
    }
  `,
  styleUrls: ["./shop-dashboard.css"],
})
export class ShopDashboard implements OnInit {
  private offerService = inject(OfferService);

  showOfferForm = false;
  offerErrorMessage = signal("");

  openCreateOffer(): void {
    if (!this.shopId) {
      return;
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    this.offerService.getOffer(
      this.shopId,
      startDate.toISOString(),
      endDate.toISOString()
    ).subscribe({
      next: (response) => {
        const hasActiveOffer = response.entry.length > 0;

        if (hasActiveOffer) {
          this.toastService.error(
            "Magazinul are deja o ofertă activă astăzi. Puteți crea o nouă ofertă abia mâine.",
            "Ofertă existentă"
          );
          return;
        }

        this.offerErrorMessage.set("");
        this.showOfferForm = true;
      },
      error: () => {
        this.toastService.error("Nu am putut verifica ofertele existente.", "Eroare");
      }
    });
  }

  closeOfferForm(): void {
    this.showOfferForm = false;
    this.offerErrorMessage.set("");
  }

  saveOffer(data: CreateOfferRequest): void {
    if (!this.shopId) {
      return;
    }

    this.offerService.createOffer(this.shopId, data).subscribe({
      next: () => {
        this.closeOfferForm();
        this.toastService.success("Oferta a fost creată cu succes.", "Succes");
      },
      error: (err: any) => {
        const errorMessage = typeof err.error === "string" ? err.error : (err.error?.error || "Crearea ofertei a eșuat.");
        this.offerErrorMessage.set(errorMessage);
      }
    });
  }

  CATEGORY_TRANSLATIONS: Record<string, string> = {
    "Restaurant": "Restaurant",
    "Fast-Food": "Fast-Food",
    "Confectionery": "Cofetărie",
    "Bakery": "Patiserie",
    "Supermarket": "Supermarket"
  };

  private shopService = inject(ShopService);
  private toastService = inject(ToastService);
  private productService = inject(ProductService);

  isEditing = signal(false);

  showProductForm = false;
  editingProduct: Product | null = null;
  productErrorMessage = signal("");
  productPendingDelete: number | null = null;

  shopId: number | null = null;
  name = "Nume Magazin";
  details = "Descriere magazin...";
  bannerUrl = "";
  logoUrl = "";
  categoryName = "";

  categoryId: number | null = null;
  categories: Category[] = [];
  private initialCategoryId: number | null = null;

  products: Product[] = [];

  private bannerFile: File | null = null;
  private logoFile: File | null = null;

  private initialDetails = "";
  private initialBannerUrl = "";
  private initialLogoUrl = "";

  searchName: string = "";
  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadShopProfile();
    this.loadCategories();

    this.searchSubject.pipe(debounceTime(300)).subscribe((_) => {
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.shopService.getShopCategories().subscribe({
      next: (data) => {
        this.categories = data.map((category) => {
          return {
            id: category.id,
            name: CATEGORY_TRANSLATIONS[category.name] || category.name,
          };
        });
      },
      error: () =>
        this.toastService.error("Nu am putut incarca categoriile.", "Eroare"),
    });

    this.shopService.getMyShop().subscribe({
      next: (shop: Shop) => {
        this.applyProfile(shop);
        this.loadProducts();
      },
      error: () =>
        this.toastService.error(
          "Nu am putut incarca datele magazinului.",
          "Eroare",
        ),
    });
  }

  loadProducts(): void {
    if (!this.shopId) {
      return;
    }

    this.productService.getProducts(this.shopId, this.searchName).subscribe({
      next: (products) => {
        this.products = products;
      },
      error: () => {
        this.toastService.error("Nu am putut încărca produsele.", "Eroare");
      },
    });
  }

  openCreateProduct() {
    this.editingProduct = null;
    this.productErrorMessage.set("");
    this.showProductForm = true;
  }

  openEditProduct(product: Product) {
    this.editingProduct = product;
    this.productErrorMessage.set("");
    this.showProductForm = true;
  }

  closeProductForm() {
    this.showProductForm = false;
    this.editingProduct = null;
    this.productErrorMessage.set("");
  }

  saveProduct(data: {
    name: string;
    price: number;
    description: string;
    photo: File | null;
  }): void {
    if (!this.shopId) {
      return;
    }

    const isEditingAction = !!this.editingProduct;
    this.productErrorMessage.set("");

    const request$ = this.editingProduct
      ? this.productService.updateProduct(this.editingProduct.id, data)
      : this.productService.createProduct(this.shopId, data);

    request$.subscribe({
      next: () => {
        this.closeProductForm();
        this.loadProducts();

        const successMessage = isEditingAction
          ? "Produsul a fost actualizat cu succes."
          : "Produsul a fost adăugat cu succes.";
        this.toastService.success(successMessage, "Succes");
      },
      error: () => {
        const errorMessage = isEditingAction
          ? "Salvarea produsului a eșuat."
          : "Adăugarea produsului a eșuat.";
        this.toastService.error(errorMessage, "Eroare");
      },
    });
  }

  deleteProduct(productId: number): void {
    this.productPendingDelete = productId;
  }

  confirmDeleteProduct(): void {
    if (!this.shopId || this.productPendingDelete === null) {
      return;
    }

    this.productService.deleteProduct(this.productPendingDelete).subscribe({
      next: () => {
        this.productPendingDelete = null;
        this.loadProducts();
        this.toastService.success("Produsul a fost șters.", "Succes");
      },
      error: () => {
        this.productPendingDelete = null;
        this.toastService.error("Ștergerea produsului a eșuat.", "Eroare");
      },
    });
  }

  private clearSelectedFiles(): void {
    this.logoFile = null;
    this.bannerFile = null;
  }

  hasChanges(): boolean {
    return (
      this.details !== this.initialDetails ||
      this.logoFile !== null ||
      this.bannerFile !== null ||
      this.categoryId !== this.initialCategoryId
    );
  }

  loadShopProfile(): void {
    this.shopService.getMyShop().subscribe({
      next: (shop: Shop) => {
        this.applyProfile(shop);
      },
      error: (err) => {
        const errorMessage =
          typeof err.error === "string"
            ? err.error
            : err.error?.error || "Nu am putut incarca datele magazinului.";
        this.toastService.error(errorMessage, "Eroare");
      },
    });
  }

  private applyProfile(shop: Shop): void {
    this.shopId = shop.id;
    this.name = shop.name || "";
    this.details = shop.details || "";
    this.bannerUrl = this.resolveImagePath(shop.bannerPath, 'assets/shop-dashboard/default-banner.png');
    this.logoUrl = this.resolveImagePath(shop.logoPath, 'assets/shop-dashboard/default-logo.png');

    this.initialDetails = this.details;
    this.initialBannerUrl = this.bannerUrl;
    this.initialLogoUrl = this.logoUrl;

    if (shop.categoryName) {
      this.categoryName =
        CATEGORY_TRANSLATIONS[shop.categoryName] || shop.categoryName;
    } else {
      shop.categoryName = "-";
    }
    this.categoryId = shop.categoryId || null;
    this.initialCategoryId = this.categoryId;
  }

  private resolveImagePath(path?: string, fallback?: string): string {
    if (!path) {
      return fallback ?? '';
    }
    
    const isExternalLink = /^https?:\/\//i.test(path);
    
    return isExternalLink
      ? path
      : `${this.shopService.url}/uploads/${path}`;
  }

  startEditing(): void {
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    this.clearSelectedFiles();
    this.loadShopProfile();
  }

  onImagePicked(file: File, type: "banner" | "logo"): void {
    if (type === "banner") {
      this.bannerFile = file;
    } else {
      this.logoFile = file;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (type === "banner") {
        this.bannerUrl = reader.result as string;
      } else {
        this.logoUrl = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (!this.shopId) {
      this.toastService.error(
        "ID-ul magazinului nu este disponibil.",
        "Eroare",
      );
      return;
    }

    this.shopService
      .updateShopDashboard(this.shopId, {
        details: this.details,
        logo: this.logoFile,
        banner: this.bannerFile,
        categoryId: this.categoryId,
      })
      .subscribe({
        next: () => {
          this.isEditing.set(false);
          this.clearSelectedFiles();
          this.toastService.success("Editare efectuată cu succes");
          this.loadShopProfile();
        },
        error: (err) => {
          const errorMessage =
            typeof err.error === "string"
              ? err.error
              : err.error?.error || "Salvarea modificărilor a eșuat.";
          this.toastService.error(errorMessage, "Eroare");
        },
      });
  }

  onSearchChange(searchTerm: string): void {
    this.searchName = searchTerm;
    this.searchSubject.next(searchTerm);
  }

  clearSearch(): void {
    this.searchName = "";
    this.searchSubject.next("");
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }
}
