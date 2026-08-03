import { Component, output, input } from '@angular/core';

@Component({
  selector: 'app-shop-dashboard-image',
  standalone: true,
  template: `
    <div class="image-container" [class.is-editing]="isEditing()">
      <img
      [src]="imageUrl() || fallbackImage()"
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
  fallbackImage = input('');

  imageSelected = output<File>();

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackImage();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.imageSelected.emit(file);
    }
  }
}