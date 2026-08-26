import { Component, input, output, signal } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper-modal',
  standalone: true,
  imports: [ImageCropperComponent],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalTitle() }}</h3>
        </div>

        @if (recommendation()) {
          <div class="recommendation-box">
            <strong> Recomandare:</strong> {{ recommendation() }}
          </div>
        }
        
        <div class="cropper-container">
          <image-cropper
            [imageFile]="imageFile()"
            [maintainAspectRatio]="true"
            [aspectRatio]="aspectRatio()"
            format="jpeg"
            (imageCropped)="imageCropped($event)"
          ></image-cropper>
        </div>

        <div class="actions">
          <button type="button" class="btn-cancel" (click)="cancel()">Anulează</button>
          <button type="button" class="btn-save" (click)="save()">Salvează</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./image-cropper.css']
})
export class ImageCropperModal {
  imageFile = input<File | undefined>(undefined);
  aspectRatio = input<number>(1);
  modalTitle = input<string>('Decupează Imaginea');
  recommendation = input<string>('');

  cropped = output<Blob>();
  closed = output<void>();

  croppedImageBlob = signal<Blob | null>(null);

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageBlob.set(event.blob ?? null);
  }

  save() {
    const blob = this.croppedImageBlob();
    if (blob) {
      this.cropped.emit(blob);
    }
  }

  cancel() {
    this.closed.emit();
  }
}