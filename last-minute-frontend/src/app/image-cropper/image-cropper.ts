import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper-modal',
  standalone: true,
  imports: [ImageCropperComponent],
  template: `
    <div class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
        </div>

        @if (recommendation) {
          <div class="recommendation-box">
            <strong> Recomandare:</strong> {{ recommendation }}
          </div>
        }
        
        <div class="cropper-container">
          <image-cropper
            [imageFile]="imageFile"
            [maintainAspectRatio]="true"
            [aspectRatio]="aspectRatio"
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
  @Input() imageFile: File | any = null;
  @Input() aspectRatio: number = 1;

  @Input() modalTitle: string = 'Decupează Imaginea';
  @Input() recommendation: string = '';

  @Output() cropped = new EventEmitter<Blob>();
  @Output() closed = new EventEmitter<void>();

  croppedImageBlob: Blob | null | undefined = null;

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImageBlob = event.blob;
  }

  save() {
    if (this.croppedImageBlob) {
      this.cropped.emit(this.croppedImageBlob);
    }
  }

  cancel() {
    this.closed.emit();
  }
}