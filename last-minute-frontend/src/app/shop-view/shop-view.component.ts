import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ShopService } from '../services/shop.service';
import { Shop } from '../shop';
import { isOfferInfo, isOfferProduct, OfferInfo, OfferProduct } from '../offer';
import { OfferTicketComponent } from '../offer-ticket/offer-ticket.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CATEGORY_TRANSLATIONS } from '../category';
import { OfferService } from '../services/offer.service';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { CreateReservationRequest } from '../reservation';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-shop-view',
  standalone: true,
  imports: [OfferTicketComponent],
  template: `
      @if (shop) {
        <div class="shop-view-page">
        <div class="shop-hero">
            <img [src]="getBannerUrl()" class="banner-img" alt="Banner">
            <div class="logo-container">
            <img [src]="getLogoUrl()" class="logo-img" alt="Logo">
            </div>
        </div>
        <div class="shop-content">
            <h1>{{ shop.name }}</h1>
            <span class="category-badge">{{ CATEGORY_TRANSLATIONS[shop.categoryName] || 'CATEGORIE NESPECIFICATĂ' }}</span>

            <section class="info-section">
            <h2>Despre noi</h2>
            <p>{{ shop.details }}</p>
            </section>

            <section class="info-section contact-info">
            <h2>Contact</h2>
            <ul>
                <li><strong>Adresă:</strong> {{ shop.address || 'Nespecificat' }}</li>
                <li><strong>Email:</strong> {{ shop.contact.email || 'Nespecificat' }}</li>
            </ul>
            </section>

            <section class="info-section">
            <h2>Oferta zilei</h2>

            @if (currentOfferInfo) {
              <app-offer-ticket
                [offer]="currentOfferInfo"
                [products]="currentOfferProducts"
                [isLoggedIn]="authService.isLoggedIn()"
                (reserve)="handleReservation($event)"
                >
                </app-offer-ticket>
            } @else {
              <p class="text-muted">Momentan nu există oferte disponibile pentru acest magazin.</p>
            }
            </section>
          </div>
        </div>
      }

      @if (!shop && !errorMessage) {
        <div class="loading">
            Se încarcă detaliile magazinului...
        </div>
      }

      @if (errorMessage) {
        <div class="error">
          {{ errorMessage }}
        </div>
      }        
    `,
  styleUrls: ['./shop-view.component.css'],
})
export class ShopViewComponent implements OnInit {
  private shopService = inject(ShopService);
  private offerService = inject(OfferService);
  private toastService = inject(ToastService);
  authService = inject(AuthService);
  private reservationService = inject(ReservationService);
  private route = inject(ActivatedRoute);
  public CATEGORY_TRANSLATIONS = CATEGORY_TRANSLATIONS;

  public shop: Shop | null = null;
  public currentOfferInfo: OfferInfo | null = null;
  public currentOfferProducts: OfferProduct[] = [];
  public errorMessage: string = '';

  private router = inject(Router);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const shopId = Number(idParam);
      this.loadShopDetails(shopId);
      this.loadOffer(shopId);
    } else {
      this.errorMessage = 'ID-ul magazinului lipsește.';
    }
  }

  private loadShopDetails(id: number): void {
    this.shopService.getShopById(id).subscribe({
      next: (data) => this.shop = data,
      error: () => {
        this.toastService.error("Magazinul accesat este blocat.");
        this.router.navigate(["/map"]);
      }
    });
  }

  private loadOffer(shopId: number): void {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    this.offerService.getOffer(
        shopId,
        startDate.toISOString(),
        endDate.toISOString()
    ).subscribe({
        next: (response) => {
            this.currentOfferInfo = response.entry.find(isOfferInfo) ?? null;
            this.currentOfferProducts = response.entry.filter(isOfferProduct);
        },
        error: () => {
            this.toastService.error(
                "Nu am putut încărca oferta.",
                "Eroare"
            );
        }
    });
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

  public getBannerUrl(): string {
    return this.resolveImagePath(this.shop?.bannerPath, 'assets/shop-dashboard/default-banner.png');
  }

  public getLogoUrl(): string {
    return this.resolveImagePath(this.shop?.logoPath, 'assets/shop-dashboard/default-logo.png');
  }

  public handleReservation(event: CreateReservationRequest) {
    if (!this.currentOfferInfo) return;

    this.reservationService
      .createReservation(event.offerId, event.productId, event.quantity)
      .subscribe({
        next: (response) => {
          const product = this.currentOfferProducts.find(
            (p) => p.id === event.productId,
          );
          if (product) {
            product.quantity -= event.quantity;
          }

          this.toastService.success(
            "Rezervarea a fost plasată cu succes!",
            "Succes",
          );
        },

        error: (err) => {
          const errorMessage =
            err.error?.error || "A apărut o eroare la procesarea rezervării.";
          this.toastService.error(errorMessage, "Eroare");
        },
      });
  }
}
