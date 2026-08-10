import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-shop-dashboard-product-import",
  standalone: true,
  template: `
    <div class="form">
      <div class="form-content">
        <h2>Importă produse</h2>

        <div class="form-card">
          <p class="text-muted">
            Încarcă un fișier Excel cu produsele tale. Pentru a te asigura că
            importul funcționează corect, folosește template-ul nostru.
          </p>

          <div class="template-section">
            <a
              href="assets/template-products.xlsx"
              download
              class="template-link"
            >
              Descarcă Template Excel
            </a>
          </div>

          <hr class="section-divider" />

          <label>Selectează fișierul completat (.xls, .xlsx):</label>
          <input
            type="file"
            accept=".xls, .xlsx"
            (change)="onFileSelected($event)"
            class="file-input"
          />

          <div class="form-actions">
            <button
              type="button"
              class="button secondary"
              (click)="close.emit()"
            >
              Anulează
            </button>

            <button
              type="button"
              class="button primary"
              [disabled]="!selectedFile"
              (click)="onUpload()"
            >
              Importă fișierul
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./shop-dashboard-product-import.css"],
})
export class ShopDashboardProductImport {
  close = output<void>();
  upload = output<File>();

  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.upload.emit(this.selectedFile);
    }
  }
}