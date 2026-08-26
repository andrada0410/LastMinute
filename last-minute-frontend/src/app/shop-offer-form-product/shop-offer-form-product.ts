import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CapitalisePipe } from '../pipes/capitalise';

@Component({
  selector: 'app-shop-offer-form-product',
  standalone: true,
  imports: [ReactiveFormsModule, CapitalisePipe],
  template: `
    <div class="product-row" [formGroup]="group()">
      <label class="product-checkbox">
        <input type="checkbox" formControlName="included">
        {{ group().get('name')?.value | capitalise }}
      </label>

      <div class="product-row-fields">
        <div class="field-inline">
          <label>Cantitate:</label>
          <input type="number" min="1" step="1" formControlName="quantity">
        </div>

        <div class="field-inline">
          <label>Procent reducere:</label>
          <input type="number" min="5" max="100" formControlName="discountPercent">
        </div>
      </div>

      @if (group().get('quantity')?.invalid && group().get('quantity')?.touched) {
        <p class="error message">Cantitatea trebuie să fie un număr întreg mai mare ca 0.</p>
      }
      @if (group().get('discountPercent')?.invalid && group().get('discountPercent')?.touched) {
        <p class="error message">Procentul trebuie să fie un număr întreg între 5 și 100.</p>
      }
    </div>
  `,
  styleUrls: ['./shop-offer-form-product.css']
})
export class ShopOfferFormProduct {
  group = input.required<FormGroup>();
}