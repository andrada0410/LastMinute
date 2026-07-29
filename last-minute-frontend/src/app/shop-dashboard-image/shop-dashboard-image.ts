import { Component, output, input } from '@angular/core';

@Component({
  selector: 'app-shop-dashboard-image',
  standalone: true,
  template: `
    <div class="image-container" [class.is-editing]="isEditing()">
      <img
      [src]="imageUrl()"
      [alt]="altText()"
      (error)="onImageError($event)">

      @if (isEditing()) {
        <div class="image-edit-overlay">
          <label class="image-edit-label">
            <span>{{ label() }}</span>
            <input type="file" accept="image/*" (change)="onFileChange($event)">
          </label>
        </div>
      }
    </div>
  `,
  styleUrls: ['./shop-dashboard-image.css']
})
export class ShopDashboardImage {
  imageUrl = input('');
  altText = input('Imagine');
  label = input('Schimbă imaginea');
  isEditing = input(false);

  imageSelected = output<File>();

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;

    if (img.alt === 'Logo magazin') {
      img.src = 'assets/shop-dashboard/default-logo.png';
    } else {
      img.src = 'assets/shop-dashboard/default-banner.png';
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.imageSelected.emit(file);
    }
  }
}