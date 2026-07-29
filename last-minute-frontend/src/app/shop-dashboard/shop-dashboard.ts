import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShopDashboardImage } from '../shop-dashboard-image/shop-dashboard-image';
import { ShopService } from '../services/shop.service';
import { Shop } from '../shop';

@Component({
  selector: 'shop-dashboard',
  standalone: true,
  imports: [FormsModule, ShopDashboardImage],
  template: `
    <section class="page">
      <form class="dashboard-page form-card" [class.is-editing]="isEditing()" #shopForm="ngForm" (ngSubmit)="onSubmit()">

        <div class="page-head">
          <div>
            <h1>Dashboard</h1>
            <p class="text-muted">Profilul magazinului tau</p>
          </div>

          @if (!isEditing()) {
            <div class="view-actions">
              <button type="button" class="button primary" (click)="startEditing()">Editeaza profilul</button>
            </div>
          }

          @if (isEditing()) {
            <div class="edit-only">
              <button type="button" class="button secondary" (click)="cancelEditing()">Anuleaza</button>
              <button type="submit" class="button primary" [disabled]="shopForm.invalid || !hasChanges()">Salveaza modificarile</button>
            </div>
          }
        </div>

        @if (errorMessage()) {
          <p class="message error">{{ errorMessage() }}</p>
        }

        <div class="card shop-card">

          <!-- Banner -->
          <div class="shop-banner">
            <app-shop-dashboard-image
              [imageUrl]="bannerUrl"
              altText="Banner magazin"
              label="Schimbă banner-ul"
              [isEditing]="isEditing()"
              (imageSelected)="onImagePicked($event, 'banner')"
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
              />
            </div>
          </div>

          <div class="shop-body">

            <!-- Shop Name -->
            <div class="field-group">
              <span class="field-label">Denumire</span>
                <div class="shop-name-view">{{ name }}</div>
            </div>

            <!-- Details -->
            <div class="field-group">
              <span class="field-label">Detalii</span>
              @if (!isEditing()) {
                <p class="field-value muted">{{ details }}</p>
              }
              @if (isEditing()) {
                <textarea class="field-edit" name="details" [(ngModel)]="details" placeholder="Descrie magazinul..."></textarea>
              }
            </div>
          </div>
        </div>
      </form>
    </section>
  `,
  styleUrls: ['./shop-dashboard.css'],
})
export class ShopDashboard implements OnInit {
  private shopService = inject(ShopService);

  isEditing = signal(false);
  errorMessage = signal('');

  shopId: number | null = null;
  name = 'Nume Magazin';
  details = 'Descriere magazin...';
  bannerUrl = '';
  logoUrl = '';

  private bannerFile: File | null = null;
  private logoFile: File | null = null;

  private initialDetails = '';
  private initialBannerUrl = '';
  private initialLogoUrl = '';

  ngOnInit(): void {
    this.loadShopProfile();
  }

  private clearSelectedFiles(): void {
    this.logoFile = null;
    this.bannerFile = null;
  }

  hasChanges(): boolean {
    return (
      this.details !== this.initialDetails ||
      this.logoFile !== null ||
      this.bannerFile !== null
    );
  }

  loadShopProfile(): void {
    this.shopService.getMyShop().subscribe({
      next: (shop: Shop) => {
        this.applyProfile(shop);
      },
      error: () => this.errorMessage.set('Nu am putut incarca datele magazinului.')
    });
  }

  private applyProfile(shop: Shop): void {
    this.shopId = shop.id;
    this.name = shop.name || '';
    this.details = shop.details || '';
    this.bannerUrl = shop.bannerPath ? `${this.shopService.url}/uploads/${shop.bannerPath}` : 'assets/shop-dashboard/default-banner.png';
    this.logoUrl = shop.logoPath ? `${this.shopService.url}/uploads/${shop.logoPath}` : 'assets/shop-dashboard/default-logo.png';

    this.initialDetails = this.details;
    this.initialBannerUrl = this.bannerUrl;
    this.initialLogoUrl = this.logoUrl;
  }

  startEditing(): void {
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
    this.errorMessage.set('');
    this.clearSelectedFiles();
    this.loadShopProfile();
  }

  onImagePicked(file: File, type: 'banner' | 'logo'): void {
    if (type === 'banner') {
      this.bannerFile = file;
    } else {
      this.logoFile = file;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'banner') {
        this.bannerUrl = reader.result as string;
      } else {
        this.logoUrl = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (!this.shopId) {
      this.errorMessage.set('ID-ul magazinului nu este disponibil.');
      return;
    }

    this.errorMessage.set('');

    this.shopService
      .updateShopDashboard(this.shopId, {
        details: this.details,
        logo: this.logoFile,
        banner: this.bannerFile
      })
      .subscribe({
        next: () => {
          this.isEditing.set(false);
          this.clearSelectedFiles();
          this.loadShopProfile();
        },
        error: () => {
          this.errorMessage.set('Salvarea modificărilor a eșuat.');
        }
      });
  }
}