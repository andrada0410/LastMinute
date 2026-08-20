import { Component, AfterViewInit, OnDestroy, NgZone, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { ShopService } from '../services/shop.service';
import { ShopMapInfo, ShopsMapResponse } from '../shop';
import { MapShopDetailsComponent } from './shop-details/map-shop-details.component';
import { MapFiltersComponent } from "../map-filters/map-filters";
import { Category, CATEGORY_TRANSLATIONS } from "../category";
import { MapFilters } from "../filter";
import { ToastService } from "../services/toast.service";
import { FavoritesService } from '../services/favorites.service';
import { AuthService } from '../services/auth.service';
import { OfferService } from '../services/offer.service';

@Component({
  selector: "app-map",
  standalone: true,
  imports: [MapShopDetailsComponent, MapFiltersComponent],
  template: `
    <div class="map-container">
      <app-map-filters
        [categories]="categoriesList"
        (filtersChange)="onFiltersChanged($event)"
        [priceUpperBound]="maxPrice"
      >
      </app-map-filters>

      <div class="map-frame">
        <div id="map"></div>
      </div>
      <app-map-shop-details
        [shop]="hoveredShop"
        [logoPath]="hoveredShopLogoPath"
        [isVisible]="areShopDetailsVisible"
        [top]="cardTop"
        [left]="cardLeft"
        [isFlipped]="isFlippedDown"
        (mouseEnter)="onKeepShopDetailsVisible()"
        (mouseLeave)="onHideShopDetails()"
        [isFavorite]="isHoveredFavorite"
        (toggleFavorite)="onToggleFavorite($event)"
        [isLoggedIn]="authService.isLoggedIn()";
      >
      </app-map-shop-details>
    </div>
  `,
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private userMarker?: L.CircleMarker;
  private accuracyCircle?: L.Circle;
  private addressMarkers = new Map<number, L.Marker>();
  private shopsList: ShopMapInfo[] = [];

  categoriesList: Category[] = [];
  currentFilters?: MapFilters;

  public hoveredShop?: ShopMapInfo;
  public hoveredShopLogoPath: string = "";
  public areShopDetailsVisible: boolean = false;
  public cardTop: number = 0;
  public cardLeft: number = 0;
  public isFlippedDown: boolean = false;
  private hideShopDetailsTimeout?: ReturnType<typeof setTimeout>;
  private switchShopTimeout?: ReturnType<typeof setTimeout>;

  favoriteShopsIds: number[] = [];
  maxPrice: number = 0;

  constructor(
    private shopService: ShopService,
    private zone: NgZone,
    private router: Router,
    private toastService: ToastService,
    private favoritesService: FavoritesService,
    private offerService: OfferService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadMaxPrice();
    if (this.authService.isLoggedIn()) {
      this.loadFavorites();
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = L.map("map", {
      center: [46.77, 23.58],
      zoom: 13,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(this.map);

    this.map.on("locationfound", (e: L.LocationEvent) => {
      const radius = e.accuracy;

      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }

      if (this.accuracyCircle) {
        this.map.removeLayer(this.accuracyCircle);
      }

      this.userMarker = L.circleMarker(e.latlng, {
        radius: 10,
        color: "var(--bg-color)",
        weight: 4,
        fillColor: "var(--primary-color)",
        fillOpacity: 1,
      })
        .addTo(this.map)
        .bindPopup(
          `
          <strong>📍 Locatia ta</strong><br>
          
        `,
        )
        .openPopup();

      this.accuracyCircle = L.circle(e.latlng, {
        radius: radius,
        color: "var(--primary-color)",
        fillColor: "var(--primary-color)",
        fillOpacity: 0.15,
      }).addTo(this.map);
    });

    this.map.on("locationerror", (e: L.ErrorEvent) => {
      alert("Nu ai permis accesul la locație.");
      console.error(e.message);
    });

    this.map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
    });

    this.loadShopsFromDatabase();
  }

  private loadShopsFromDatabase(): void {
    this.shopService.getAllShopMapInfo(this.currentFilters).subscribe({
      next: (response: ShopsMapResponse) => {
        this.clearMapMarkers();
        this.shopsList = response.entry;
        this.showAllShopsOnMap(this.shopsList);
      },
      error: (error) => {
        console.error("Eroare la preluarea magazinelor:", error);
        this.toastService.error("Nu am putut încărca magazinele.");
      },
    });
  }

  private async showAllShopsOnMap(shops: ShopMapInfo[]): Promise<void> {
    for (const shop of shops) {
      if (shop.lat && shop.lon) {
        this.displayShopOnMap(shop);
      }
    }
  }

  private displayShopOnMap(shop: ShopMapInfo) {
    const isFavorite = this.favoriteShopsIds.includes(shop.id);
    const icon = this.createShopIcon(shop.hasOffers || false, isFavorite);

    if (!shop.lat || !shop.lon)
      throw new Error(
        "Eroare la afisarea magazinului pe hartă: Nu a fost furnizată locația.",
      );

    const marker = L.marker([shop.lat, shop.lon], { icon }).addTo(this.map);

    marker.on("mouseover", (e: L.LeafletMouseEvent) => {
      this.zone.run(() => {
        const wasSwitching = !!this.switchShopTimeout;

        if (this.hideShopDetailsTimeout) {
          clearTimeout(this.hideShopDetailsTimeout);
        }

        if (this.switchShopTimeout) {
          clearTimeout(this.switchShopTimeout);
        }

        if (
          (this.areShopDetailsVisible || wasSwitching) &&
          this.hoveredShop &&
          this.hoveredShop !== shop
        ) {
          this.areShopDetailsVisible = false;
          this.switchShopTimeout = setTimeout(() => {
            this.showNewCard(shop, e);
          }, 250);
        } else {
          this.showNewCard(shop, e);
        }
      });
    });

    marker.on("mouseout", () => {
      this.zone.run(() => {
        this.hideShopDetailsTimeout = setTimeout(() => {
          this.areShopDetailsVisible = false;
        }, 200);
      });
    });

    marker.on("click", () => {
      this.zone.run(() => {
        this.router.navigate(["/shop", shop.id]);
      });
    });

    this.addressMarkers.set(shop.id, marker);
  }

  public onKeepShopDetailsVisible(): void {
    if (this.hideShopDetailsTimeout) {
      clearTimeout(this.hideShopDetailsTimeout);
    }
    this.areShopDetailsVisible = true;
  }

  public onHideShopDetails(): void {
    this.hideShopDetailsTimeout = setTimeout(() => {
      this.areShopDetailsVisible = false;
    }, 200);
  }

  private showNewCard = (shop: ShopMapInfo, e: L.LeafletMouseEvent) => {
    this.hoveredShop = shop;
    this.hoveredShopLogoPath = this.resolveLogoPath(shop.logoPath);

    const point = this.map.latLngToContainerPoint(e.latlng);
    const mapSize = this.map.getSize();

    this.cardLeft = this.getSafeHorizontalPosition(point.x, mapSize.x);
    this.cardTop = point.y;
    this.isFlippedDown = this.shouldFlipCardDown(point.y);
    this.areShopDetailsVisible = true;
  };

  private resolveLogoPath(logoPath?: string): string {
    if (!logoPath) {
      return "assets/shop-dashboard/default-logo.png";
    }

    const isExternalLink = /^https?:\/\//i.test(logoPath);

    return isExternalLink
      ? logoPath
      : `${this.shopService.url}/uploads/${logoPath}`;
  }

  private getSafeHorizontalPosition(targetX: number, mapWidth: number): number {
    const cardHalfWidth = 160;
    const padding = 10;

    if (targetX < cardHalfWidth + padding) {
      return cardHalfWidth + padding;
    }

    if (targetX > mapWidth - cardHalfWidth - padding) {
      return mapWidth - cardHalfWidth - padding;
    }

    return targetX;
  }

  private shouldFlipCardDown(targetY: number): boolean {
    const verticalThreshold = 120;
    return targetY < verticalThreshold;
  }

  private createShopIcon(hasOffers: boolean, isFavorite: boolean): L.DivIcon {
    const color = hasOffers ? "var(--primary-color)" : "#020203";

    const heartImg = isFavorite ? `<img class="pin-heart-icon" src="assets/white-heart.svg" alt="favorite"/> `
      : "";

    return L.divIcon({
      className: "shop-marker",
      html: `
      <div style="
        width: 26px;
        height: 26px;
        background: ${color};
        border: 3px solid var(--bg-color);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${heartImg}
      </div>
    `,
      iconSize: [26, 26],
      iconAnchor: [13, 26],
      popupAnchor: [0, -26],
    });
  }
  private loadCategories(): void {
    this.shopService.getShopCategories().subscribe({
      next: (data) => {
        this.categoriesList = data.map((category) => {
          return {
            id: category.id,
            name: CATEGORY_TRANSLATIONS[category.name] || category.name,
          };
        });
      },

      error: (err) => {
        console.error("Eroare la incarcarea categoriilor", err);
        this.toastService.error("Nu am putut încărca categoriile.");
      },
    });
  }

  onFiltersChanged(filters: MapFilters): void {
    this.currentFilters = filters;
    this.loadShopsFromDatabase();
  }

  private clearMapMarkers(): void {
    this.addressMarkers.forEach(marker => this.map.removeLayer(marker));
    this.addressMarkers.clear();
  }

  private loadFavorites(): void {
    this.favoritesService.getFavoriteShopsIds().subscribe({
      next: (ids) => {
        this.favoriteShopsIds = ids;

        if (this.addressMarkers.size > 0) {
          this.addressMarkers.forEach((marker, shopId) => this.updateMarkerIcon(shopId));
        }
      },

      error: (error) => {
        this.toastService.error("Nu am putut încărca magazinele favorite.");
      },
    });
  }

  get isHoveredFavorite(): boolean {
    if (!this.hoveredShop) return false;
    return this.favoriteShopsIds.includes(this.hoveredShop.id);
  }

  public onToggleFavorite(shopId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error(
        "Trebuie să fii autentificat pentru a adăuga la favorite.",
      );
      return;
    }

    const isFavorite = this.favoriteShopsIds.includes(shopId);
    if (isFavorite) {
      this.favoritesService.removeFavorite(shopId).subscribe({
        next: () => {
          this.favoriteShopsIds = this.favoriteShopsIds.filter(
            (id) => id !== shopId,
          );
          this.updateMarkerIcon(shopId);
          this.toastService.success("Magazinul a fost șters din favorite.");

          if (this.currentFilters?.onlyFavorites) {
            if (this.hoveredShop?.id === shopId) {
              this.areShopDetailsVisible = false;
            }
            this.loadShopsFromDatabase();
          }
        },

        error: () =>
          this.toastService.error("Nu am putut șterge magazinul din favorite."),
      });
    } else {
      this.favoritesService.addFavorite(shopId).subscribe({
        next: () => {
          this.favoriteShopsIds = [...this.favoriteShopsIds, shopId];
          this.updateMarkerIcon(shopId);
          this.toastService.success("Magazinul a fost adăugat la favorite!");
        },

        error: () =>
          this.toastService.error("Nu am putut adăuga magazinul la favorite."),
      });
    }
  }

  private updateMarkerIcon(shopId: number): void {
    const marker = this.addressMarkers.get(shopId);
    const shop = this.shopsList.find(s => s.id === shopId);

    if (marker && shop) {
      const isFavorite = this.favoriteShopsIds.includes(shopId);
      const newIcon = this.createShopIcon(shop.hasOffers || false, isFavorite);
      marker.setIcon(newIcon);
    }
  }

  private loadMaxPrice() {
    this.offerService.getMaxPriceToday().subscribe({
      next: (res) => {
        this.maxPrice = res > 0 ? Math.ceil(res) : 100;
      },

      error: () => {
        this.maxPrice = 100;
      }
    })
  }
}
