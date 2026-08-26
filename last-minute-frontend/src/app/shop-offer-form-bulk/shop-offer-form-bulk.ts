import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-shop-offer-form-bulk',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="bulk-container">
      <div class="bulk-fields">
        <div class="field-group">
          <label>Cantitate (toate produsele selectate):</label>
          <input type="number" min="1" step="1" [formControl]="bulkQuantity">
        </div>

        <div class="field-group">
          <label>Procent reducere (toate produsele selectate):</label>
          <input type="number" min="5" max="100" step="1" [formControl]="bulkDiscount">
        </div>
      </div>

      @if ((bulkQuantity.invalid && bulkQuantity.touched) || (bulkDiscount.invalid && bulkDiscount.touched)) {
        <div class="bulk-errors">
          @if (bulkQuantity.invalid && bulkQuantity.touched) {
            <p class="error message">Cantitatea trebuie să fie un număr întreg mai mare ca 0.</p>
          }
          @if (bulkDiscount.invalid && bulkDiscount.touched) {
            <p class="error message">Procentul trebuie să fie un număr întreg între 5 și 100.</p>
          }
        </div>
      }

      <div class="bulk-actions">
        <button
          type="button"
          class="button secondary"
          [disabled]="bulkQuantity.invalid || bulkDiscount.invalid"
          (click)="apply()">
          Aplică la toate produsele
        </button>
      </div>
    </div>
  `,
   styleUrls: ["./shop-offer-form-bulk.css"]
})
export class ShopOfferFormBulk {
  applyBulk = output<{ quantity: number | null; discount: number | null }>();

  bulkQuantity = new FormControl<number | null>(null, [
    Validators.min(1),
    Validators.pattern('^[0-9]+$')
  ]);
  bulkDiscount = new FormControl<number | null>(null, [
    Validators.min(5), Validators.max(100),
    Validators.pattern('^[0-9]+$')
  ]);

  apply(): void {
    this.bulkQuantity.markAsTouched();
    this.bulkDiscount.markAsTouched();

    if (this.bulkQuantity.invalid || this.bulkDiscount.invalid) {
      return;
    }

    this.applyBulk.emit({
      quantity: this.bulkQuantity.value,
      discount: this.bulkDiscount.value
    });
  }
}