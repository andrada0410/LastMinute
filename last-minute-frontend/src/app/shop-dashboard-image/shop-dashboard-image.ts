import { Component, output, input, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

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
            <input type="file" accept="image/jpeg, image/png, image/webp" (change)="onFileChange($event)">
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

  toastService = inject(ToastService);

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackImage();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.toastService.error("Te rugăm să încarci doar imagini de tip JPG, PNG, WEBP.");
      input.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.toastService.error("Imaginea este prea mare. Dimensiunea maximă este de 5MB.");
      input.value = "";
      return;
    }

    this.imageSelected.emit(file);

  }
}